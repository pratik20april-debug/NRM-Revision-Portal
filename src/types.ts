export interface ResourceState {
  water: {
    allocation: number;    // % assigned for human/agro use
    protection: number;    // % preserved zones
    pollutionCap: number;  // % of pollution treated (0-100)
  };
  forest: {
    loggingRate: number;   // % logging intensity
    reforestation: number; // % budget/effort
    wilderness: number;    // % strictly protected forest
  };
  soil: {
    intensiveFarming: number; // % intensive vs organic/regenerative
    organicSubsidies: number; // % farming subsidy support
    protectionLaw: boolean;   // Active or not
  };
  energy: {
    fossilReliance: number;       // % fossil fuels
    renewablesInvestment: number; // % budget allocated
    miningRestoration: number;    // % mining zones restored
  };
}

export interface ResourceIndicators {
  waterReserve: number;       // 0-100
  forestCover: number;        // 0-100
  soilQuality: number;        // 0-100
  cleanEnergyRatio: number;   // 0-100
  biodiversityIndex: number;  // 0-100
  economicYield: number;      // 0-100
}

export interface AIAnalysisReport {
  sustainabilityScore: number;
  ecologicalHealthRating: "Critical" | "Stressed" | "Moderate" | "Healthy" | "Exceptional";
  economicYieldRating: "Low" | "Moderate" | "High" | "Maximum (Unsustainable)";
  summary: string;
  risks: Array<{
    title: string;
    description: string;
    severity: "High" | "Medium" | "Low";
  }>;
  recommendations: Array<{
    title: string;
    action: string;
    impact: string;
  }>;
  resourceAnalyses: {
    water: string;
    forest: string;
    soil: string;
    energy: string;
  };
  isSimulated?: boolean;
  message?: string;
}
