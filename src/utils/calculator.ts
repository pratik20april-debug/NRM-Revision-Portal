import { ResourceState, ResourceIndicators } from "../types";

export function calculateIndicators(resources: ResourceState): ResourceIndicators {
  // 1. Water Reserves
  // High protection increases water reserves. High allocation drains them.
  // Lower pollution cap (meaning more untreated pollution) degrades quality.
  const waterProtectionTerm = resources.water.protection * 0.7;
  const waterAllocationTerm = (100 - resources.water.allocation) * 0.4;
  const pollutionTerm = (resources.water.pollutionCap) * 0.3; // high cap means high filtration/treatment
  const waterReserve = Math.round(Math.max(0, Math.min(100, waterProtectionTerm + waterAllocationTerm + pollutionTerm - 10)));

  // 2. Forest Cover
  // Reforestation raises cover. High logging drops it. Wilderness preserves it.
  const loggingTerm = (100 - resources.forest.loggingRate) * 0.5;
  const reforestationTerm = resources.forest.reforestation * 0.4;
  const wildernessTerm = resources.forest.wilderness * 0.3;
  const forestCover = Math.round(Math.max(0, Math.min(100, loggingTerm + reforestationTerm + wildernessTerm - 10)));

  // 3. Soil Quality
  // High intensive farming drains soil. Organic subsidies and protection laws secure it.
  const intensiveTerm = (100 - resources.soil.intensiveFarming) * 0.5;
  const organicTerm = resources.soil.organicSubsidies * 0.3;
  const lawTerm = resources.soil.protectionLaw ? 20 : 0;
  const soilQuality = Math.round(Math.max(0, Math.min(100, intensiveTerm + organicTerm + lawTerm)));

  // 4. Clean Energy Ratio
  // Low fossil reliance and high renewables investment boost it.
  const fossilTerm = (100 - resources.energy.fossilReliance) * 0.5;
  const renewTerm = resources.energy.renewablesInvestment * 0.4;
  const restorationTerm = resources.energy.miningRestoration * 0.1;
  const cleanEnergyRatio = Math.round(Math.max(0, Math.min(100, fossilTerm + renewTerm + restorationTerm)));

  // 5. Economic Yield
  // High resource allocation, logging, intensive farming, and fossil fuels drive economy up immediately,
  // but high protection policies place minor friction.
  const econWater = resources.water.allocation * 0.25;
  const econForest = resources.forest.loggingRate * 0.25;
  const econSoil = resources.soil.intensiveFarming * 0.25;
  const econEnergy = resources.energy.fossilReliance * 0.25;
  const conservationFriction = (resources.water.protection + resources.forest.wilderness + (resources.soil.protectionLaw ? 20 : 0)) * 0.08;
  const economicYield = Math.round(Math.max(5, Math.min(100, (econWater + econForest + econSoil + econEnergy) - conservationFriction + 10)));

  // 6. Biodiversity Health Index
  // Strongly correlated with high wilderness, water reserves, forest cover, low intensive farming, and energy restoration.
  const waterEco = waterReserve * 0.2;
  const forestEco = forestCover * 0.25;
  const soilEco = soilQuality * 0.2;
  const cleanEnergyEco = cleanEnergyRatio * 0.15;
  const wildEco = resources.forest.wilderness * 0.2;
  const biodiversityIndex = Math.round(Math.max(0, Math.min(100, waterEco + forestEco + soilEco + cleanEnergyEco + wildEco)));

  return {
    waterReserve,
    forestCover,
    soilQuality,
    cleanEnergyRatio,
    economicYield,
    biodiversityIndex
  };
}
