import { SYLLABUS } from "./syllabus";

export interface MCQQuestion {
  id: string;
  unitId: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Highly structured base questions covering all Units of the Natural Resource Management (NRM) syllabus
export const BASE_MCQ_QUESTIONS: MCQQuestion[] = [
  // --- Unit II: NRM Conceptual Understanding ---
  {
    id: "u2-q1",
    unitId: "unit-2",
    topicId: "natural-resources",
    question: "Under natural resource economics, which of the following best characterizes a 'dynamic stock system' as opposed to an 'ecological flow'?",
    options: [
      "Stocks are continuously replenished at a rate independent of human extraction, whereas flows depend entirely on current reserves.",
      "Stocks are physical accumulations of resources (like minerals or old-growth timber) subject to depletion over time, whereas flows are continuous rate-based movements (like solar radiation or wind) that cannot be stored in their natural state.",
      "Stocks represent renewable biotic resources, whereas flows are restricted to abiotic non-renewable resources.",
      "Stocks are governed by private property rights, whereas flows are legally classified as open-access resources."
    ],
    correctIndex: 1,
    explanation: "A dynamic stock system is defined by its physical accumulation of material (such as groundwater aquifers, fossil fuels, or standing timber) that can be drawn down or accumulated over time. Flows, like solar energy, wind, or stream currents, are rate-based and transient; they cannot be stored in-situ without transformation."
  },
  {
    id: "u2-q2",
    unitId: "unit-2",
    topicId: "classification-resources",
    question: "Which of the following is classified as an exhaustible but renewable natural resource?",
    options: [
      "Coal and petroleum deposits",
      "Solar radiation and tidal energy",
      "Standing forest timber and groundwater aquifers",
      "Atmospheric nitrogen and ambient wind"
    ],
    correctIndex: 2,
    explanation: "Forest timber and groundwater are renewable resources because they have natural regeneration rates. However, they are exhaustible because if the rate of human extraction exceeds the natural recharge/regeneration rate, the stock can be permanently depleted or ruined."
  },
  {
    id: "u2-q3",
    unitId: "unit-2",
    topicId: "importance-nrm",
    question: "In rural developing economies, what is the primary role of Natural Common Pool Resources (CPRs) during agricultural dry seasons?",
    options: [
      "They act as a primary luxury income source for large landowners.",
      "They function as an economic 'safety net' or buffer, providing vital fodder, fuel, and non-timber forest products to landless and marginal households.",
      "They are primary sites for high-yield mechanized export agriculture.",
      "They eliminate the need for agricultural credit entirely."
    ],
    correctIndex: 1,
    explanation: "Common Pool Resources (CPRs) serve as crucial survival safety nets for poor rural households. During dry seasons or crop failures, marginal farmers rely heavily on commons for fuel wood, wild food, fodder, and non-timber forest products to sustain livelihoods."
  },
  {
    id: "u2-q4",
    unitId: "unit-2",
    topicId: "marginal-analysis",
    question: "In the economic analysis of natural resources, the concept of 'Marginal User Cost' (MUC) represents:",
    options: [
      "The direct extraction cost incurred by the marginal firm in the current period.",
      "The value of the opportunity foregone in the future by extracting and consuming a unit of a non-renewable resource in the current period.",
      "The cost of correcting environmental pollution caused by the marginal consumer.",
      "The registration fees paid to government regulators for resource extraction permits."
    ],
    correctIndex: 1,
    explanation: "Marginal User Cost (MUC), or scarcity rent, is the present value of future opportunities foregone due to current extraction. Consuming a unit of an exhaustible resource today means it is unavailable for future generations, imposing a cost on future users."
  },
  {
    id: "u2-q5",
    unitId: "unit-2",
    topicId: "temporal-allocation",
    question: "According to Hotelling's Rule for the optimal temporal allocation of exhaustible resources, under competitive market conditions, the net price (price minus marginal extraction cost) of the resource must:",
    options: [
      "Decline at a rate equal to the natural rate of forest growth.",
      "Remain completely constant over the entire extraction horizon.",
      "Grow at a rate equal to the social discount rate (interest rate).",
      "Be equal to the marginal cost of producing renewable substitutes."
    ],
    correctIndex: 2,
    explanation: "Hotelling's Rule states that to be in equilibrium, the net price (or royalty/scarcity rent) of an exhaustible resource must grow at a rate equal to the interest rate (discount rate). This ensures resource owners are indifferent between extracting the resource today or leaving it in the ground."
  },
  {
    id: "u2-q6",
    unitId: "unit-2",
    topicId: "property-rights",
    question: "Which property rights regime is characterized by the complete absence of defined property rights and the exclusion of no one?",
    options: [
      "Private Property (Res Privatae)",
      "State Property (Res Publicae)",
      "Common Property (Res Communes)",
      "Open Access (Res Nullius)"
    ],
    correctIndex: 3,
    explanation: "Open Access (Res Nullius) is characterized by the absence of any defined property rights or rules. Anyone can access and extract the resource, and no one can be legally excluded, which frequently leads to rapid depletion."
  },
  {
    id: "u2-q7",
    unitId: "unit-2",
    topicId: "cost-benefit-analysis",
    question: "When performing Cost-Benefit Analysis (CBA) for a long-term watershed restoration project, applying a high social discount rate will:",
    options: [
      "Bias the decision in favor of the project, as future ecological benefits will be heavily weighted.",
      "Have zero effect on the calculated net present value (NPV).",
      "Bias the decision against the project, because long-term future benefits are heavily discounted, making them appear small in today's terms.",
      "Ensure that immediate capital construction costs are completely ignored."
    ],
    correctIndex: 2,
    explanation: "A higher social discount rate discounts future benefits more aggressively. For ecological projects with high immediate costs and benefits that accrue over decades, a high discount rate makes future benefits look negligible in today's terms, lowering the Net Present Value (NPV)."
  },

  // --- Unit III: Understanding Collective Action & Commons ---
  {
    id: "u3-q1",
    unitId: "unit-3",
    topicId: "collective-action-theory",
    question: "In Mancur Olson's 'The Logic of Collective Action', why are large groups less likely than small groups to voluntarily cooperate to provide a public good?",
    options: [
      "Large groups suffer from severe transaction costs, higher anonymity, and a greater incentive for individual members to 'free-ride'.",
      "Members of large groups have higher average wealth, which reduces their need for public goods.",
      "Small groups are legally barred from forming community cooperatives.",
      "Large groups are naturally more cooperative due to evolutionary altruism."
    ],
    correctIndex: 0,
    explanation: "Olson argued that in large groups, the individual contribution of a member is small and hard to monitor, anonymity is higher, and the incentive to 'free-ride' (enjoy the benefit without paying the cost) is great. Additionally, coordinating and communicating in large groups incurs high transaction costs."
  },
  {
    id: "u3-q2",
    unitId: "unit-3",
    topicId: "prisoners-dilemma",
    question: "How does the traditional Prisoner's Dilemma map onto Hardin's 'Tragedy of the Commons'?",
    options: [
      "Both players cooperate because they fear state prosecution.",
      "The dominant strategy for each individual is to defect (over-extract), leading to an outcome where both are worse off than if they had cooperated.",
      "The Nash equilibrium is Pareto-efficient and leads to resource conservation.",
      "It shows that private bargaining always solves open access issues without rule-making."
    ],
    correctIndex: 1,
    explanation: "In a common pool pasture under open access, each herder's dominant strategy is to add more cattle (defect) to maximize private profit, regardless of what others do. When all herders follow this rational private incentive, the common pasture is destroyed, leaving everyone worse off."
  },
  {
    id: "u3-q3",
    unitId: "unit-3",
    topicId: "common-pool-resources",
    question: "What are the two core defining physical characteristics of a 'Common Pool Resource' (CPR)?",
    options: [
      "High excludability and high subtractability",
      "Low excludability and low subtractability",
      "Low excludability (difficult to exclude users) and high subtractability (one user's consumption reduces availability)",
      "High excludability and low subtractability"
    ],
    correctIndex: 2,
    explanation: "Common Pool Resources (such as forests, fisheries, and irrigation canals) are characterized by: 1) Low Excludability (it is highly costly or difficult to prevent unauthorized people from accessing the resource), and 2) High Subtractability (each unit harvested directly reduces the stock available for others)."
  },
  {
    id: "u3-q4",
    unitId: "unit-3",
    topicId: "tragedy-commons",
    question: "Garrett Hardin's original 1968 paper 'The Tragedy of the Commons' was widely criticized by social scientists, notably Elinor Ostrom, because:",
    options: [
      "He failed to understand that physical resources like grass can regenerate.",
      "He conflated unregulated Open Access regimes (res nullius) with managed Common Property regimes (res communes) where communities successfully enforce rules.",
      "He believed that only state ownership could lead to resource depletion.",
      "His model assumed that humans are completely irrational beings."
    ],
    correctIndex: 1,
    explanation: "Hardin assumed that shared spaces have no rules (open access). Ostrom and other researchers showed that historically, many communities developed sophisticated, self-governing local institutions (common property) that successfully managed shared resources for centuries without privatization or top-down state control."
  },

  // --- Unit IV: Management of Commons ---
  {
    id: "u4-q1",
    unitId: "unit-4",
    topicId: "ostrom-principles",
    question: "Which of the following is NOT one of Elinor Ostrom's 8 Design Principles for stable, self-governing Common Pool Resources?",
    options: [
      "Clearly defined boundaries of the resource and the user group.",
      "Low-cost and local conflict-resolution mechanisms.",
      "A rule that all resource monitors must be external government civil servants to ensure complete neutrality.",
      "Graduated sanctions for rule violators, starting with mild warnings."
    ],
    correctIndex: 2,
    explanation: "Ostrom's fourth principle states that resource monitors should be the users themselves or individuals directly accountable to them, rather than external state actors. Community-led monitoring is more efficient, low-cost, and carries higher local legitimacy."
  },
  {
    id: "u4-q2",
    unitId: "unit-4",
    topicId: "wades-analysis",
    question: "In his analysis of irrigated villages in South India, Robert Wade identified that successful collective action is highly correlated with:",
    options: [
      "A large group size with highly diverse cultural origins.",
      "The critical nature of the resource to survival, combined with small group size, clear boundaries, and high mutual detectability of cheating.",
      "The absolute privatization of all water rights to individual farmers.",
      "Frequent intervention and active policing by central government departments."
    ],
    correctIndex: 1,
    explanation: "Wade's empirical study of Indian village irrigation cooperatives showed that collective action flourishes when the group is relatively small, boundaries are clear, the resource is vital to survival (high high-yield stakes), and members can easily observe one another's compliance (mutual detectability)."
  },
  {
    id: "u4-q3",
    unitId: "unit-4",
    topicId: "de-commonization",
    question: "The term 'De-commonization' refers to:",
    options: [
      "The process of converting private lands into collective pastures.",
      "The degradation and loss of the institutional rules governing a common, resulting in its transition into open-access or privatization.",
      "The government subsidy of community watershed development.",
      "The scientific breeding of livestock in agricultural universities."
    ],
    correctIndex: 1,
    explanation: "De-commonization is the breakdown of collective property arrangements, either through enclosure, state appropriation, or administrative privatization, stripping local communities of their traditional customary governance rights and ecological safety nets."
  },

  // --- Unit V: Management of Environmental Pollution & Externalities ---
  {
    id: "u5-q1",
    unitId: "unit-5",
    topicId: "externalities",
    question: "Which of the following describes a negative externality in environmental economics?",
    options: [
      "A paper mill dumps chemical effluents into a river, destroying downstream fishing yields without paying compensation to the fishermen.",
      "An organic farmer buys pesticide-free fertilizer from a cooperative.",
      "The government provides solar panels to villagers at subsidised rates.",
      "A factory installs a carbon capture unit that reduces its private profits."
    ],
    correctIndex: 0,
    explanation: "A negative externality occurs when an economic activity imposes uncompensated costs on third parties. In this case, the paper mill uses the river as a free waste sink, forcing downstream fishermen to bear the costs of reduced fish stocks."
  },
  {
    id: "u5-q2",
    unitId: "unit-5",
    topicId: "coase-theorem",
    question: "Under the Coase Theorem, if transaction costs are zero and property rights are clearly assigned to either the polluter or the victim:",
    options: [
      "Private bargaining will lead to an efficient level of pollution only if the rights are assigned to the victim.",
      "The government must step in with Pigouvian taxes to prevent market collapse.",
      "Private bargaining will lead to an efficient resource allocation regardless of who holds the initial property rights.",
      "Pollution will be completely eliminated to absolute zero."
    ],
    correctIndex: 2,
    explanation: "The Coase Theorem states that if property rights are well-defined and transaction costs are zero, private negotiation will lead to the socially optimal (efficient) level of pollution, regardless of whether the polluter has the right to pollute or the victim has the right to clean air/water."
  },
  {
    id: "u5-q3",
    unitId: "unit-5",
    topicId: "pigouvian-taxes",
    question: "A Pigouvian tax is designed to internalize a negative externality by setting a tax rate equal to:",
    options: [
      "The total fixed cost of the polluting firm's machinery.",
      "The Marginal External Cost (MEC) evaluated at the socially optimal level of production.",
      "The market price of the final product being manufactured.",
      "The average income of the citizens affected by the pollution."
    ],
    correctIndex: 1,
    explanation: "To correct market failures caused by negative externalities, a Pigouvian tax should be set exactly equal to the Marginal External Cost (MEC) at the socially efficient output level. This aligns private marginal costs with social marginal costs, restoring efficiency."
  },

  // --- Unit VI: Management of Key Rural Ecosystems & Rural Planning ---
  {
    id: "u6-q1",
    unitId: "unit-6",
    topicId: "joint-forest-management",
    question: "What is the core institutional mechanism of Joint Forest Management (JFM) in India?",
    options: [
      "The complete privatization of degraded forest land to multinational logging corporations.",
      "A partnership between state forest departments and local village bodies (Forest Protection Committees), sharing protection labor in exchange for non-timber forest products and timber sales shares.",
      "The complete exclusion of village communities from entering any state-owned forest lands.",
      "The resettlement of tribal populations to urban centers to facilitate natural forest regrowth."
    ],
    correctIndex: 1,
    explanation: "Joint Forest Management (JFM) is a co-management regime established in India. Local communities (via Forest Protection Committees/Vana Samrakshana Samithis) protect degraded state forests from grazing and woodcutting, and in return, the state grants them free access to non-timber forest products and a percentage share of final timber harvest revenues."
  },
  {
    id: "u6-q2",
    unitId: "unit-6",
    topicId: "watershed-management",
    question: "In rural watershed planning, what is the ecological purpose of 'ridgeline-to-valley' treatment?",
    options: [
      "To build heavy concrete dams in the upper peaks first, ignoring the flat valley regions.",
      "To treat the upper slopes (ridge) first with soil-water conservation measures (like continuous contour trenches and afforestation) to slow water velocity before managing lower valley channels.",
      "To divert all rainwater directly into municipal pipes, bypassing rural agricultural fields.",
      "To maximize high-speed runoff to clean sediment from valley riverbeds."
    ],
    correctIndex: 1,
    explanation: "The 'ridgeline-to-valley' approach dictates that conservation work starts at the top (ridge) to check runoff velocity, increase soil infiltration, and trap silt early. Treating the valleys first without slope protection would cause lower check-dams to quickly silt up or wash away during heavy rains."
  },
  {
    id: "u6-q3",
    unitId: "unit-6",
    topicId: "grassland-management",
    question: "Which of the following grassland management systems is designed to prevent overgrazing by allowing pastures a rest period to regenerate soil and fodder?",
    options: [
      "Continuous open-access grazing",
      "Stall-feeding exclusion only",
      "Rotational grazing systems",
      "Chemical fertilization without fencing"
    ],
    correctIndex: 2,
    explanation: "Rotational grazing divides a pasture into several smaller paddocks. Livestock graze one paddock at a time while the others are rested, allowing the grass, root systems, and soils to recover and regenerate before being grazed again."
  },

  // --- Unit VII: Climate Change Response, Resilience & Emerging Issues ---
  {
    id: "u7-q1",
    unitId: "unit-7",
    topicId: "climate-resilience",
    question: "What is the distinction between 'climate adaptation' and 'climate mitigation' in natural resource planning?",
    options: [
      "Adaptation involves reducing global greenhouse gas concentrations, while mitigation involves adapting crops to changing weather.",
      "Adaptation is adjusting physical structures and livelihoods to survive actual or expected climate impacts, whereas mitigation involves active measures to reduce greenhouse gas emissions or enhance carbon sinks.",
      "Adaptation is handled by local village councils, whereas mitigation is exclusively handled by international courts.",
      "Adaptation focuses entirely on rural forests, while mitigation focuses entirely on heavy industrial zones."
    ],
    correctIndex: 1,
    explanation: "Adaptation refers to adjustments in ecological, social, or economic systems in response to actual or expected climatic stimuli (e.g. building dykes, crop-shifting). Mitigation refers to human interventions to reduce the sources or enhance the sinks of greenhouse gases (e.g. afforestation, renewable transitions)."
  },
  {
    id: "u7-q2",
    unitId: "unit-7",
    topicId: "conjunctive-water-use",
    question: "In agricultural water planning, 'conjunctive water use' refers to:",
    options: [
      "Relying exclusively on deep tubewells, letting surface canals run completely dry.",
      "The coordinated and combined use of surface water (such as canals) and groundwater (aquifers) to optimize supply and prevent water table decline.",
      "Mixing industrial wastewater directly with drinking water supplies to increase volume.",
      "Pumping groundwater into ocean bodies to control sea level rises."
    ],
    correctIndex: 1,
    explanation: "Conjunctive water use is a sustainability strategy that coordinates surface water (canal irrigation) and groundwater extraction. When surface water is abundant (monsoons), canal water is used while recharging aquifers; during dry periods, groundwater is tapped, stabilizing water tables."
  },
  {
    id: "u7-q3",
    unitId: "unit-7",
    topicId: "institutional-interplay",
    question: "According to Fikret Berkes' research on cross-scale governance, what is 'vertical institutional interplay'?",
    options: [
      "The interaction between village institutions of equal political power located in different states.",
      "The coordination and linkages between local village bodies, regional authorities, national policies, and international environmental agreements.",
      "The competition between different crops grown in the same agricultural field.",
      "The legal dispute between municipal municipal water boards."
    ],
    correctIndex: 1,
    explanation: "Vertical institutional interplay refers to linkages, partnerships, and power dynamics across different levels of organization or scale, connecting small local user groups (such as water user associations) with higher levels of governance like state laws or international treaties."
  }
];

/**
 * Procedural/Synthetic MCQ generator.
 * Shuffles variables, names, state regions, and phrasings to construct up to 5,000 intermixed variations
 * from our base question deck and template rules, allowing offline practice of endless questions.
 */
export function generateSyntheticMCQs(count: number = 5000): MCQQuestion[] {
  const result: MCQQuestion[] = [];
  const baseLen = BASE_MCQ_QUESTIONS.length;

  // Let's create a rich set of templates for rural states, resources, and institutions
  const states = ["Rajasthan", "Madhya Pradesh", "Karnataka", "Odisha", "Gujarat", "Kerala", "Bihar", "Uttar Pradesh", "Maharashtra"];
  const resources = ["groundwater extraction", "community forest timber", "village pasture land", "tank irrigation canal", "coastal fishery commons"];
  const units = ["unit-2", "unit-3", "unit-4", "unit-5", "unit-6", "unit-7"];
  
  // Fill first with our high-quality baseline questions
  BASE_MCQ_QUESTIONS.forEach((q, idx) => {
    result.push({
      ...q,
      id: `base-${idx}`
    });
  });

  // Now, procedurally construct distinct variations up to 'count'
  let currentId = result.length;
  while (result.length < count) {
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const randomResource = resources[Math.floor(Math.random() * resources.length)];
    
    // Choose a template index
    const templateIdx = currentId % 12;

    if (templateIdx === 0) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-4",
        topicId: "ostrom-principles",
        question: `In a rural community in ${randomState} managing a ${randomResource}, which of Ostrom's design principles is violated if local municipal officers from the capital city impose harvesting fees without consulting the village council?`,
        options: [
          "Principle of collective choice arrangements (users must participate in rule modifications).",
          "Principle of clearly defined boundaries.",
          "Principle of graduated sanctions for rule breakers.",
          "Principle of minimal recognition of rights to self-govern."
        ],
        correctIndex: 0,
        explanation: `Under Elinor Ostrom's CPR design principles, Principle 3 (Collective-Choice Arrangements) specifies that individuals affected by operational rules should have a say in modifying those rules. External, top-down enforcement in ${randomState} without local consulting directly breaches this principle.`
      });
    } else if (templateIdx === 1) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-5",
        topicId: "coase-theorem",
        question: `Suppose a paper pulp mill in ${randomState} pollutes a local ${randomResource} used by downstream farmers. If the transaction costs of bargaining are extremely high, what does the Coase Theorem predict?`,
        options: [
          "Private negotiation will fail to achieve the socially efficient level of pollution, requiring corrective policy intervention.",
          "The mill will automatically stop all emissions to preserve the crop quality.",
          "Farmers will buy out the mill using corporate microloans.",
          "An efficient outcome will be reached immediately without any state regulation."
        ],
        correctIndex: 0,
        explanation: "The Coase Theorem explicitly relies on the critical assumption of zero or negligible transaction costs. If transaction costs in the rural community are high, private parties cannot bargain efficiently, leading to market failure."
      });
    } else if (templateIdx === 2) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-3",
        topicId: "tragedy-commons",
        question: `Under open access, if five herding families in ${randomState} share a ${randomResource}, what is the individual incentive for any family to add an extra animal past the carrying capacity?`,
        options: [
          "The private benefit of adding the animal is +1 (wholly captured), while the social cost of overgrazing is shared among all families, making it private-rational to over-extract.",
          "They will voluntarily pay a private tax to their neighbors to offset the soil damage.",
          "They will reduce their extraction of other forestry resources to balance the pasture ecosystem.",
          "There is zero economic incentive because marginal revenue drops instantly to absolute zero."
        ],
        correctIndex: 0,
        explanation: "This represents Hardin's Tragedy of the Commons payoff asymmetry. The herder captures 100% of the private economic gain from selling the additional livestock, whereas the ecological cost of pasture deterioration is shared among all herders, creating a continuous incentive to overgraze."
      });
    } else if (templateIdx === 3) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-6",
        topicId: "joint-forest-management",
        question: `Within the Joint Forest Management (JFM) guidelines in ${randomState}, what is the primary benefit of granting local Forest Protection Committees (VFC/FPC) ownership of non-timber forest products (NTFPs)?`,
        options: [
          "It aligns the long-term protection incentives of villagers with resource health, providing sustainable continuous income.",
          "It forces the village to buy wood exclusively from foreign countries.",
          "It completely replaces the need for any state forest guards or rangers.",
          "It raises the market price of industrial logging leases."
        ],
        correctIndex: 0,
        explanation: "By securing local communities the rights to harvest non-timber forest products (NTFPs like tendu leaves, honey, medicinal herbs), JFM aligns economic survival with forest preservation, turning the community into natural guardians."
      });
    } else if (templateIdx === 4) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-2",
        topicId: "temporal-allocation",
        question: `Under Hotelling's rule, if the social discount rate in India increases, how will the extraction path of a non-renewable ${randomResource} change?`,
        options: [
          "Extraction will be shifted toward the present (faster depletion) because future revenues are now worth less today.",
          "Extraction will be slowed down to conserve resources for future decades.",
          "The resource will be abandoned completely in favor of solar alternatives.",
          "Extraction remains entirely unchanged because physical stocks do not respond to discount rates."
        ],
        correctIndex: 0,
        explanation: "A higher discount rate devalues future earnings. Consequently, resource extractors will choose to mine/extract more today and sell immediately, shifting the extraction path toward faster initial depletion."
      });
    } else if (templateIdx === 5) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-5",
        topicId: "pigouvian-taxes",
        question: `To correct environmental degradation in ${randomState} due to illegal sand mining in a ${randomResource}, a Pigouvian tax should theoretically be set to:`,
        options: [
          "The Marginal External Cost (MEC) of the ecological destruction at the optimal extraction level.",
          "A rate high enough to shut down all infrastructure construction in the state.",
          "The average cost of hiring state security forces to guard the riverbanks.",
          "The market price of imported sand substitutes."
        ],
        correctIndex: 0,
        explanation: "A Pigouvian tax internalizes the negative externality by placing a price on the damage. Setting the tax equal to the Marginal External Cost (MEC) forces the private operator to pay the full social cost of their action, optimizing resource extraction."
      });
    } else if (templateIdx === 6) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-7",
        topicId: "climate-resilience",
        question: `Which of the following represents a key institutional strategy to enhance rural climate resilience in agricultural zones of ${randomState}?`,
        options: [
          "Conjunctive surface-groundwater planning integrated with Gram Panchayat watershed committees.",
          "The absolute banning of groundwater tubewells, forcing reliance on rain only.",
          "Migrating entire villages into regional cities to establish industrial labor pools.",
          "Focusing exclusively on single-crop chemical-intensive farming."
        ],
        correctIndex: 0,
        explanation: "Integrating conjunctive water management (coordinated canal and aquifer tapping) with local village-level Panchayati governance structures ensures equitable, adaptive water allocation, enhancing resilience against climatic water stress."
      });
    } else if (templateIdx === 7) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-4",
        topicId: "baland-platteau",
        question: `Baland and Platteau argue that local community cooperation in managing a ${randomResource} in ${randomState} is highly sustainable when:`,
        options: [
          "Users share a strong sense of mutual dependency, rules are simple and intuitive, and compliance is monitored locally.",
          "The resource is so abundant that harvesting constraints are completely unnecessary.",
          "The central military forces enforce all daily allocations from a capital.",
          "All community members belong to different, disconnected economic sectors."
        ],
        correctIndex: 0,
        explanation: "Baland and Platteau emphasized that small-scale, localized resource cooperation succeeds when users depend heavily on the resource, the governing regulations are clear, and monitoring is embedded within community routines."
      });
    } else if (templateIdx === 8) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-2",
        topicId: "spatial-allocation",
        question: `In spatial planning of ${randomResource} networks across ${randomState}, what is the economic benefit of zoning regulations?`,
        options: [
          "It prevents incompatible land uses (e.g. industrial toxic runoff near village drinking reservoirs) and minimizes spatial externalities.",
          "It forces all farmers to pay equal land taxes regardless of soil quality.",
          "It ensures that zero land is used for agricultural farming.",
          "It eliminates the need for spatial mapping and survey technologies."
        ],
        correctIndex: 0,
        explanation: "Zoning separates conflicting activities, preventing negative spatial externalities where one land use (like heavy mining) degrades neighboring resources (like clean drinking water aquifers or pastures)."
      });
    } else if (templateIdx === 9) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-3",
        topicId: "game-theory",
        question: `In an NRM game theory model of two villages in ${randomState} sharing a boundary forest, if both villages cooperate the payoff is (8, 8). If both defect (over-extract), the payoff is (2, 2). If one defects and the other cooperates, the payoffs are (10, 1). What is the Nash equilibrium if they play a one-shot game?`,
        options: [
          "Both defect (2, 2), as defecting is the dominant strategy for each village.",
          "Both cooperate (8, 8), because they can read each other's intentions.",
          "The state will force a payoff of (10, 10) through administrative fiat.",
          "There is no Nash equilibrium in this payoff structure."
        ],
        correctIndex: 0,
        explanation: "Since 10 > 8 (when the other cooperates) and 2 > 1 (when the other defects), defection is the dominant strategy for both villages. Thus, the Nash equilibrium of a one-shot game is for both to defect (2, 2), reflecting the Tragedy of the Commons."
      });
    } else if (templateIdx === 10) {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-6",
        topicId: "watershed-management",
        question: `To maximize water infiltration and prevent topsoil erosion in a hilly watershed in ${randomState}, where should continuous contour trenches (CCTs) be constructed?`,
        options: [
          "Along the contour lines of the upper slopes (ridgeline), to intercept surface runoff early.",
          "Strictly at the lowest drainage channel in the flat valley bed.",
          "On municipal highways bypassing the watershed.",
          "In the village residential housing zones."
        ],
        correctIndex: 0,
        explanation: "Continuous contour trenches (CCTs) are dug along the contours on slopes (ridge treatment) to break the flow of rainwater, trapping sediment and allowing water to slowly percolate, recharging groundwater."
      });
    } else {
      result.push({
        id: `synth-${currentId}`,
        unitId: "unit-7",
        topicId: "discount-rate",
        question: `A 'Social Time Preference' approach to choosing a discount rate for environmental assets in ${randomState} typically leads to:`,
        options: [
          "A lower discount rate, which gives higher value to long-term sustainability and the welfare of future generations.",
          "An infinite discount rate, prioritizing immediate consumption above all else.",
          "A rate pegged to commercial private bank interest rates, ignoring ecological value.",
          "Zero consideration of any temporal or future economic trade-offs."
        ],
        correctIndex: 0,
        explanation: "Social time preference takes into account ethical considerations, intergenerational equity, and ecological resilience, generally arguing for low social discount rates so that long-term benefits are protected."
      });
    }

    currentId++;
  }

  return result;
}
