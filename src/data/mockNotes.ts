export function getSimulatedNotes(topicId: string, topicTitle: string): string {
  // Let's create actual textbook content for a couple of core NRM concepts, and a robust dynamic generator for the rest.
  if (topicId === "ostrom-principles") {
    return `# ${topicTitle}

---

## 1. Introduction
Elinor Ostrom's Governing the Commons (1990) revolutionized our understanding of how communities manage shared natural resources. Prior to her empirical research, the prevailing academic consensus was that shared resources (Common Pool Resources) would inevitably be depleted unless privatized or strictly regulated by a central government state. 

Ostrom proved that localized communities could successfully govern their own resources over centuries through self-crafted rule networks, without state intervention or privatization. Understanding these principles is critical for rural managers who design community-based irrigation systems, forest user groups, and localized fisheries.

---

## 2. Learning Objectives
By the end of this study module, you will be able to:
- **Understand** the core premise of Ostrom's institutional design.
- **Explain** each of the eight institutional design principles in simple English.
- **Analyze** real-world cases of success and failure in community resource systems.
- **Evaluate** how local monitoring and graduated sanctions support rule compliance.
- **Apply** these principles to modern rural developmental programs (such as Joint Forest Management in India).

---

## 3. Definitions
- **Academic Definition**: A set of eight robust design principles identified by political scientist Elinor Ostrom that characterize long-enduring, self-organizing Common Pool Resource (CPR) institutions.
- **Simple Definition**: Eight simple rules that a local community must follow to successfully manage shared resources like water, pastures, or forests without destroying them.
- **One-line Exam Definition**: Ostrom's eight rules for sustainable community-level management of the commons.

---

## 4. Background
For decades, policymakers relied on Garrett Hardin's "Tragedy of the Commons" to argue that local farmers were too selfish to manage shared pastures. They insisted on either dividing the pasture into private plots or sending government forest guards to enforce strict conservation. Both approaches often backfired in rural Asia and Africa, destroying customary tenure and causing severe resource depletion. Ostrom's field studies in countries like India, Nepal, Spain, and Switzerland showed that communities already had working rules, leading to her Nobel Prize in Economics (2009).

---

## 5. Core Concept
Common Pool Resources (CPRs) suffer from two distinct problems:
1. **Difficulty of Exclusion**: It is hard to keep people out (e.g., an open lake).
2. **Subtractability**: Whatever resource unit is taken by one is lost to others (e.g., catching a fish).

Ostrom showed that to avoid overexploitation, local "appropriators" (the users) must design an institution that coordinates their behavior. The eight principles act as a protective structural framework for these institutions.

---

## 6. Important Terminology
| Term | Meaning | Example |
| :--- | :--- | :--- |
| **Common Pool Resource (CPR)** | A resource where exclusion is difficult but consumption is subtractive. | A local village grazing ground or aquifer. |
| **Appropriator** | An individual who extracts resource units from a system. | A farmer drawing water from an irrigation canal. |
| **Graduated Sanctions** | Rule-violation penalties that start small and increase with repeat offenses. | A first-time pasture over-grazer pays $5, but a third-time offender pays $100. |

---

## 7. Elinor Ostrom's Eight Design Principles

### Principle 1: Clearly Defined Boundaries
- **Meaning**: The limits of the resource system and the group of authorized users must be clearly defined.
- **Why Important**: Without clear boundaries, outsiders can harvest the resource, leading to free-riding and resource collapse.
- **Practical Indian Example**: In *Kuthambakkam* village, Tamil Nadu, only registered resident households are permitted to harvest non-timber forest produce from the local community woodland.

### Principle 2: Congruence between Rules and Local Conditions
- **Meaning**: Rules regarding harvesting time, place, technology, and quantity must match local ecological conditions and labor requirements.
- **Why Important**: A rule that works in a wet climate will fail miserably in an arid drought-prone zone.
- **Practical Indian Example**: Traditional *Ahar-Pyne* water-harvesting networks in Bihar adjust water distribution based on soil moisture levels during the kharif season.

### Principle 3: Collective-Choice Arrangements
- **Meaning**: Most individuals affected by the operational rules must be allowed to participate in modifying those rules.
- **Why Important**: Users are more likely to obey and adapt rules they helped create.
- **Practical Indian Example**: Village forest committees in Odisha hold monthly general body meetings where all members, including women, vote on the grazing ban period.

### Principle 4: Monitoring
- **Meaning**: Monitors who audit resource conditions and user behavior must be accountable to the users or be the users themselves.
- **Why Important**: Rules are meaningless without observation; local monitors understand the terrain better than distant state officials.
- **Practical Indian Example**: Traditional water guards (*Neerkattis*) in Tamil Nadu are hired and paid directly by the farmers to monitor water flows.

### Principle 5: Graduated Sanctions
- **Meaning**: Users who violate rules must face progressive sanctions rather than absolute bans or minor static fines.
- **Why Important**: Preserves community relationships; a harsh penalty for an accidental first infraction turns users against the community.
- **Practical Indian Example**: In Himachali village pasture groups, first-time illegal cutting yields a warning; secondary yields a public apology; tertiary yields a heavy financial fine.

### Principle 6: Conflict-Resolution Mechanisms
- **Meaning**: Users must have rapid access to low-cost, local arenas to resolve disputes.
- **Why Important**: Long court cases destroy trust. Local disputes should be solved in the village itself.
- **Practical Indian Example**: Rural *Gram Sabhas* or traditional panchayats arbitrate grazing boundary disputes within 48 hours.

### Principle 7: Minimal Recognition of Rights to Organize
- **Meaning**: The rights of users to devise their own institutions must not be challenged by external governmental authorities.
- **Why Important**: If state bureaucrats can easily override local rules, local authority collapses.
- **Practical Indian Example**: Joint Forest Management (JFM) guidelines formally recognize community protection committees.

### Principle 8: Nested Enterprises
- **Meaning**: Appropriation, provision, monitoring, enforcement, and conflict resolution must be organized in nested, multi-tier layers.
- **Why Important**: For large systems (e.g., an entire river basin), localized rules must connect seamlessly with regional and national water frameworks.
- **Practical Indian Example**: Local water user groups are nested within a larger watershed union at the block and district levels.

---

## 8. Process Flow of Collective Action
\`\`\`
User Identification & Boundary Mapping
           ↓
Collective Agreement on Harvesting Limits
           ↓
Localized Monitoring by Elected Guards
           ↓
Application of Graduated Sanctions
           ↓
Rapid Local Dispute Resolution
\`\`\`

---

## 9. Indian Case Study: The Sukhomajri Model
- **Background**: *Sukhomajri*, a village in the Shivalik hills of Haryana, suffered from severe soil erosion and water scarcity in the 1970s.
- **Problem**: Overgrazing by goats had destroyed forest cover, filling the Chandigarh lake with silt. Villagers had no water for irrigation, keeping them in deep poverty.
- **Intervention**: Led by PR Mishra, the community built small earthen dams. They formed a *Hill Resource Management Association* (HRMA). Every household was given an equal share of water, even landless families.
- **Results**: Erosion stopped, the forest regenerated, crop yields quadrupled, and the village became a major milk exporter.
- **Lessons Learned**: CPR institutions succeed when they distribute benefits equitably, ensuring even the poorest landless family has a stake in resource conservation (Ostrom's Principle 2 & 3).

---

## 10. Frequently Asked Questions & Answers
### Q1. What is the fundamental difference between Ostrom's approach and Hardin's Tragedy of the Commons? (5 Marks)
**Answer**:
Hardin's model assumes that users of a common resource are locked in an inescapable dilemma where individual self-interest leads to collective ruin, and they cannot communicate or create rules. Ostrom's empirical evidence proves that users are capable of communicating, building trust, and self-organizing rules (design principles) that prevent ruin without needing privatization or state force.

### Q2. List Ostrom's eight design principles with a one-sentence summary for each. (10 Marks)
**Answer**:
1. **Defined Boundaries**: Know who is in and what is being managed.
2. **Rule Congruence**: Ensure rules match the local environment and labor.
3. **Collective Choice**: Let users participate in making the rules.
4. **Monitoring**: Have accountable monitors tracking resource use.
5. **Graduated Sanctions**: Penalize rule-breakers progressively.
6. **Conflict Resolution**: Resolve disputes locally, fast, and at low cost.
7. **Organizing Recognition**: Ensure the state respects community rules.
8. **Nested Enterprises**: Connect small user groups into larger networks.

---

## 11. Practice Questions & MCQs
1. **Who won the Nobel Prize in Economics in 2009 for analyzing natural resource governance?**
   - A) Ronald Coase
   - B) Arthur Pigou
   - C) Elinor Ostrom
   - D) Garrett Hardin
   - *Answer: C. Elinor Ostrom*
2. **Which design principle is violated if state forest rangers unilaterally ban local wood collection permitted by village rules?**
   - A) Nested Enterprises
   - B) Minimal Recognition of Rights to Organize
   - C) Collective-Choice Arrangements
   - D) Defined Boundaries
   - *Answer: B. Minimal Recognition of Rights to Organize*

---

## 12. Quick Revision Mnemonics (Memory Tricks)
To memorize Ostrom's 8 Principles, use the mnemonic:
**B C C M S R O N** (*"Boundaries, Congruence, Collective, Monitoring, Sanctions, Resolution, Organization, Nested"*)
💡 **Trick**: **B**uild **C**ommunity **C**ontrol, **M**onitor **S**martly, **R**esolve **O**ur **N**eeds!`;
  }

  if (topicId === "tragedy-commons") {
    return `# ${topicTitle}

---

## 1. Introduction
The "Tragedy of the Commons" is one of the most famous economic and environmental metaphors. Popularized by biologist Garrett Hardin in 1968, the concept explains how individuals, acting independently and rationally according to their self-interest, behave in a way that is contrary to the best interests of the entire group by depleting a shared resource.

Understanding this concept is foundational to environmental policy, resource pricing, and rural development strategies aimed at preventing the collapse of shared water aquifers, communal forests, and public grazing lands.

---

## 2. Learning Objectives
By the end of this module, you will be able to:
- **Explain** the mechanics of Hardin's pasture-grazing metaphor.
- **Distinguish** between open-access resources and common property regimes.
- **Analyze** how the subtraction of resource units drives individual overexploitation.
- **Evaluate** the limitations of Hardin's original assumptions.
- **Identify** policy solutions (privatization, state control, or community governance) to resolve the tragedy.

---

## 3. Definitions
- **Academic Definition**: A socio-economic scenario where shared, un-owned resources (open-access resources) are depleted because individual users have no economic incentive to restrict their consumption.
- **Simple Definition**: When everyone uses a shared resource but nobody takes care of it, leading to its destruction.
- **One-line Exam Definition**: The overexploitation of a shared, non-excludable resource due to competing individual self-interests.

---

## 4. Background and Hardin's Pasture Metaphor
Imagine a pasture open to all herdsmen in a village. Each herdsman seeks to maximize his gain. He asks himself: "What is the utility to me of adding one more animal to my herd?"
- **The Positive Component (+1)**: The herdsman receives all the profits from selling the additional animal.
- **The Negative Component (-1)**: The effects of overgrazing are shared equally among all herdsmen using the pasture.
- **The Outcome**: The rational herdsman concludes that the only sensible course is to add another animal, and another, and another... This is the conclusion reached by every rational herdsman, leading to the absolute ruin of the pasture.

---

## 5. Important Terminology
| Term | Meaning | Example |
| :--- | :--- | :--- |
| **Open Access (Res Nullius)** | A resource owned by no one, accessible to everyone without rules. | High seas fisheries. |
| **Common Property (Res Communes)** | A resource managed by a well-defined group with shared access rules. | A village pond. |
| **Subtractability** | The degree to which one person's consumption reduces availability for others. | Pumping groundwater. |

---

## 6. Comparison Table: Open Access vs Common Property
| Feature | Open Access (Res Nullius) | Common Property (Res Communes) |
| :--- | :--- | :--- |
| **Ownership** | None. Truly unowned. | Owned by a defined community group. |
| **Access Rules** | Non-existent. Anyone can harvest. | Restricted. Only members with permits. |
| **Sanctions** | None. | Active peer-monitoring and penalties. |
| **Susceptibility to Tragedy** | **Extremely High** | **Low** (due to working rules) |

---

## 7. Limitations of Hardin's Thesis
Critics, including Elinor Ostrom, have pointed out several major flaws in Hardin's logic:
1. **Confused Open-Access with Commons**: Hardin assumed that a "commons" always lacks rules. In reality, historical commons had sophisticated community rules.
2. **Assumed No Communication**: Hardin assumed herdsmen are locked in solitary boxes, unable to talk or coordinate.
3. **Ignored Community Cooperation**: Communities are highly capable of self-policing to protect shared assets.

---

## 8. Real-world Case Study: Groundwater Depletion in Punjab, India
- **Background**: The Green Revolution in Punjab heavily relied on water-intensive paddy crops.
- **Problem**: Free electricity for agricultural tubewells created an "open-access" mindset. Farmers pumped water aggressively, treating the shared underground aquifer as an infinite individual resource pool.
- **Intervention & Impact**: The water table plunged by over 1 meter per year, threatening future food security. In response, Punjab enacted the *Preservation of Subsoil Water Act* to mandate late transplantation, matching monsoon cycles.
- **Lessons Learned**: Unpriced, unregulated groundwater acts as an unregulated open-access commons, driving the Hardin tragedy unless state regulations or local community quotas intervene.

---

## 9. Practice Questions & MCQs
1. **Garrett Hardin published his famous 'Tragedy of the Commons' paper in which year?**
   - A) 1950
   - B) 1968
   - C) 1990
   - D) 2009
   - *Answer: B. 1968*
2. **Which of the following is an economic solution to Hardin's tragedy?**
   - A) Defining private property rights
   - B) Government pigouvian taxation
   - C) Community-based quota systems
   - D) All of the above
   - *Answer: D. All of the above*

---

## 10. Revision Mnemonic
💡 Remember **H.A.R.D.I.N.**:
- **H**erdsman metaphor
- **A**ccess is open
- **R**ational self-interest
- **D**epletion of stocks
- **I**ndividual gain, shared pain
- **N**o-cooperation assumption`;
  }

  // General fallback dynamic textbook generator in compliance with requested style
  return `# ${topicTitle}

---

## 1. Introduction
This section covers **${topicTitle}**, which is a vital part of the Natural Resource Management (NRM) course syllabus. Under rural development and environmental economics, this topic explores the balance between human consumption, policy intervention, and natural ecosystem equilibrium.

Whether analyzing resource distribution, institutional rules, or conservation models, managing this system is crucial for long-term rural livelihood security, community resilience, and economic sustainability.

---

## 2. Learning Objectives
By studying this module, students will be able to:
- **Explain** the academic foundations of ${topicTitle}.
- **Understand** how this concept impacts resource conservation and rural development.
- **Evaluate** the advantages, limitations, and field-level challenges of implementing this concept.
- **Compare** this system with alternative ecological governance structures.
- **Apply** these insights to draft policy frameworks in the Indian rural context.

---

## 3. Definitions
- **Academic Definition**: The structured systematic study or application of governance and economic allocation rules regarding ${topicTitle} to optimize societal welfare and ecological health.
- **Simple Definition**: Practical ways to organize, share, and protect ${topicTitle} so we do not run out of resources in the future.
- **One-line Exam Definition**: A strategic framework designed to optimize the sustainability, extraction, and protection of ${topicTitle}.

---

## 4. Background & Historical Evolution
The management of ${topicTitle} has evolved from decentralized customary community practices in traditional villages, through highly extractive colonial regimes, into centralized post-independence state control. Recently, there has been a significant global shift back toward decentralized, participatory community-led co-management models to promote resilience under climate pressures.

---

## 5. Core Concept Breakdown
- **Meaning & Scope**: This concept centers on resolving resource scarcity, positive/negative externalities, and property rights disputes.
- **Importance**: Ensures that short-term economic yields do not cause permanent ecological collapse.
- **Practical Application**: Formulates community rules, micro-level plans, and national legal frameworks (e.g., in water districts, village forest panels, or carbon markets).

---

## 6. Important Terminology
| Term | Meaning | Example |
| :--- | :--- | :--- |
| **Sustainability** | Meeting current needs without compromising future generations. | Harvesting timber below the annual tree growth rate. |
| **Externality** | Uncompensated spillover effects on third parties. | Chemical runoff polluting village drinking water. |
| **Resilience** | The capacity of a system to absorb disturbance and reorganize. | A diverse forest recovering quickly from a pest outbreak. |

---

## 7. Principles & Implementation
1. **Precautionary Principle**: If an action has a risk of causing severe harm to the environment, protective measures should be taken even before absolute scientific certainty is reached.
2. **Polluter Pays Principle**: Those who cause environmental degradation must bear the costs of restoration and mitigation.
3. **Intergenerational Equity**: The current generation must preserve resources so that future generations can enjoy a healthy planet.

---

## 8. Process Flow and Working Mechanism
\`\`\`
Initial Assessment & Baseline Resource Audit
                    ↓
Drafting Adaptive Governance & Allocation Rules
                    ↓
Community-led Execution & Shared Monitoring
                    ↓
Periodic Evaluation & Feedback Adjustments
\`\`\`

---

## 9. Advantages & Limitations
### Key Advantages (10 Points)
1. Promotes stable long-term water, soil, and vegetation security.
2. Safeguards tribal and traditional forest dweller livelihoods.
3. Prevents irreversible market failures and biodiversity loss.
4. Enhances soil carbon capture and climate mitigation.
5. Builds decentralized local governance capacity (Gram Sabhas).
6. Decreases disaster risk (floods, mudslides, and crop collapses).
7. Minimizes environmental conflicts between state and communities.
8. Attracts global climate finance and sustainable investment.
9. Stabilizes micro-climate and regional precipitation cycles.
10. Enhances rural food, fodder, and fuel self-reliance.

### Key Limitations & Challenges (10 Points)
1. High initial implementation and boundary-monitoring costs.
2. Inter-community disputes over grazing and water boundaries.
3. Bureaucratic resistance to devolving powers to local bodies.
4. elite capture of village forest and watershed committees.
5. Lack of immediate short-term financial returns for poor farmers.
6. Weak institutional alignment between state and local levels.
7. Technical gaps in water and carbon credit monitoring.
8. Climate changes shifting resource zones unpredictably.
9. Inadequate legal enforcement of environmental protection laws.
10. Gender disparity in community-level decision-making bodies.

---

## 10. Indian Context & Case Study
- **Background**: India has a diverse rural landscape where millions rely directly on forest, soil, and water commons.
- **Initiative**: Several government schemes such as **MGNREGA** (for water harvesting), **PMKSY** (for micro-irrigation), and **CAMPA** (for afforestation) aim to scale restoration.
- **Success Story**: *Ralegan Siddhi* in Maharashtra transformed from a drought-prone, impoverished village into an eco-oasis through watershed development, demonstrating that community planning and voluntary labor (*Shramdaan*) can overcome acute ecological crises.

---

## 11. Practice Questions & MCQs
1. **Which Indian government scheme focuses heavily on creating rural water-harvesting structures like farm ponds?**
   - A) PM-KISAN
   - B) MGNREGA
   - C) PM-AY
   - D) National Skill Mission
   - *Answer: B. MGNREGA*
2. **The Principle that states 'those who cause pollution must pay for the damage' is called:**
   - A) Precautionary Principle
   - B) Polluter Pays Principle
   - C) Sustainable Yield Principle
   - D) Coase Theorem
   - *Answer: B. Polluter Pays Principle*

---

## 12. Quick Revision Mnemonic
💡 Remember the mnemonic **C.A.R.E.**:
- **C**onserve natural stocks
- **A**dapt to climate stresses
- **R**estore degraded topsoil/water
- **E**mpower local rural communities!`;
}
