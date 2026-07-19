import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import http from "http";
import { getSimulatedNotes } from "./src/data/mockNotes.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to query the GCP Metadata Server
function fetchMetadata(pathStr: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "metadata.google.internal",
      path: pathStr,
      headers: { "Metadata-Flavor": "Google" },
      timeout: 1000,
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data.trim());
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });
    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
    req.end();
  });
}

let cachedProject: string | null = null;
let cachedLocation: string | null = null;

async function getVertexParams(): Promise<{ project: string; location: string }> {
  if (cachedProject && cachedLocation) {
    return { project: cachedProject, location: cachedLocation };
  }

  let project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || "";
  let location = process.env.CLOUD_RUN_REGION || "";

  if (!project) {
    try {
      project = await fetchMetadata("/computeMetadata/v1/project/project-id");
      console.log("[Metadata] Auto-detected Google Cloud Project ID:", project);
    } catch (err: any) {
      console.warn("[Metadata] Failed to fetch project ID from metadata server:", err.message);
    }
  }

  if (!location) {
    try {
      const zoneStr = await fetchMetadata("/computeMetadata/v1/instance/zone");
      console.log("[Metadata] Auto-detected zone:", zoneStr);
      const zoneParts = zoneStr.split("/");
      const zone = zoneParts[zoneParts.length - 1];
      if (zone) {
        const match = zone.match(/^(.*)-[a-z0-9]+$/);
        location = match ? match[1] : zone;
      }
      console.log("[Metadata] Auto-detected location/region:", location);
    } catch (err: any) {
      console.warn("[Metadata] Failed to fetch zone from metadata server:", err.message);
    }
  }

  // Fallbacks if still not found
  if (!project) project = "ais-asia-southeast1-5e0977f05c";
  if (!location) location = "asia-southeast1";

  cachedProject = project;
  cachedLocation = location;
  return { project, location };
}

// Helper to call Gemini either via Developer API key or via Vertex AI ADC
async function generateGeminiContent(params: {
  model: string;
  contents: string;
  config?: any;
}): Promise<{ response: any; source: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

  // 1. If we have an API Key, try the Developer API first
  if (hasValidKey) {
    try {
      console.log(`[Gemini] Attempting generation via Developer API using model: ${params.model}`);
      const devAi = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
      const response = await devAi.models.generateContent(params);
      return { response, source: "Developer API Key" };
    } catch (error: any) {
      console.warn("[Gemini] Developer API attempt failed or quota exceeded. Retrying via Vertex AI...", error.message || error);
    }
  } else {
    console.log("[Gemini] No Developer API key configured or placeholder found. Trying direct Vertex AI connection.");
  }

  // 2. Direct Connection Fallback: Try Vertex AI using Application Default Credentials (ADC)
  try {
    const { project, location } = await getVertexParams();
    console.log(`[Gemini] Attempting direct connection via Vertex AI (Project: ${project}, Location: ${location}) using model: ${params.model}`);

    const vertexAi = new GoogleGenAI({
      vertexai: true,
      project: project,
      location: location,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    try {
      const response = await vertexAi.models.generateContent(params);
      return { response, source: "Vertex AI Direct" };
    } catch (innerErr: any) {
      const errStr = (innerErr.message || String(innerErr)).toLowerCase();
      // If the specific model is not found on Vertex AI in this region or not supported, try a common baseline model
      if (errStr.includes("not found") || errStr.includes("not supported") || errStr.includes("404") || errStr.includes("invalid model")) {
        console.warn(`[Gemini] Model ${params.model} not available on Vertex AI in this region. Retrying with gemini-2.5-flash...`);
        const response = await vertexAi.models.generateContent({
          ...params,
          model: "gemini-2.5-flash"
        });
        return { response, source: "Vertex AI Direct (Fallback Model: gemini-2.5-flash)" };
      }
      throw innerErr;
    }
  } catch (vertexError: any) {
    console.error("[Gemini] Direct Vertex AI connection also failed:", vertexError.message || vertexError);
    throw vertexError;
  }
}

// API: Analyze Resource Configuration
app.post("/api/analyze", async (req, res) => {
  try {
    const { resources } = req.body;

    if (!resources) {
      return res.status(400).json({ error: "Missing resource configurations in request body." });
    }

    const resourceContextStr = JSON.stringify(resources, null, 2);

    const prompt = `Analyze the following natural resource management settings and provide a detailed ecological and sustainability assessment in JSON format:
    
    Current Simulation Parameters:
    ${resourceContextStr}
    
    Resource Descriptions:
    - Water: Allocation (${resources.water.allocation}%), Protection (${resources.water.protection}%), Pollution Cap (${resources.water.pollutionCap}%)
    - Forests: Logging Rate (${resources.forest.loggingRate}%), Reforestation Funding (${resources.forest.reforestation}%), Wilderness Protection (${resources.forest.wilderness}%)
    - Soil/Agri: Intensive Farming Index (${resources.soil.intensiveFarming}%), Organic Subsidies (${resources.soil.organicSubsidies}%), Soil Protection Law (${resources.soil.protectionLaw ? 'Active' : 'Inactive'})
    - Energy/Minerals: Fossil Reliance (${resources.energy.fossilReliance}%), Renewables Investment (${resources.energy.renewablesInvestment}%), Mining Restorations (${resources.energy.miningRestoration}%)
    
    Determine the ecological state and return a JSON payload with exactly this structure:
    {
      "sustainabilityScore": <number between 0 and 100>,
      "ecologicalHealthRating": <"Critical" | "Stressed" | "Moderate" | "Healthy" | "Exceptional">,
      "economicYieldRating": <"Low" | "Moderate" | "High" | "Maximum (Unsustainable)">,
      "summary": <string: general assessment overview (2-3 sentences)>,
      "risks": [
        { "title": <string>, "description": <string>, "severity": <"High" | "Medium" | "Low"> }
      ],
      "recommendations": [
        { "title": <string>, "action": <string>, "impact": <string> }
      ],
      "resourceAnalyses": {
        "water": <string: short analysis of water management choices>,
        "forest": <string: short analysis of timber and forest protection>,
        "soil": <string: short analysis of agriculture and soil degradation risk>,
        "energy": <string: short analysis of energy transition and resource extraction footprint>
      }
    }
    
    Ensure the JSON response is strictly compliant with the requested format. Do not wrap it in markdown code fences or add additional comments outside of the JSON output.`;

    let responseResult;
    try {
      responseResult = await generateGeminiContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["sustainabilityScore", "ecologicalHealthRating", "economicYieldRating", "summary", "risks", "recommendations", "resourceAnalyses"],
            properties: {
              sustainabilityScore: { type: Type.INTEGER },
              ecologicalHealthRating: { type: Type.STRING },
              economicYieldRating: { type: Type.STRING },
              summary: { type: Type.STRING },
              risks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["title", "description", "severity"],
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING }
                  }
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["title", "action", "impact"],
                  properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    impact: { type: Type.STRING }
                  }
                }
              },
              resourceAnalyses: {
                type: Type.OBJECT,
                required: ["water", "forest", "soil", "energy"],
                properties: {
                  water: { type: Type.STRING },
                  forest: { type: Type.STRING },
                  soil: { type: Type.STRING },
                  energy: { type: Type.STRING }
                }
              }
            }
          }
        }
      });
    } catch (e: any) {
      console.warn("Direct Gemini call failed, falling back to local simulator:", e.message || e);
      const simulatedData = generateSimulatedAnalysis(resources);
      return res.json({
        ...simulatedData,
        isSimulated: true,
        message: "Using pre-compiled local ecological models. To enable live dynamic responses with custom rules, you can set a custom API key in the Settings menu."
      });
    }

    const textOutput = responseResult.response.text;
    if (!textOutput) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedData = JSON.parse(textOutput.trim());
    return res.json({
      ...parsedData,
      isSimulated: false,
      message: `Analysis generated successfully directly via Google Gemini (${responseResult.source})!`
    });

  } catch (error: any) {
    console.warn("Gemini analysis warning (handled gracefully):", error.message || error);
    // Graceful fallback to simulated calculations in case of API failure
    const fallbackData = generateSimulatedAnalysis(req.body.resources || {});
    const errString = (error.message || String(error)).toLowerCase();
    let displayMessage = "The application temporarily switched to local ecological models due to an API error.";
    if (errString.includes("quota") || errString.includes("exceeded") || errString.includes("429") || errString.includes("resource_exhausted") || errString.includes("rate limit")) {
      displayMessage = "⚠️ Gemini API Quota Limit Reached: Your daily free-tier requests are exhausted. Pre-compiled local ecological simulation models have been loaded safely so you can continue learning without interruptions! To enable live dynamic responses, you can set a custom API key in the Settings menu.";
    }
    return res.status(200).json({
      ...fallbackData,
      isSimulated: true,
      errorMessage: error.message || "Gemini service encountered an issue.",
      message: displayMessage
    });
  }
});

// API: Generate textbook-quality study notes
app.post("/api/notes/generate", async (req, res) => {
  try {
    const { topicId, topicTitle } = req.body;
    if (!topicId || !topicTitle) {
      return res.status(400).json({ error: "Missing topicId or topicTitle in request body." });
    }

    const prompt = `You are an AI Study Assistant specializing in Natural Resource Management (NRM) and environmental policy.
Your task is to create comprehensive, highly engaging, and easy-to-read study notes for the following topic:
Topic Title: "${topicTitle}" (Topic ID: ${topicId})

You must write these notes in EXTREMELY SIMPLE ENGLISH so that anyone can understand the concepts instantly.

RULES FOR SIMPLE ENGLISH & STYLE:
- Use very simple, everyday words. Avoid complex academic jargon or difficult vocabulary.
- Use short, clear, and direct sentences.
- If you must use a technical term, explain it immediately in parenthetical or simple text.
- Never assume any prior knowledge. Explain ideas like a friendly, encouraging high school teacher.
- Use bullet points, bold text, and lists to make the notes clean and easy to scan.
- Always include practical Indian examples (village farming, local water bodies, panchayats, or forest committees) to make concepts concrete.

OUTPUT STRUCTURE:
Please write highly detailed, textbook-quality study notes in Markdown format incorporating the following elements:
1. Topic Title: A clear, friendly main heading.
2. What is this? (Introduction): 150-250 words explaining the concept simply, why it is important, and how it is used in real life.
3. Learning Goals: 4-6 simple, clear objectives of what you will learn.
4. Simple Definitions:
   - Academic definition (written in plain English)
   - Everyday definition (how to explain it to a family member)
   - One-sentence definition for exams
5. Background & History: A short story of how this concept grew over time.
6. Core Concept Breakdown: Explain the core meaning, purpose, and importance simply, with practical examples.
7. Important Words Table: A Markdown table with columns: Word, Simple Meaning, and Everyday Example.
8. Key Principles: The main rules or ideas behind this topic, explained with clear examples.
9. Features & Components: Point-wise breakdown of the main parts with a text-based ASCII flowchart or tree diagram.
10. How it Works: Step-by-step working explanation (who is involved and what the goals are).
11. Why it Matters: Simple environmental, economic, social, and rural development benefits.
12. Advantages: 5 clear advantages with simple explanations.
13. Challenges & Problems: 5 real-world field-level difficulties or policy issues.
14. Practical Solutions: Simple recommendations for governments, communities, and farmers to solve these problems.
15. Indian Context: Schemes (e.g., MGNREGA, PMKSY, CAMPA, Jal Jeevan Mission, etc.) and laws explained simply.
16. Indian Village/Agriculture Success Story: A real success story (Background, The Problem, What was done, The Result, and Key Lessons).
17. Simple FAQ: 3 common questions with very simple model answers.
18. Practice Questions (MCQs): 5 multiple-choice questions with the correct answer and a highly simplified explanation.
19. Memory Trick (Mnemonic): A fun and easy memory trick or shortcut to remember the key points.
20. Quick Revision Sheet: A one-page bulleted summary for last-minute exam revision.

Return ONLY the markdown-formatted notes content. Do not wrap the entire response in extra nested markdown code blocks (\`\`\`markdown ... \`\`\`), just return the raw markdown content directly so it can be parsed beautifully.`;

    let responseResult;
    try {
      responseResult = await generateGeminiContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
    } catch (e: any) {
      console.warn("Direct Gemini call failed, falling back to local notes:", e.message || e);
      const simulatedNotes = getSimulatedNotes(topicId, topicTitle);
      return res.json({
        notes: simulatedNotes,
        isSimulated: true,
        message: "Using pre-compiled master textbook notes. To enable live dynamic responses with custom rules, you can set a custom API key in the Settings menu."
      });
    }

    const notesContent = responseResult.response.text;
    if (!notesContent) {
      throw new Error("Empty response from Gemini API");
    }

    return res.json({
      notes: notesContent,
      isSimulated: false,
      message: `Personalized notes compiled successfully directly via Google Gemini (${responseResult.source})!`
    });

  } catch (error: any) {
    console.warn("Gemini notes generation warning (handled gracefully):", error.message || error);
    const fallbackNotes = getSimulatedNotes(req.body.topicId || "default", req.body.topicTitle || "Natural Resource Management");
    const errString = (error.message || String(error)).toLowerCase();
    let displayMessage = "The application temporarily loaded local textbook resources due to an API error.";
    if (errString.includes("quota") || errString.includes("exceeded") || errString.includes("429") || errString.includes("resource_exhausted") || errString.includes("rate limit")) {
      displayMessage = "⚠️ Gemini API Quota Limit Reached: Your daily free-tier requests are exhausted. Pre-compiled master textbook notes have been loaded safely so your studies are never interrupted! To enable live dynamic responses, you can set a custom API key in the Settings menu.";
    }
    return res.json({
      notes: fallbackNotes,
      isSimulated: true,
      errorMessage: error.message || "Gemini service encountered an issue.",
      message: displayMessage
    });
  }
});

// API: Generate fresh dynamic MCQs using Gemini
app.post("/api/mcq/generate", async (req, res) => {
  try {
    const { topicId, topicTitle } = req.body;
    if (!topicId || !topicTitle) {
      return res.status(400).json({ error: "Missing topicId or topicTitle in request body." });
    }

    const prompt = `You are an academic examiner and UGC-NET professor in Natural Resource Management (NRM) and Rural Development.
    Generate exactly ONE highly challenging, university-standard multiple-choice question (MCQ) for the following topic:
    Topic Title: "${topicTitle}" (Topic ID: ${topicId})

    Requirements:
    1. The question must be academically rigorous and directly relevant to advanced resource economics, policy, or field execution.
    2. Provide exactly four options. The options must be plausible and distinct (avoid obvious fillers).
    3. Select a clear correct option index (0 for first, 1 for second, 2 for third, 3 for fourth).
    4. Provide a detailed, paragraph-long academic explanation explaining why the selected option is correct and why other options are incorrect.
    
    You must return a valid JSON object matching the requested schema.`;

    let responseResult;
    try {
      responseResult = await generateGeminiContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["question", "options", "correctIndex", "explanation"],
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            }
          }
        }
      });
    } catch (e: any) {
      console.warn("Direct Gemini MCQ call failed, falling back to dynamic simulated question:", e.message || e);
      return res.json({
        isSimulated: true,
        question: `Which of the following describes the core operational challenge of managing "${topicTitle}" in Indian rural ecosystems?`,
        options: [
          `Difficulty in establishing clear community boundaries and monitoring extraction.`,
          `Excessive capital funding leading to high administrative inflation.`,
          `Complete lack of local human labor pools in agricultural sectors.`,
          `Strict coordination with international deep sea regulations.`
        ],
        correctIndex: 0,
        explanation: `For "${topicTitle}" (${topicId}), the primary real-world challenge in rural India is establishing clear property rights, monitoring resource boundaries, and ensuring equitable community compliance, which are key pillars of Ostrom's Common Pool Resource frameworks.`,
        message: "Loaded pre-configured local question. Set your GEMINI_API_KEY to activate dynamic AI MCQ generation!"
      });
    }

    const textOutput = responseResult.response.text;
    if (!textOutput) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedMCQ = JSON.parse(textOutput.trim());
    return res.json({
      ...parsedMCQ,
      isSimulated: false,
      message: `Fresh AI MCQ compiled successfully directly via Google Gemini (${responseResult.source})!`
    });

  } catch (error: any) {
    console.warn("Gemini MCQ generation warning (handled gracefully):", error.message || error);
    const errString = (error.message || String(error)).toLowerCase();
    let displayMessage = "Switched to local question models due to an API error.";
    if (errString.includes("quota") || errString.includes("exceeded") || errString.includes("429") || errString.includes("resource_exhausted") || errString.includes("rate limit")) {
      displayMessage = "⚠️ Gemini API Quota Limit Reached: Your daily free-tier requests are exhausted. Safe pre-compiled questions have been loaded so you can continue testing!";
    }

    return res.json({
      isSimulated: true,
      question: `Under resource economics, how is "${req.body.topicTitle || "Natural Resource Management"}" optimally evaluated for sustainability?`,
      options: [
        "By setting extraction rates equal to or below the natural regeneration or recharge rate.",
        "By maximizing short-term extraction regardless of ecological thresholds.",
        "By liquidating all natural assets into immediate cash reserves.",
        "By eliminating all local village management committees."
      ],
      correctIndex: 0,
      explanation: "A key principle of natural resource economics is that sustainable yield dictates extraction must not exceed the natural replenishment rate, protecting the stock from depletion.",
      message: displayMessage
    });
  }
});

// Helper: Local deterministic fallback simulator
function generateSimulatedAnalysis(resources: any) {
  if (!resources || !resources.water) {
    return {
      sustainabilityScore: 50,
      ecologicalHealthRating: "Moderate",
      economicYieldRating: "Moderate",
      summary: "Invalid resources provided.",
      risks: [],
      recommendations: [],
      resourceAnalyses: { water: "", forest: "", soil: "", energy: "" }
    };
  }

  // Calculate scores heuristically
  // Water: positive is high protection and low allocation (more preserved), negative is high allocation + low protection
  const waterScore = Math.max(0, Math.min(100, (resources.water.protection * 0.6) + (100 - resources.water.allocation) * 0.4 - (100 - resources.water.pollutionCap) * 0.3 + 20));

  // Forest: low logging, high reforestation, high wilderness
  const forestScore = Math.max(0, Math.min(100, (resources.forest.reforestation * 0.4) + (resources.forest.wilderness * 0.4) + (100 - resources.forest.loggingRate) * 0.4));

  // Soil: low intensive farming, high subsidies, soil law
  const soilScore = Math.max(0, Math.min(100, (100 - resources.soil.intensiveFarming) * 0.4 + (resources.soil.organicSubsidies * 0.4) + (resources.soil.protectionLaw ? 20 : 0)));

  // Energy: low fossil, high renew, high restoration
  const energyScore = Math.max(0, Math.min(100, (100 - resources.energy.fossilReliance) * 0.4 + (resources.energy.renewablesInvestment * 0.4) + (resources.energy.miningRestoration * 0.2)));

  const sustainabilityScore = Math.round((waterScore + forestScore + soilScore + energyScore) / 4);

  // Economic yield: high intensive farming, high logging, high allocation, high fossil
  const economicScore = Math.round(
    (resources.water.allocation * 0.2) +
    (resources.forest.loggingRate * 0.2) +
    (resources.soil.intensiveFarming * 0.3) +
    (resources.energy.fossilReliance * 0.3)
  );

  let ecologicalHealthRating = "Moderate";
  if (sustainabilityScore < 30) ecologicalHealthRating = "Critical";
  else if (sustainabilityScore < 50) ecologicalHealthRating = "Stressed";
  else if (sustainabilityScore < 75) ecologicalHealthRating = "Healthy";
  else ecologicalHealthRating = "Exceptional";

  let economicYieldRating = "Moderate";
  if (economicScore < 30) economicYieldRating = "Low";
  else if (economicScore < 60) economicYieldRating = "Moderate";
  else if (economicScore < 85) economicYieldRating = "High";
  else economicYieldRating = "Maximum (Unsustainable)";

  const summary = `Your resource management plan balances natural conservation with industrial production, resulting in a sustainability rating of ${sustainabilityScore}%. The current configuration prioritizes ${ecologicalHealthRating === "Critical" || ecologicalHealthRating === "Stressed" ? "industrial and agricultural output at the cost of environment" : "resource preservation, ensuring strong long-term security."}`;

  const risks = [];
  if (resources.water.allocation > 70) {
    risks.push({
      title: "Severe River Basin Depletion",
      description: "Allocating over 70% of freshwater reserves leaves critical river ecosystems bone dry, risking local collapse.",
      severity: "High" as const
    });
  }
  if (resources.forest.loggingRate > resources.forest.reforestation + 20) {
    risks.push({
      title: "Deforestation Surpassing Growth",
      description: "Logging velocity is exceeding active reforestation, inducing soil erosion and permanent habitat fragmentation.",
      severity: "High" as const
    });
  }
  if (resources.soil.intensiveFarming > 75) {
    risks.push({
      title: "Soil Salinization & Exhaustion",
      description: "High intensive farming depletes organic mineral layers, making future crop yield unstable and vulnerable to pests.",
      severity: "Medium" as const
    });
  }
  if (resources.energy.fossilReliance > 70) {
    risks.push({
      title: "High Carbon Output",
      description: "A fossil dependency index exceeding 70% accelerates greenhouse effects and risks carbon taxes.",
      severity: "Medium" as const
    });
  }

  if (risks.length === 0) {
    risks.push({
      title: "Suboptimal Resource Circulation",
      description: "Minimal active risks, but high conservation restricts immediate economic potential.",
      severity: "Low" as const
    });
  }

  const recommendations = [
    {
      title: "Implement Closed-Loop Water Recycling",
      action: "Lower Water Allocation to below 60% and raise Pollution Caps to filter municipal and industrial runoff.",
      impact: "Saves up to 15% in river reserves while securing aquifer replenishment."
    },
    {
      title: "Accelerate Renewable Co-generation",
      action: "Decrease Fossil Reliance to 40% and invest the savings into wind/solar co-generation grid capacity.",
      impact: "Improves renewable resiliency and creates clean-tech engineering jobs."
    }
  ];

  return {
    sustainabilityScore,
    ecologicalHealthRating,
    economicYieldRating,
    summary,
    risks,
    recommendations,
    resourceAnalyses: {
      water: `Water reserves have an estimated replenishment buffer of ${(resources.water.protection * 1.5).toFixed(0)} years. High allocation compromises base river flow indices.`,
      forest: `Logging index at ${resources.forest.loggingRate}% requires an offsetting reforestation budget of $${(resources.forest.reforestation * 1.2).toFixed(0)}M yearly to maintain carbon neutrality.`,
      soil: `Organic subsidies of ${resources.soil.organicSubsidies}% protect topsoil biodiversity, but intensive crop cycles threaten long-term yield consistency.`,
      energy: `Fossil reliance at ${resources.energy.fossilReliance}% keeps grid operational cost low but inhibits grid modernization initiatives.`
    }
  };
}

// Vite middleware and static handlers
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
