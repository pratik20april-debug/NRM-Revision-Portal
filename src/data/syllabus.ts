export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface SyllabusUnit {
  id: string;
  title: string;
  topics: Topic[];
}

export const SYLLABUS: SyllabusUnit[] = [
  {
    id: "unit-2",
    title: "Unit II: NRM Conceptual Understanding",
    topics: [
      { id: "natural-resources", title: "Natural Resources", description: "Core concepts, ecological flows, and dynamic stock systems" },
      { id: "classification-resources", title: "Classification of Natural Resources", description: "Biotic vs Abiotic, Renewable vs Non-renewable, Exhaustible vs Inexhaustible" },
      { id: "importance-nrm", title: "Importance of NRM", description: "Economic significance, survival limits, and rural livelihood dependency" },
      { id: "policies-institutions", title: "Policies and Institutions for NRM", description: "Legal frameworks, community bodies, and regulatory architectures" },
      { id: "historical-perspective", title: "Historical Perspective of NRM", description: "Pre-colonial practices, colonial exploitation, and post-independence shifts" },
      { id: "marginal-analysis", title: "Economic Analysis of NRM: Marginal Analysis", description: "Optimizing output, marginal user costs, and efficiency limits" },
      { id: "cost-benefit-analysis", title: "Cost-Benefit Analysis of NRM", description: "Net present value, social discounting, and environmental valuation" },
      { id: "role-markets", title: "Role of Markets", description: "Price allocation mechanism, structural failures, and green premiums" },
      { id: "property-rights", title: "Property Rights Regimes", description: "Private, public, common property, and open access conditions" },
      { id: "tenure-systems", title: "Tenure Systems", description: "Land use rights, customary tenure, and state-backed titling" },
      { id: "spatial-allocation", title: "Spatial Allocation of Resources", description: "Geographic distribution, zoning, and spatial planning models" },
      { id: "temporal-allocation", title: "Temporal Allocation of Resources", description: "Intertemporal extraction, Hotelling's rule, and dynamic paths" },
      { id: "risk", title: "Risk", description: "Probability-based decision structures in ecological harvesting" },
      { id: "uncertainty", title: "Uncertainty", description: "Knightian uncertainty, precautionary principle, and adaptive strategies" },
      { id: "discount-rate", title: "Discount Rate", description: "Social time preference, future generation weighing, and rate debates" }
    ]
  },
  {
    id: "unit-3",
    title: "Unit III: Understanding Collective Action & Commons",
    topics: [
      { id: "collective-action", title: "Collective Action", description: "Voluntary cooperation, institutional building, and community management" },
      { id: "collective-action-theory", title: "Collective Action Theory", description: "Olson's logic of collective action, free-rider problem, and scale" },
      { id: "game-theory", title: "Game Theory in NRM", description: "Strategic interactions, pay-off structures, and Nash equilibria" },
      { id: "prisoners-dilemma", title: "Prisoner's Dilemma", description: "Individual rationality vs collective ruin in resource extraction" },
      { id: "commons", title: "The Commons", description: "Definition of shared resource spaces and resource boundaries" },
      { id: "common-property", title: "Common Property", description: "Excludability, governance rules, and community-level rights" },
      { id: "common-pool-resources", title: "Common Pool Resources (CPR)", description: "Subtractability, difficulty of exclusion, and system boundaries" },
      { id: "characteristics-cpr", title: "Characteristics of CPR", description: "Stock vs flow variables, resource units, and appropriators" },
      { id: "tragedy-commons", title: "Tragedy of the Commons", description: "Hardin's thesis, open access ruin, and historical critiques" }
    ]
  },
  {
    id: "unit-4",
    title: "Unit IV: Management of Commons",
    topics: [
      { id: "regulated-commons", title: "Regulated Commons", description: "Quotas, licenses, monitoring systems, and local bylaws" },
      { id: "unregulated-commons", title: "Unregulated Commons", description: "De facto open access, unregulated degradation, and governance vacuums" },
      { id: "institutional-sustainability", title: "Institutional Sustainability", description: "Long-term rule adherence, robust adaptive capacity, and resilience" },
      { id: "institutional-design", title: "Institutional Design", description: "Structuring rules, incentives, boundary limits, and conflict resolutions" },
      { id: "ostrom-principles", title: "Elinor Ostrom's Design Principles", description: "Eight core conditions for stable, self-governing CPR regimes" },
      { id: "wades-analysis", title: "Robert Wade's Institutional Analysis", description: "Conditions for successful collective action in irrigated systems" },
      { id: "baland-platteau", title: "Baland & Platteau's Contributions", description: "In-depth insights into small-scale, localized resource cooperation" },
      { id: "monitoring-evaluation-cpr", title: "Monitoring and Evaluation of CPR Institutions", description: "Mutual monitoring, graduation of sanctions, and institutional audits" },
      { id: "de-commonization", title: "De-commonization", description: "Enclosure movements, privatization, and state takeover of CPRs" },
      { id: "re-commonization", title: "Re-commonization", description: "Reclaiming public and common spaces, returning governance to local hands" },
      { id: "cpr-public-health", title: "CPR and Public Health", description: "Clean water, air, grazing land, and zoonotic disease containment links" }
    ]
  },
  {
    id: "unit-5",
    title: "Unit V: Management of Environmental Pollution & Externalities",
    topics: [
      { id: "environmental-pollution", title: "Environmental Pollution", description: "Effluents, heavy metal toxins, organic waste, and threshold dynamics" },
      { id: "environmental-degradation", title: "Environmental Degradation", description: "Ecosystem service deterioration, feedback loops, and permanent loss" },
      { id: "externalities", title: "Externalities", description: "Uncompensated side effects of production and consumption on third parties" },
      { id: "market-failure", title: "Market Failure", description: "Price signal distortions, missing markets, and deadweight losses" },
      { id: "property-rights-pollution", title: "Property Rights in Environmental Management", description: "Well-defined rights as a tool for ecological pricing" },
      { id: "coase-theorem", title: "Coase Theorem", description: "Private bargaining, transaction costs, and assignment of property rights" },
      { id: "pigouvian-taxes", title: "Pigouvian Taxes", description: "Internalizing negative externalities through tax correction mechanisms" },
      { id: "subsidies-externalities", title: "Subsidies for Internalizing Externalities", description: "Clean energy subsidies, organic farming support, and moral hazard risks" }
    ]
  },
  {
    id: "unit-6",
    title: "Unit VI: Management of Key Rural Ecosystems & Rural Planning",
    topics: [
      { id: "forest-management", title: "Forest Management", description: "Silvicultural systems, rotations, sustained yield, and community forestry" },
      { id: "joint-forest-management", title: "Joint Forest Management (JFM)", description: "State-community collaborative framework, benefits sharing, and challenges" },
      { id: "wetland-management", title: "Wetland Management", description: "Ramsar sites, ecological filtration, and community fishing rules" },
      { id: "grassland-management", title: "Grassland Management", description: "Rotational grazing, carrying capacity, silvopasture, and fodder security" },
      { id: "watershed-management", title: "Watershed Management", description: "Ridgeline-to-valley treatments, soil-water conservation, and recharge wells" },
      { id: "commons-livelihoods", title: "Commons and Livelihoods", description: "Safety net functions, NTFPs collection, and rural household economics" },
      { id: "rural-planning", title: "Rural Planning", description: "Basing infrastructure, resource hubs, and spatial village plans on geography" },
      { id: "land-use-planning", title: "Land Use Planning", description: "Zoning regulations, optimal allocation, and agricultural preservation" },
      { id: "institutional-strategies", title: "Institutional Strategies for Rural NRM", description: "Gram Panchayat integration, line departments, and inter-agency coordination" }
    ]
  },
  {
    id: "unit-7",
    title: "Unit VII: Climate Change Response, Resilience & Emerging Issues",
    topics: [
      { id: "climate-change", title: "Climate Change", description: "Anthropogenic radiative forcing, systemic global shifts, and long-term trends" },
      { id: "global-warming", title: "Global Warming", description: "Mean global surface temperature increase and hydrological variations" },
      { id: "greenhouse-effect", title: "Greenhouse Effect", description: "Infrared trapping, carbon concentrations, and tipping thresholds" },
      { id: "climate-resilience", title: "Climate Resilience", description: "Ecosystem buffer capacities, livelihood adaptability, and survival structures" },
      { id: "climate-adaptation", title: "Climate Adaptation", description: "Risk management, dykes, rainwater harvesting, and adjustive patterns" },
      { id: "climate-mitigation", title: "Climate Mitigation", description: "Afforestation, carbon capture, grid transition, and lifestyle shifts" },
      { id: "cross-scale-linkages", title: "Cross-scale Linkages", description: "Connecting localized action to international climate policies" },
      { id: "institutional-interplay", title: "Institutional Interplay (Berkes & Young)", description: "Vertical and horizontal coordination across governance levels" },
      { id: "challenges-climate-change", title: "Challenges in Natural Resource Use due to Climate Change", description: "Resource unpredictability, shift of climate zones, and yield declines" },
      { id: "watershed-climate", title: "Watershed Management under Climate Change", description: "Adapting recharge structures to high-intensity, short-duration rainfall" },
      { id: "conjunctive-water-use", title: "Conjunctive Use of Surface Water and Groundwater", description: "Coordinated tapping of canals and borewells to ensure water table stability" },
      { id: "adaptive-crop-planning", title: "Adaptive Crop Planning", description: "Drought-resilient varieties, shifting sowing dates, and multi-cropping" }
    ]
  }
];
