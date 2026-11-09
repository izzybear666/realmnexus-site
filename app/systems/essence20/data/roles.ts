// Ranger spectra and role data for Essence20 (developer-provided, mechanically partial)
export type Spectrum = {
  id: string;
  name: string;
  description?: string;
  // Whether spectrum rules are fully detailed here
  mechanicsComplete: boolean;
  notes?: string;
};

export type CapacityGrowth = "Slow" | "Moderate" | "Fast";

export type CalculationModifier = {
  target: "Strength" | "Speed" | "Smarts" | "Social";
  operation: "add";
  value: number;
};

export type SpectrumRules = {
  modifiers?: CalculationModifier[];
  capacityGrowth?: CapacityGrowth;
  notes?: string;
};

export type VerificationStatus = "missing" | "partial" | "verified";

export type VerificationInfo = {
  status: VerificationStatus;
  sourceNotes?: string[];
};

export type StartingBenefit = {
  id: string;
  name: string;
  description?: string;
};

export type SkillGrant = {
  id: string;
  skillName?: string;
  grantType: "training" | "specialization";
  notes?: string;
};

export type RoleFeature = {
  id: string;
  name: string;
  description?: string;
  gainedAtLevel?: number;
  actionType?: string;
  cost?: string;
  range?: string;
  duration?: string;
  usageLimit?: string;
  unverifiedDetails?: string[];
};

export type LevelProgressionEntry = {
  level: number;
  featureIds?: string[];
	personalPowerCapacity?: number;
  quipsAndSpeeches?: number;
	resourceLabel?: string;
  resourceValue?: string;
  essenceIncreases?: CalculationModifier[];
  notes?: string;
};

export type StartingEquipment = {
  id: string;
  itemName?: string;
  quantity?: number;
  notes?: string;
};

export type RoleRules = {
  verification?: VerificationInfo;
  startingBenefits?: StartingBenefit[];
  skillGrants?: SkillGrant[];
  features?: RoleFeature[];
  progression?: LevelProgressionEntry[];
  startingEquipment?: StartingEquipment[];
  modifiers?: CalculationModifier[];
};

export type Role = {
  id: string;
  name: string; // e.g., 'Red'
  spectrumId?: string; // optional linkage to a spectrum
  description?: string;
  mechanicsComplete: boolean;
  notes?: string;
  spectrumRules?: SpectrumRules;
  roleRules?: RoleRules;
};

export const SPECTRA: Spectrum[] = [
  { id: "primary", name: "Primary", description: "Primary ranger spectrum (standard team colors)", mechanicsComplete: false },
	{ id: "advanced", name: "Advanced", description: "Advanced or special spectra (e.g., White Ranger). Requires Spectrum Shift to access.", mechanicsComplete: false, notes: "Verified from Chapter 4 printed pages 58–59: Advanced colors require the Spectrum Shift Perk and exchange Ranger levels. White-specific Role Perk mechanics beyond listed progression remain partially unverified in current project extracts." },
];

export const ROLES: Role[] = [
	{
	id: "black",
	name: "Black",
	spectrumId: "primary",
	description: "Black Ranger role (example).",
	mechanicsComplete: false,
	spectrumRules: {
	  modifiers: [{ target: "Social", operation: "add", value: 2 }, { target: "Strength", operation: "add", value: 1 }],
	  capacityGrowth: "Slow",
	  notes: "Verified listed Spectrum values only; application timing/order is not encoded here.",
	},
	roleRules: {
	  verification: {
		status: "partial",
		sourceNotes: [
		  "Power Rangers Core Rulebook, Chapter 4: Black Ranger, printed pages 31–34.",
		  "Verified in this file: printed page 31 Table 4-2 level 1–20 progression columns and printed page 32 starting Black Ranger rules.",
		  "Role feature mechanical details/effects still require full verification before mechanicsComplete can be set true.",
		],
	  },
	  startingBenefits: [
		{ id: "black-armor-training", name: "Armor Training", description: "Training: Light and Medium armor." },
		{ id: "black-personal-power-regeneration", name: "Personal Power Regeneration", description: "Regain 2 Personal Power per day." },
		{ id: "black-personal-power-capacity-growth", name: "Personal Power Capacity Growth", description: "Personal Power Capacity increases by +2 every 5 levels." },
	  ],
	  skillGrants: [
		{ id: "black-might-rank", skillName: "Might", grantType: "training", notes: "Starting Skill Rank: +1 Might." },
		{ id: "black-performance-rank", skillName: "Performance", grantType: "training", notes: "Starting Skill Ranks: +2 Performance." },
	  ],
	  startingEquipment: [
		{ id: "black-wrist-communicator", itemName: "Wrist Communicator", quantity: 1 },
		{ id: "black-power-morpher", itemName: "Power Morpher", quantity: 1 },
		{ id: "black-blade-blaster", itemName: "Blade Blaster", quantity: 1, notes: "Morphed only." },
		{ id: "black-versatile-power-weapon", itemName: "Versatile Power Weapon", quantity: 1, notes: "Morphed only." },
	  ],
	  features: [
		{
		  id: "black-its-morphin-time",
		  name: "It's Morphin Time!",
		  gainedAtLevel: 1,
		  actionType: "Standard action",
		  description: "Morph using the Power Morpher. While Morphed: Toughness follows armor-training rules, jump distance maximums are tripled, and a Power-based weapon can be summoned as a free action. At 0 Health, you may drop to natural form unconscious at 1 Health to avoid Defeat.",
		},
		{
		  id: "black-heart-of-the-team-1",
		  name: "Heart of the Team (1)",
		  gainedAtLevel: 1,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 60 feet who can understand you",
		  description: "Apply a ↑1 shift to one ally's roll.",
		},
		{
		  id: "black-whatever-we-need",
		  name: "Whatever We Need",
		  gainedAtLevel: 2,
		  cost: "Spend 1 Quips & Speeches use",
		  description: "Ask an NPC for a favor; gain Edge on Alertness, Deception, and Persuasion checks targeting that NPC for 5 minutes.",
		  duration: "5 minutes",
		},
		{
		  id: "black-you-got-this-1",
		  name: "You Got This! (1)",
		  gainedAtLevel: 2,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 30 feet",
		  duration: "Until current combat scene ends",
		  description: "Grant temporary Health to one ally using rank (1) from the role table.",
		  unverifiedDetails: ["Exact numeric temporary Health value for rank (1) is not confirmed in the currently extracted local source text."],
		},
		{ id: "black-zord", name: "Zord", gainedAtLevel: 3, description: "No Snags on Driving checks while piloting your personal Zord and access to the team's appropriate Zord/Borg/vehicle." },
		{ id: "black-general-perk-1", name: "General Perk", gainedAtLevel: 4, description: "Choose one General Perk for which prerequisites are met." },
		{ id: "black-extra-attack", name: "Extra Attack", gainedAtLevel: 5, description: "While Morphed and fighting as an individual, take two attacks instead of one when using the Attack action." },
		{
		  id: "black-heart-of-the-team-2",
		  name: "Heart of the Team (2)",
		  gainedAtLevel: 5,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 60 feet who can understand you",
		  description: "Apply a ↑2 shift to one ally's roll.",
		},
		{ id: "black-zord-feature-1", name: "Zord Feature", gainedAtLevel: 6, description: "Choose one qualifying Zord Feature for your personal Zord using Zord rules." },
		{ id: "black-grid-power-1", name: "Grid Power", gainedAtLevel: 6, description: "Choose one qualifying Grid Power." },
		{
		  id: "black-you-got-this-2",
		  name: "You Got This! (2)",
		  gainedAtLevel: 7,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 30 feet",
		  duration: "Until current combat scene ends",
		  description: "Grant temporary Health to one ally using rank (2) from the role table.",
		  unverifiedDetails: ["Exact numeric temporary Health value for rank (2) is not confirmed in the currently extracted local source text."],
		},
		{ id: "black-general-perk-2", name: "General Perk", gainedAtLevel: 8, description: "Choose one General Perk for which prerequisites are met." },
		{ id: "black-zord-feature-2", name: "Zord Feature", gainedAtLevel: 10, description: "Choose one qualifying Zord Feature for your personal Zord using Zord rules." },
		{
		  id: "black-heart-of-the-team-3",
		  name: "Heart of the Team (3)",
		  gainedAtLevel: 10,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 60 feet who can understand you",
		  description: "Apply a ↑3 shift to one ally's roll.",
		},
		{ id: "black-grid-power-2", name: "Grid Power", gainedAtLevel: 11, description: "Choose one qualifying Grid Power." },
		{ id: "black-one-for-all", name: "One For All", gainedAtLevel: 11, actionType: "Standard action while Morphed", usageLimit: "Once per day", cost: "Spend 3 current Personal Power", description: "All teammates immediately regain 1d2 Personal Power. This does not use Quips & Speeches." },
		{ id: "black-general-perk-3", name: "General Perk", gainedAtLevel: 12, description: "Choose one General Perk for which prerequisites are met." },
		{
		  id: "black-you-got-this-3",
		  name: "You Got This! (3)",
		  gainedAtLevel: 12,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 30 feet",
		  duration: "Until current combat scene ends",
		  description: "Grant temporary Health to one ally using rank (3) from the role table.",
		  unverifiedDetails: ["Exact numeric temporary Health value for rank (3) is not confirmed in the currently extracted local source text."],
		},
		{ id: "black-zord-feature-3", name: "Zord Feature", gainedAtLevel: 14, description: "Choose one qualifying Zord Feature for your personal Zord using Zord rules." },
		{
		  id: "black-heart-of-the-team-4",
		  name: "Heart of the Team (4)",
		  gainedAtLevel: 15,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 60 feet who can understand you",
		  description: "Apply a ↑4 shift to one ally's roll.",
		},
		{ id: "black-general-perk-4", name: "General Perk", gainedAtLevel: 16, description: "Choose one General Perk for which prerequisites are met." },
		{ id: "black-grid-power-3", name: "Grid Power", gainedAtLevel: 16, description: "Choose one qualifying Grid Power." },
		{ id: "black-zord-feature-4", name: "Zord Feature", gainedAtLevel: 17, description: "Choose one qualifying Zord Feature for your personal Zord using Zord rules." },
		{
		  id: "black-you-got-this-4",
		  name: "You Got This! (4)",
		  gainedAtLevel: 17,
		  actionType: "Free action",
		  cost: "Spend 1 Quips & Speeches use",
		  range: "Ally within 30 feet",
		  duration: "Until current combat scene ends",
		  description: "Grant temporary Health to one ally using rank (4) from the role table.",
		  unverifiedDetails: ["Exact numeric temporary Health value for rank (4) is not confirmed in the currently extracted local source text."],
		},
		{ id: "black-all-for-one", name: "All For One", gainedAtLevel: 18, usageLimit: "Once per day", description: "When at 0 Personal Power or 0 Health, teammates may each choose to transfer 1d2 Power and/or 1 Health to you by spending the same amount." },
		{ id: "black-general-perk-5", name: "General Perk", gainedAtLevel: 19, description: "Choose one General Perk for which prerequisites are met." },
		{ id: "black-prime", name: "Black Ranger Prime", gainedAtLevel: 20, description: "While Morphed: +2 to all Defenses, +1 damage on Martial Arts attacks, and Edge on Social skill checks." },
	  ],
	  progression: [
		{ level: 1, featureIds: ["black-its-morphin-time", "black-heart-of-the-team-1"], personalPowerCapacity: 2, quipsAndSpeeches: 2, essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }, { target: "Social", operation: "add", value: 2 }] },
		{ level: 2, featureIds: ["black-whatever-we-need", "black-you-got-this-1"], personalPowerCapacity: 2, quipsAndSpeeches: 2, essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 3, featureIds: ["black-zord"], personalPowerCapacity: 2, quipsAndSpeeches: 3, essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 4, featureIds: ["black-general-perk-1"], personalPowerCapacity: 2, quipsAndSpeeches: 3, essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 5, featureIds: ["black-extra-attack", "black-heart-of-the-team-2"], personalPowerCapacity: 4, quipsAndSpeeches: 4, essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 6, featureIds: ["black-zord-feature-1", "black-grid-power-1"], personalPowerCapacity: 4, quipsAndSpeeches: 4, essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 7, featureIds: ["black-you-got-this-2"], personalPowerCapacity: 4, quipsAndSpeeches: 5, essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 8, featureIds: ["black-general-perk-2"], personalPowerCapacity: 4, quipsAndSpeeches: 5, essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 9, featureIds: [], personalPowerCapacity: 6, quipsAndSpeeches: 6, essenceIncreases: [{ target: "Social", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 10, featureIds: ["black-zord-feature-2", "black-heart-of-the-team-3"], personalPowerCapacity: 6, quipsAndSpeeches: 6, essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 11, featureIds: ["black-grid-power-2", "black-one-for-all"], personalPowerCapacity: 6, quipsAndSpeeches: 7, essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 12, featureIds: ["black-general-perk-3", "black-you-got-this-3"], personalPowerCapacity: 6, quipsAndSpeeches: 7, essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 13, featureIds: [], personalPowerCapacity: 8, quipsAndSpeeches: 8, essenceIncreases: [{ target: "Social", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 14, featureIds: ["black-zord-feature-3"], personalPowerCapacity: 8, quipsAndSpeeches: 8, essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 15, featureIds: ["black-heart-of-the-team-4"], personalPowerCapacity: 8, quipsAndSpeeches: 9, essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 16, featureIds: ["black-general-perk-4", "black-grid-power-3"], personalPowerCapacity: 8, quipsAndSpeeches: 9, essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 17, featureIds: ["black-zord-feature-4", "black-you-got-this-4"], personalPowerCapacity: 10, quipsAndSpeeches: 10, essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 18, featureIds: ["black-all-for-one"], personalPowerCapacity: 10, quipsAndSpeeches: 10, essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 19, featureIds: ["black-general-perk-5"], personalPowerCapacity: 10, quipsAndSpeeches: 11, essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 20, featureIds: ["black-prime"], personalPowerCapacity: 10, quipsAndSpeeches: 11, essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
	  ],
  },
  },
  {
	id: "blue",
	name: "Blue",
	spectrumId: "primary",
	description: "Blue Ranger role (example).",
	mechanicsComplete: true,
	spectrumRules: {
	  modifiers: [{ target: "Smarts", operation: "add", value: 2 }, { target: "Speed", operation: "add", value: 1 }],
	  capacityGrowth: "Fast",
	  notes: "Verified listed Spectrum values only; application timing/order is not encoded here.",
	},
	roleRules: {
	  verification: {
		status: "verified",
		sourceNotes: [
		  "Power Rangers Core Rulebook, Chapter 4: Blue Ranger table/features pages 37–42 (printed pages around 37–41).",
		  "Starting profile, progression, and role feature mechanics including Grid Tech I–IV option lists are represented from the extracted section."
		],
	  },
	  startingBenefits: [
		{ id: "blue-armor-training", name: "Armor Training", description: "Training: Light and Medium armor." },
		{ id: "blue-personal-power-regeneration", name: "Personal Power Regeneration", description: "Regain 4 Personal Power per day." },
		{ id: "blue-personal-power-capacity-growth", name: "Personal Power Capacity Growth", description: "Personal Power Capacity increases by +2 every 4 levels." },
	  ],
	  skillGrants: [
		{ id: "blue-finesse-or-targeting-rank", skillName: "Finesse or Targeting", grantType: "training", notes: "Starting Skill Ranks: +1 Finesse or +1 Targeting." },
		{ id: "blue-science-rank", skillName: "Science", grantType: "training", notes: "Starting Skill Rank: +1 Science." },
		{ id: "blue-technology-rank", skillName: "Technology", grantType: "training", notes: "Starting Skill Rank: +1 Technology." },
	  ],
	  startingEquipment: [
		{ id: "blue-wrist-communicator", itemName: "Wrist Communicator", quantity: 1 },
		{ id: "blue-power-morpher", itemName: "Power Morpher", quantity: 1 },
		{ id: "blue-blade-blaster", itemName: "Blade Blaster", quantity: 1, notes: "Morphed only." },
		{ id: "blue-two-handed-power-weapon", itemName: "Two-Handed Power Weapon", quantity: 1, notes: "Morphed only." },
	  ],
	  features: [
		{ id: "blue-its-morphin-time", name: "It's Morphin Time!", gainedAtLevel: 1, actionType: "Standard action", description: "Morph using the Power Morpher. While Morphed: Toughness follows armor-training rules, jump distance maximums are tripled, a Power-based weapon can be summoned as a free action, and when reduced to 0 Health you may avoid Defeat by returning to natural form unconscious at 1 Health." },
		{ id: "blue-eureka", name: "Eureka!", gainedAtLevel: 1, description: "Gain Idea Points per day from the role table. Spend 1 Idea Point before a Smarts skill check to gain Edge on that roll." },
		{ id: "blue-helping-hand", name: "Helping Hand", gainedAtLevel: 2, actionType: "Free action", cost: "Spend 1 Personal Power", range: "Morphed teammate within 60 feet", description: "Heal 1 Health to one Morphed member of a Power Ranger team." },
		{ id: "blue-grid-tech-1", name: "Grid Tech I", gainedAtLevel: 2, description: "Choose two Grid Tech I bonuses. Options: Aptitude Augmenter (pick one skill you have at least one level in; re-roll 1s and 2s with that skill; may be chosen multiple times), Gridspeak Receivers (your Morphed team can understand/read any language used by Morphin Grid creatures), Gridspeak Transmitters (your Morphed team can speak a universal language understandable by Morphin Grid creatures), Blaster Focusers (add a ↑1 shift to all Blade Blaster attacks of your team)." },
		{ id: "blue-zord", name: "Zord", gainedAtLevel: 3, description: "When piloting your personal Zord, you cannot suffer Snags when using Driving. Gain access to your team-appropriate Zord/Borg/Power vehicle." },
		{ id: "blue-general-perk-1", name: "General Perk", gainedAtLevel: 4, description: "Choose one Generic Perk for which prerequisites are met." },
		{ id: "blue-zord-feature-1", name: "Zord Feature", gainedAtLevel: 6, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "blue-grid-power-1", name: "Grid Power", gainedAtLevel: 6, description: "Choose one qualifying Grid Power." },
		{ id: "blue-grid-tech-2", name: "Grid Tech II", gainedAtLevel: 7, description: "Choose two Grid Tech II bonuses. Options: Defensive Shields (+1 Morphed Toughness to one team member; may be chosen once per team member), Enhanced Summoner (your team reduces rounds to summon Zords by 1, minimum 1), Power Focusers (add a ↑1 shift to all Power Weapon attacks of your team), Vision Focuser (+30 feet Enhanced Vision while Morphed; may be chosen twice)." },
		{ id: "blue-general-perk-2", name: "General Perk", gainedAtLevel: 8, description: "Choose one Generic Perk for which prerequisites are met." },
		{ id: "blue-power-infusion-1s", name: "Power Infusion (1s)", gainedAtLevel: 9, actionType: "Free action while Morphed", usageLimit: "Once per scene", cost: "Spend 1 Personal Power", range: "You and Morphed teammates within 60 feet", description: "You and affected teammates re-roll natural 1s on your next successful attack." },
		{ id: "blue-zord-feature-2", name: "Zord Feature", gainedAtLevel: 10, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "blue-power-burst-1d2", name: "Power Burst (1d2)", gainedAtLevel: 10, actionType: "Standard action", usageLimit: "Once per scene", description: "Every Morphed member of the Power Ranger team regains 1d2 Personal Power, regardless of location on the Grid." },
		{ id: "blue-extra-attack", name: "Extra Attack", gainedAtLevel: 11, description: "While Morphed and fighting as an individual, attack twice instead of once when taking the Attack action." },
		{ id: "blue-grid-power-2", name: "Grid Power", gainedAtLevel: 11, description: "Choose one qualifying Grid Power." },
		{ id: "blue-general-perk-3", name: "General Perk", gainedAtLevel: 12, description: "Choose one Generic Perk for which prerequisites are met." },
		{ id: "blue-grid-tech-3", name: "Grid Tech III", gainedAtLevel: 12, description: "Choose two Grid Tech III bonuses. Options: Aim Apparatus (one team member gains a level in Targeting; may be chosen multiple times, once per team member), Morphin Grid Mapsuite (always aware of your local position on the Morphin Grid), Survival Node (pick one skill you have no levels in and gain it at a special D2 level that cannot be increased without buying D2 normally; may be chosen multiple times), X-Tech Visor (see through solid objects not made of lead or specially shielded against radiation to 30 feet; only outlines/densities are visible)." },
		{ id: "blue-zord-feature-3", name: "Zord Feature", gainedAtLevel: 14, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "blue-power-burst-1d4", name: "Power Burst (1d4)", gainedAtLevel: 15, actionType: "Standard action", usageLimit: "Once per scene", description: "Every Morphed member of the Power Ranger team regains 1d4 Personal Power, regardless of location on the Grid." },
		{ id: "blue-general-perk-4", name: "General Perk", gainedAtLevel: 16, description: "Choose one Generic Perk for which prerequisites are met." },
		{ id: "blue-grid-power-3", name: "Grid Power", gainedAtLevel: 16, description: "Choose one qualifying Grid Power." },
		{ id: "blue-zord-feature-4", name: "Zord Feature", gainedAtLevel: 17, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "blue-grid-tech-4", name: "Grid Tech IV", gainedAtLevel: 17, description: "Choose two Grid Tech IV bonuses. Options: Energic Shields (pick one non-physical damage type: blunt or sharp; while Morphed gain +3 Toughness to that type), Gridspeak Translator (your Morphed team can speak/understand/read/write all languages used by Morphin Grid creatures), Megaform Expeditor (your Zord takes 1d4 fewer rounds to be ready for Combined transformation, minimum 1), Zeo Tech Augment (your team chooses Blade Blasters or Power Weapons and gains a ↑1 shift on attacks using the chosen weapon type)." },
		{ id: "blue-power-infusion-2s", name: "Power Infusion (2s)", gainedAtLevel: 18, actionType: "Free action while Morphed", usageLimit: "Once per scene", cost: "Spend 1 Personal Power", range: "You and Morphed teammates within 60 feet", description: "As Power Infusion, and affected characters may also re-roll natural 2s on the next successful attack." },
		{ id: "blue-general-perk-5", name: "General Perk", gainedAtLevel: 19, description: "Choose one Generic Perk for which prerequisites are met." },
		{ id: "blue-prime", name: "Blue Ranger Prime", gainedAtLevel: 20, description: "While Morphed: +2 to all Defenses, +1 damage on Powers attacks, and Edge on Social skill checks." },
	  ],
	  progression: [
		{ level: 1, featureIds: ["blue-its-morphin-time", "blue-eureka"], personalPowerCapacity: 2, resourceLabel: "Idea Points", resourceValue: "1", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }, { target: "Smarts", operation: "add", value: 2 }] },
		{ level: 2, featureIds: ["blue-helping-hand", "blue-grid-tech-1"], personalPowerCapacity: 2, resourceLabel: "Idea Points", resourceValue: "2", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 3, featureIds: ["blue-zord"], personalPowerCapacity: 2, resourceLabel: "Idea Points", resourceValue: "2", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 4, featureIds: ["blue-general-perk-1"], personalPowerCapacity: 4, resourceLabel: "Idea Points", resourceValue: "2", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 5, featureIds: [], personalPowerCapacity: 4, resourceLabel: "Idea Points", resourceValue: "3", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 6, featureIds: ["blue-zord-feature-1", "blue-grid-power-1"], personalPowerCapacity: 4, resourceLabel: "Idea Points", resourceValue: "3", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 7, featureIds: ["blue-grid-tech-2"], personalPowerCapacity: 6, resourceLabel: "Idea Points", resourceValue: "3", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 8, featureIds: ["blue-general-perk-2"], personalPowerCapacity: 6, resourceLabel: "Idea Points", resourceValue: "4", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 9, featureIds: ["blue-power-infusion-1s"], personalPowerCapacity: 6, resourceLabel: "Idea Points", resourceValue: "4", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 10, featureIds: ["blue-zord-feature-2", "blue-power-burst-1d2"], personalPowerCapacity: 8, resourceLabel: "Idea Points", resourceValue: "4", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 11, featureIds: ["blue-extra-attack", "blue-grid-power-2"], personalPowerCapacity: 8, resourceLabel: "Idea Points", resourceValue: "5", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 12, featureIds: ["blue-general-perk-3", "blue-grid-tech-3"], personalPowerCapacity: 8, resourceLabel: "Idea Points", resourceValue: "5", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 13, featureIds: [], personalPowerCapacity: 10, resourceLabel: "Idea Points", resourceValue: "5", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 14, featureIds: ["blue-zord-feature-3"], personalPowerCapacity: 10, resourceLabel: "Idea Points", resourceValue: "6", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 15, featureIds: ["blue-power-burst-1d4"], personalPowerCapacity: 10, resourceLabel: "Idea Points", resourceValue: "6", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 16, featureIds: ["blue-general-perk-4", "blue-grid-power-3"], personalPowerCapacity: 12, resourceLabel: "Idea Points", resourceValue: "6", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 17, featureIds: ["blue-zord-feature-4", "blue-grid-tech-4"], personalPowerCapacity: 12, resourceLabel: "Idea Points", resourceValue: "7", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 18, featureIds: ["blue-power-infusion-2s"], personalPowerCapacity: 12, resourceLabel: "Idea Points", resourceValue: "7", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 19, featureIds: ["blue-general-perk-5"], personalPowerCapacity: 14, resourceLabel: "Idea Points", resourceValue: "7", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 20, featureIds: ["blue-prime"], personalPowerCapacity: 14, resourceLabel: "Idea Points", resourceValue: "8", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
	  ],
	},
  },
  {
	id: "green",
	name: "Green",
	spectrumId: "primary",
	description: "Green Ranger role (example).",
	mechanicsComplete: true,
	spectrumRules: {
	  modifiers: [{ target: "Strength", operation: "add", value: 2 }, { target: "Speed", operation: "add", value: 1 }],
	  capacityGrowth: "Moderate",
	  notes: "Verified listed Spectrum values only; application timing/order is not encoded here.",
	},
	roleRules: {
	  verification: {
		status: "verified",
		sourceNotes: [
		  "Power Rangers Core Rulebook, Chapter 4: Green Ranger table/features pages 43–46 (printed pages around 43–45).",
		  "Progression, starting profile, and role feature mechanics including Unique Weapon and Survival Boon option sets are represented from the extracted section."
		],
	  },
	  startingBenefits: [
		{ id: "green-armor-training", name: "Armor Training", description: "Training: Light and Medium armor." },
		{ id: "green-personal-power-regeneration", name: "Personal Power Regeneration", description: "Regain 3 Personal Power per day." },
		{ id: "green-personal-power-capacity-growth", name: "Personal Power Capacity Growth", description: "Personal Power Capacity increases by +1 every 3 levels." },
	  ],
	  skillGrants: [
		{ id: "green-might-rank", skillName: "Might", grantType: "training", notes: "Starting Skill Rank: +1 Might." },
		{ id: "green-conditioning-rank", skillName: "Conditioning", grantType: "training", notes: "Starting Skill Rank: +1 Conditioning." },
		{ id: "green-finesse-or-initiative-rank", skillName: "Finesse or Initiative", grantType: "training", notes: "Starting Skill Ranks: +1 Finesse or +1 Initiative." },
	  ],
	  startingEquipment: [
		{ id: "green-wrist-communicator", itemName: "Wrist Communicator", quantity: 1 },
		{ id: "green-power-morpher", itemName: "Power Morpher", quantity: 1 },
		{ id: "green-blade-blaster", itemName: "Blade Blaster", quantity: 1, notes: "Morphed only." },
	  ],
	  features: [
		{ id: "green-its-morphin-time", name: "It's Morphin Time!", gainedAtLevel: 1, actionType: "Standard action", description: "Morph using the Power Morpher. While Morphed: Toughness follows armor-training rules, jump distance maximums are tripled, a Power-based weapon can be summoned as a free action, and when reduced to 0 Health you may avoid Defeat by returning to natural form unconscious at 1 Health." },
		{ id: "green-solo-strike", name: "Solo Strike", gainedAtLevel: 1, description: "Make a single melee attack against an adjacent target that is not adjacent to any of your allies; apply the listed Solo Strike shift. Hit or miss, you cannot make other attacks that round." },
		{ id: "green-unique-weapon", name: "Unique Weapon", gainedAtLevel: 1, description: "Gain a special unique Power Weapon, chosen or rolled on the Unique Weapon Traits table. Options: (1) Ranged 60/100 [Targeting]: stores up to 3 Personal Power for wielder; risk: on natural 1 to hit, user loses 1d4 Personal Power. (2) Small Melee [Finesse]: calls Zord in half normal time; risk: DIF 12 Performance check while possessing weapon can temporarily steal control of Zord. (3) Versatile Melee [Might or Finesse at attack]: gains ↑2 when attacking targets at least 3 sizes larger; risk: does not Morph with user and always exists physically. (4) Two-Handed Melee [Might]: inflicts energy damage instead of normal type; risk: slows all wielder movement types by 10 feet." },
		{ id: "green-survival-boon-1", name: "Survival Boon", gainedAtLevel: 2, description: "Choose one Survival Boon at 2nd level; choose an additional Survival Boon at 9th and 14th levels. Options: 360° Awareness (cannot be surprised while awake; gain ↑1 to Alertness and Initiative rolls), Enhanced Shell (+1 Morphed Toughness), Like a Shadow (Edge on Infiltration checks), Move Like a Song (first attack targeting you each round has a Snag; if it already has a Snag, it automatically misses), Savant (if you have no levels in a skill, you can attempt that check using D2; you must still buy D2 normally to increase it)." },
		{ id: "green-zord", name: "Zord", gainedAtLevel: 3, description: "When piloting your personal Zord, you cannot suffer Snags when using Driving. Gain access to your team-appropriate Zord/Borg/Power vehicle." },
		{ id: "green-general-perk-1", name: "General Perk", gainedAtLevel: 4, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "green-extra-attack", name: "Extra Attack", gainedAtLevel: 5, description: "While Morphed and fighting as an individual, attack twice instead of once when taking the Attack action." },
		{ id: "green-zord-feature-1", name: "Zord Feature", gainedAtLevel: 6, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "green-grid-power-1", name: "Grid Power", gainedAtLevel: 6, description: "Choose one qualifying Grid Power." },
		{ id: "green-sidestep", name: "Sidestep", gainedAtLevel: 7, cost: "Spend 1 Personal Power", description: "When targeted by an Area of Effect attack against your Evasion, reduce the attack result by your Acrobatics skill die roll." },
		{ id: "green-general-perk-2", name: "General Perk", gainedAtLevel: 8, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "green-survival-boon-2", name: "Survival Boon", gainedAtLevel: 9, description: "Choose a second Survival Boon option." },
		{ id: "green-zord-feature-2", name: "Zord Feature", gainedAtLevel: 10, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "green-team-player", name: "Team Player", gainedAtLevel: 10, cost: "Both Rangers spend 1 Personal Power", description: "By making contact between Morphed forms, transfer one of your current Survival Boons to a teammate until both return to normal form; transferred boons return to you on the next morph." },
		{ id: "green-grid-power-2", name: "Grid Power", gainedAtLevel: 11, description: "Choose one qualifying Grid Power." },
		{ id: "green-general-perk-3", name: "General Perk", gainedAtLevel: 12, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "green-zord-feature-3", name: "Zord Feature", gainedAtLevel: 14, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "green-survival-boon-3", name: "Survival Boon", gainedAtLevel: 14, description: "Choose a third Survival Boon option." },
		{ id: "green-general-perk-4", name: "General Perk", gainedAtLevel: 16, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "green-grid-power-3", name: "Grid Power", gainedAtLevel: 16, description: "Choose one qualifying Grid Power." },
		{ id: "green-zord-feature-4", name: "Zord Feature", gainedAtLevel: 17, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "green-at-all-costs", name: "At All Costs", gainedAtLevel: 18, usageLimit: "Once per day", description: "While Morphed, you may continue fighting after reaching 0 Health. During this state, each successful enemy hit causes loss of 1 Personal Power instead of damage. If you reach 0 Personal Power, you immediately return to normal form at 0 Health with Unconscious and Defeated conditions." },
		{ id: "green-general-perk-5", name: "General Perk", gainedAtLevel: 19, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "green-prime", name: "Green Ranger Prime", gainedAtLevel: 20, description: "While Morphed: +2 to all Defenses, +1 damage on Unique Weapon attacks, and Edge on Social skill checks." },
	  ],
	  progression: [
		{ level: 1, featureIds: ["green-its-morphin-time", "green-solo-strike", "green-unique-weapon"], personalPowerCapacity: 2, resourceLabel: "Solo Strike", resourceValue: "↑1", essenceIncreases: [{ target: "Strength", operation: "add", value: 2 }, { target: "Speed", operation: "add", value: 1 }] },
		{ level: 2, featureIds: ["green-survival-boon-1"], personalPowerCapacity: 2, resourceLabel: "Solo Strike", resourceValue: "↑1", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 3, featureIds: ["green-zord"], personalPowerCapacity: 3, resourceLabel: "Solo Strike", resourceValue: "↑1", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 4, featureIds: ["green-general-perk-1"], personalPowerCapacity: 3, resourceLabel: "Solo Strike", resourceValue: "↑1", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 5, featureIds: ["green-extra-attack"], personalPowerCapacity: 4, resourceLabel: "Solo Strike", resourceValue: "↑1", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 6, featureIds: ["green-zord-feature-1", "green-grid-power-1"], personalPowerCapacity: 4, resourceLabel: "Solo Strike", resourceValue: "↑2", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 7, featureIds: ["green-sidestep"], personalPowerCapacity: 5, resourceLabel: "Solo Strike", resourceValue: "↑2", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 8, featureIds: ["green-general-perk-2"], personalPowerCapacity: 5, resourceLabel: "Solo Strike", resourceValue: "↑2", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 9, featureIds: ["green-survival-boon-2"], personalPowerCapacity: 6, resourceLabel: "Solo Strike", resourceValue: "↑2", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 10, featureIds: ["green-zord-feature-2", "green-team-player"], personalPowerCapacity: 6, resourceLabel: "Solo Strike", resourceValue: "↑2", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 11, featureIds: ["green-grid-power-2"], personalPowerCapacity: 7, resourceLabel: "Solo Strike", resourceValue: "↑3", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 12, featureIds: ["green-general-perk-3"], personalPowerCapacity: 7, resourceLabel: "Solo Strike", resourceValue: "↑3", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 13, featureIds: [], personalPowerCapacity: 8, resourceLabel: "Solo Strike", resourceValue: "↑3", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 14, featureIds: ["green-zord-feature-3", "green-survival-boon-3"], personalPowerCapacity: 8, resourceLabel: "Solo Strike", resourceValue: "↑3", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 15, featureIds: [], personalPowerCapacity: 9, resourceLabel: "Solo Strike", resourceValue: "↑3", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 16, featureIds: ["green-general-perk-4", "green-grid-power-3"], personalPowerCapacity: 9, resourceLabel: "Solo Strike", resourceValue: "↑4", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 17, featureIds: ["green-zord-feature-4"], personalPowerCapacity: 10, resourceLabel: "Solo Strike", resourceValue: "↑4", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 18, featureIds: ["green-at-all-costs"], personalPowerCapacity: 10, resourceLabel: "Solo Strike", resourceValue: "↑4", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 19, featureIds: ["green-general-perk-5"], personalPowerCapacity: 11, resourceLabel: "Solo Strike", resourceValue: "↑4", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 20, featureIds: ["green-prime"], personalPowerCapacity: 11, resourceLabel: "Solo Strike", resourceValue: "↑4", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
	  ],
	},
  },
  {
	id: "pink",
	name: "Pink",
	spectrumId: "primary",
	description: "Pink Ranger role (example).",
	mechanicsComplete: true,
	spectrumRules: {
	  modifiers: [{ target: "Speed", operation: "add", value: 2 }, { target: "Social", operation: "add", value: 1 }],
	  capacityGrowth: "Fast",
	  notes: "Verified listed Spectrum values only; application timing/order is not encoded here.",
	},
	roleRules: {
	  verification: {
		status: "partial",
		sourceNotes: [
		  "Power Rangers Core Rulebook, Chapter 4: Pink Ranger table/features pages 47–50 (printed pages around 47–49).",
		  "Structured progression and starting entries added; detailed feature math beyond table values may need further verification."
		],
	  },
	  startingBenefits: [
		{ id: "pink-armor-training", name: "Armor Training", description: "Training: Light armor." },
		{ id: "pink-personal-power-regeneration", name: "Personal Power Regeneration", description: "Regain 4 Personal Power per day." },
		{ id: "pink-personal-power-capacity-growth", name: "Personal Power Capacity Growth", description: "Personal Power Capacity increases by +2 every 4 levels." },
	  ],
	  skillGrants: [
		{ id: "pink-finesse-rank", skillName: "Finesse", grantType: "training", notes: "Starting Skill Rank: +1 Finesse." },
		{ id: "pink-targeting-rank", skillName: "Targeting", grantType: "training", notes: "Starting Skill Rank: +1 Targeting." },
		{ id: "pink-persuasion-rank", skillName: "Persuasion", grantType: "training", notes: "Starting Skill Rank: +1 Persuasion." },
	  ],
	  startingEquipment: [
		{ id: "pink-wrist-communicator", itemName: "Wrist Communicator", quantity: 1 },
		{ id: "pink-power-morpher", itemName: "Power Morpher", quantity: 1 },
		{ id: "pink-blade-blaster", itemName: "Blade Blaster", quantity: 1, notes: "Morphed only." },
		{ id: "pink-ranged-power-weapon", itemName: "Ranged Power Weapon", quantity: 1, notes: "Morphed only." },
	  ],
	  features: [
		{ id: "pink-its-morphin-time", name: "It's Morphin Time!", gainedAtLevel: 1, actionType: "Standard action", description: "Morph using the Power Morpher. While Morphed: Toughness follows armor-training rules, jump distance maximums are tripled, a Power-based weapon can be summoned as a free action, and when reduced to 0 Health you may avoid Defeat by returning to natural form unconscious at 1 Health." },
		{ id: "pink-volley", name: "Volley", gainedAtLevel: 1, cost: "Spend 1 Personal Power", description: "If you do not move, take a special Volley attack action and make ranged attacks equal to your Volley Shots value against valid targets. Range/cover/modifiers apply to each target individually." },
		{ id: "pink-hard-target", name: "Hard Target", gainedAtLevel: 2, actionType: "As part of a Move action", duration: "Until the beginning of your next turn", description: "Roll Acrobatics to augment your Evasion score by the result." },
		{ id: "pink-fleet-of-foot-1", name: "Fleet of Foot", gainedAtLevel: 2, description: "Increase Morphed ground movement by 10 feet." },
		{ id: "pink-zord", name: "Zord", gainedAtLevel: 3, description: "When piloting your personal Zord, you cannot suffer Snags when using Driving. Gain access to your team-appropriate Zord/Borg/Power vehicle." },
		{ id: "pink-general-perk-1", name: "General Perk", gainedAtLevel: 4, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "pink-penetrating-shot", name: "Penetrating Shot", gainedAtLevel: 5, cost: "Spend an additional 1 Personal Power when using Volley", description: "Make one attack roll against one target and apply it to all Volley shots; gain a number of ↑1 shifts equal to the additional shots after the first." },
		{ id: "pink-group-strike-10", name: "Group Strike (10’ x 10’)", gainedAtLevel: 5, cost: "Spend 1 Personal Power", range: "Within ranged weapon line of sight", description: "Choose a 10 x 10 foot area and make a ranged attack roll against all targets in that area." },
		{ id: "pink-zord-feature-1", name: "Zord Feature", gainedAtLevel: 6, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "pink-grid-power-1", name: "Grid Power", gainedAtLevel: 6, description: "Choose one qualifying Grid Power." },
		{ id: "pink-extra-attack", name: "Extra Attack", gainedAtLevel: 7, description: "While Morphed and fighting as an individual, attack twice instead of once when taking the Attack action." },
		{ id: "pink-sidestep", name: "Sidestep", gainedAtLevel: 7, cost: "Spend 1 Personal Power", description: "When targeted by an Area of Effect attack against your Evasion, reduce the attack result by your Acrobatics skill die roll." },
		{ id: "pink-general-perk-2", name: "General Perk", gainedAtLevel: 8, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "pink-precision-aim-1", name: "Precision Aim (+1 Damage)", gainedAtLevel: 9, description: "If you do not move on your turn, your ranged combat attacks that hit deal +1 damage." },
		{ id: "pink-zord-feature-2", name: "Zord Feature", gainedAtLevel: 10, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "pink-group-strike-15", name: "Group Strike (15’ x 15’)", gainedAtLevel: 10, cost: "Spend 1 Personal Power", range: "Within ranged weapon line of sight", description: "As Group Strike, but area increases to 15 x 15 feet." },
		{ id: "pink-grid-power-2", name: "Grid Power", gainedAtLevel: 11, description: "Choose one qualifying Grid Power." },
		{ id: "pink-general-perk-3", name: "General Perk", gainedAtLevel: 12, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "pink-fleet-of-foot-2", name: "Fleet of Foot", gainedAtLevel: 12, description: "Increase Morphed ground movement by an additional 10 feet (total +20 feet)." },
		{ id: "pink-zord-feature-3", name: "Zord Feature", gainedAtLevel: 14, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "pink-group-strike-20", name: "Group Strike (20’ x 20’)", gainedAtLevel: 15, cost: "Spend 1 Personal Power", range: "Within ranged weapon line of sight", description: "As Group Strike, but area increases to 20 x 20 feet." },
		{ id: "pink-general-perk-4", name: "General Perk", gainedAtLevel: 16, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "pink-grid-power-3", name: "Grid Power", gainedAtLevel: 16, description: "Choose one qualifying Grid Power." },
		{ id: "pink-zord-feature-4", name: "Zord Feature", gainedAtLevel: 17, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "pink-precision-aim-2", name: "Precision Aim (+2 Damage)", gainedAtLevel: 18, description: "If you do not move on your turn, your ranged combat attacks that hit deal +2 damage." },
		{ id: "pink-general-perk-5", name: "General Perk", gainedAtLevel: 19, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "pink-prime", name: "Pink Ranger Prime", gainedAtLevel: 20, description: "While Morphed: +2 to all Defenses, +1 damage on Targeting attacks, and Edge on Speed skill checks." },
	  ],
	  progression: [
		{ level: 1, featureIds: ["pink-its-morphin-time", "pink-volley"], personalPowerCapacity: 2, resourceLabel: "Volley Shots", resourceValue: "2", essenceIncreases: [{ target: "Speed", operation: "add", value: 2 }, { target: "Social", operation: "add", value: 1 }] },
		{ level: 2, featureIds: ["pink-hard-target", "pink-fleet-of-foot-1"], personalPowerCapacity: 2, resourceLabel: "Volley Shots", resourceValue: "2", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 3, featureIds: ["pink-zord"], personalPowerCapacity: 2, resourceLabel: "Volley Shots", resourceValue: "2", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 4, featureIds: ["pink-general-perk-1"], personalPowerCapacity: 4, resourceLabel: "Volley Shots", resourceValue: "2", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 5, featureIds: ["pink-penetrating-shot", "pink-group-strike-10"], personalPowerCapacity: 4, resourceLabel: "Volley Shots", resourceValue: "3", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 6, featureIds: ["pink-zord-feature-1", "pink-grid-power-1"], personalPowerCapacity: 4, resourceLabel: "Volley Shots", resourceValue: "3", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 7, featureIds: ["pink-extra-attack", "pink-sidestep"], personalPowerCapacity: 6, resourceLabel: "Volley Shots", resourceValue: "3", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 8, featureIds: ["pink-general-perk-2"], personalPowerCapacity: 6, resourceLabel: "Volley Shots", resourceValue: "3", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 9, featureIds: ["pink-precision-aim-1"], personalPowerCapacity: 6, resourceLabel: "Volley Shots", resourceValue: "4", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 10, featureIds: ["pink-zord-feature-2", "pink-group-strike-15"], personalPowerCapacity: 8, resourceLabel: "Volley Shots", resourceValue: "4", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 11, featureIds: ["pink-grid-power-2"], personalPowerCapacity: 8, resourceLabel: "Volley Shots", resourceValue: "4", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 12, featureIds: ["pink-general-perk-3", "pink-fleet-of-foot-2"], personalPowerCapacity: 8, resourceLabel: "Volley Shots", resourceValue: "4", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 13, featureIds: [], personalPowerCapacity: 10, resourceLabel: "Volley Shots", resourceValue: "5", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 14, featureIds: ["pink-zord-feature-3"], personalPowerCapacity: 10, resourceLabel: "Volley Shots", resourceValue: "5", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 15, featureIds: ["pink-group-strike-20"], personalPowerCapacity: 10, resourceLabel: "Volley Shots", resourceValue: "5", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 16, featureIds: ["pink-general-perk-4", "pink-grid-power-3"], personalPowerCapacity: 12, resourceLabel: "Volley Shots", resourceValue: "5", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 17, featureIds: ["pink-zord-feature-4"], personalPowerCapacity: 12, resourceLabel: "Volley Shots", resourceValue: "6", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 18, featureIds: ["pink-precision-aim-2"], personalPowerCapacity: 12, resourceLabel: "Volley Shots", resourceValue: "6", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 19, featureIds: ["pink-general-perk-5"], personalPowerCapacity: 14, resourceLabel: "Volley Shots", resourceValue: "6", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 20, featureIds: ["pink-prime"], personalPowerCapacity: 14, resourceLabel: "Volley Shots", resourceValue: "6", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
	  ],
	},
  },
  {
	id: "red",
	name: "Red",
	spectrumId: "primary",
	description: "Red Ranger role (example).",
	mechanicsComplete: true,
	spectrumRules: {
	  modifiers: [{ target: "Strength", operation: "add", value: 2 }, { target: "Social", operation: "add", value: 1 }],
	  capacityGrowth: "Slow",
	  notes: "Verified listed Spectrum values only; application timing/order is not encoded here.",
	},
	roleRules: {
	  verification: {
		status: "partial",
		sourceNotes: [
		  "Power Rangers Core Rulebook, Chapter 4: Red Ranger table/features pages 51–54 (printed pages around 51–53).",
		  "Starting profile and progression columns are transcribed; deeper feature effect wording may still need additional verification."
		],
	  },
	  startingBenefits: [
		{ id: "red-armor-training", name: "Armor Training", description: "Training: Light, Medium, and Heavy armor." },
		{ id: "red-personal-power-regeneration", name: "Personal Power Regeneration", description: "Regain 2 Personal Power per day." },
		{ id: "red-personal-power-capacity-growth", name: "Personal Power Capacity Growth", description: "Personal Power Capacity increases by +2 every 5 levels." },
	  ],
	  skillGrants: [
		{ id: "red-might-rank", skillName: "Might", grantType: "training", notes: "Starting Skill Ranks: +2 Might." },
		{ id: "red-persuasion-rank", skillName: "Persuasion", grantType: "training", notes: "Starting Skill Rank: +1 Persuasion." },
	  ],
	  startingEquipment: [
		{ id: "red-wrist-communicator", itemName: "Wrist Communicator", quantity: 1 },
		{ id: "red-power-morpher", itemName: "Power Morpher", quantity: 1 },
		{ id: "red-blade-blaster", itemName: "Blade Blaster", quantity: 1, notes: "Morphed only." },
		{ id: "red-versatile-power-weapon", itemName: "Versatile Power Weapon", quantity: 1, notes: "Morphed only." },
	  ],
	  features: [
		{ id: "red-its-morphin-time", name: "It's Morphin Time!", gainedAtLevel: 1, actionType: "Standard action", description: "Morph using the Power Morpher. While Morphed: Toughness follows armor-training rules, jump distance maximums are tripled, a Power-based weapon can be summoned as a free action, and when reduced to 0 Health you may avoid Defeat by returning to natural form unconscious at 1 Health." },
		{ id: "red-power-strike", name: "Power Strike", gainedAtLevel: 1, cost: "Spend 1 Personal Power", description: "When making any melee attack while Morphed, add bonus damage on a successful hit based on the role table value." },
		{ id: "red-follow-me", name: "Follow Me!", gainedAtLevel: 2, description: "At combat start, teammates may choose to set Initiative at 1d4 lower than yours (minimum 1), choosing before you roll. Each teammate who chooses this adds +1 to your Initiative result." },
		{ id: "red-weapon-mastery", name: "Weapon Mastery", gainedAtLevel: 2, description: "When attacking with a Power weapon, re-roll Skill die results of 1 or 2; you must use the new roll." },
		{ id: "red-zord", name: "Zord", gainedAtLevel: 3, description: "When piloting your personal Zord, you cannot suffer Snags when using Driving. Gain access to your team-appropriate Zord/Borg/Power vehicle." },
		{ id: "red-general-perk-1", name: "General Perk", gainedAtLevel: 4, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "red-extra-attack-1", name: "Extra Attack", gainedAtLevel: 5, description: "While Morphed and fighting as an individual, attack twice instead of once when taking the Attack action." },
		{ id: "red-lets-bring-em-together", name: "Let's Bring 'Em Together!", gainedAtLevel: 5, actionType: "Standard action to begin", cost: "Spend 1 Personal Power (each participating teammate also spends 1)", description: "Begin a contingency team attack requiring teammates adjacent to you with matching trigger. When all are ready, make a combined ranged attack (Reach 100/250) with ↑2 to hit using your attack traits/abilities; on hit it deals 1 damage per participating member." },
		{ id: "red-zord-feature-1", name: "Zord Feature", gainedAtLevel: 6, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "red-grid-power-1", name: "Grid Power", gainedAtLevel: 6, description: "Choose one qualifying Grid Power." },
		{ id: "red-resilience", name: "Resilience", gainedAtLevel: 7, cost: "Spend 1 Personal Power", duration: "Until the start of your next turn", description: "While Morphed, when targeted by an attack you are aware of, roll your Athletics skill die and reduce incoming attacks by that amount." },
		{ id: "red-general-perk-2", name: "General Perk", gainedAtLevel: 8, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "red-team-focus-1", name: "Team Focus (↑1)", gainedAtLevel: 9, description: "Add ↑1 to melee attacks against a target that has already been attacked by your teammate since your last turn." },
		{ id: "red-zord-feature-2", name: "Zord Feature", gainedAtLevel: 10, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "red-extra-attack-2", name: "Extra Attack (2)", gainedAtLevel: 10, description: "While Morphed and fighting as an individual, attacks from the Attack action increase to three." },
		{ id: "red-grid-power-2", name: "Grid Power", gainedAtLevel: 11, description: "Choose one qualifying Grid Power." },
		{ id: "red-general-perk-3", name: "General Perk", gainedAtLevel: 12, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "red-zord-feature-3", name: "Zord Feature", gainedAtLevel: 14, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "red-extra-attack-3", name: "Extra Attack (3)", gainedAtLevel: 15, description: "While Morphed and fighting as an individual, attacks from the Attack action increase to four." },
		{ id: "red-general-perk-4", name: "General Perk", gainedAtLevel: 16, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "red-grid-power-3", name: "Grid Power", gainedAtLevel: 16, description: "Choose one qualifying Grid Power." },
		{ id: "red-zord-feature-4", name: "Zord Feature", gainedAtLevel: 17, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "red-team-focus-2", name: "Team Focus (↑2)", gainedAtLevel: 18, description: "Team Focus bonus to qualifying melee attacks increases to ↑2." },
		{ id: "red-general-perk-5", name: "General Perk", gainedAtLevel: 19, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "red-prime", name: "Red Ranger Prime", gainedAtLevel: 20, description: "While Morphed: Resistance to normal blunt and sharp damage, +1 damage on Power Weapon attacks, and Edge on Strength skill checks." },
	  ],
	  progression: [
		{ level: 1, featureIds: ["red-its-morphin-time", "red-power-strike"], personalPowerCapacity: 2, resourceLabel: "Power Strike", resourceValue: "+1 Damage", essenceIncreases: [{ target: "Strength", operation: "add", value: 2 }, { target: "Social", operation: "add", value: 1 }] },
		{ level: 2, featureIds: ["red-follow-me", "red-weapon-mastery"], personalPowerCapacity: 2, resourceLabel: "Power Strike", resourceValue: "+1 Damage", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 3, featureIds: ["red-zord"], personalPowerCapacity: 2, resourceLabel: "Power Strike", resourceValue: "+1 Damage", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 4, featureIds: ["red-general-perk-1"], personalPowerCapacity: 2, resourceLabel: "Power Strike", resourceValue: "+1 Damage", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 5, featureIds: ["red-extra-attack-1", "red-lets-bring-em-together"], personalPowerCapacity: 4, resourceLabel: "Power Strike", resourceValue: "+1 Damage", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 6, featureIds: ["red-zord-feature-1", "red-grid-power-1"], personalPowerCapacity: 4, resourceLabel: "Power Strike", resourceValue: "+2 Damage", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 7, featureIds: ["red-resilience"], personalPowerCapacity: 4, resourceLabel: "Power Strike", resourceValue: "+2 Damage", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 8, featureIds: ["red-general-perk-2"], personalPowerCapacity: 4, resourceLabel: "Power Strike", resourceValue: "+2 Damage", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 9, featureIds: ["red-team-focus-1"], personalPowerCapacity: 6, resourceLabel: "Power Strike", resourceValue: "+2 Damage", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 10, featureIds: ["red-zord-feature-2", "red-extra-attack-2"], personalPowerCapacity: 6, resourceLabel: "Power Strike", resourceValue: "+2 Damage", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 11, featureIds: ["red-grid-power-2"], personalPowerCapacity: 6, resourceLabel: "Power Strike", resourceValue: "+3 Damage", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 12, featureIds: ["red-general-perk-3"], personalPowerCapacity: 6, resourceLabel: "Power Strike", resourceValue: "+3 Damage", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 13, featureIds: [], personalPowerCapacity: 8, resourceLabel: "Power Strike", resourceValue: "+3 Damage", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }], notes: "No listed Role Perk at this level." },
		{ level: 14, featureIds: ["red-zord-feature-3"], personalPowerCapacity: 8, resourceLabel: "Power Strike", resourceValue: "+3 Damage", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 15, featureIds: ["red-extra-attack-3"], personalPowerCapacity: 8, resourceLabel: "Power Strike", resourceValue: "+3 Damage", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 16, featureIds: ["red-general-perk-4", "red-grid-power-3"], personalPowerCapacity: 8, resourceLabel: "Power Strike", resourceValue: "+4 Damage", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 17, featureIds: ["red-zord-feature-4"], personalPowerCapacity: 10, resourceLabel: "Power Strike", resourceValue: "+4 Damage", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 18, featureIds: ["red-team-focus-2"], personalPowerCapacity: 10, resourceLabel: "Power Strike", resourceValue: "+4 Damage", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 19, featureIds: ["red-general-perk-5"], personalPowerCapacity: 10, resourceLabel: "Power Strike", resourceValue: "+4 Damage", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 20, featureIds: ["red-prime"], personalPowerCapacity: 10, resourceLabel: "Power Strike", resourceValue: "+4 Damage", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
	  ],
	},
  },
  {
	id: "yellow",
	name: "Yellow",
	spectrumId: "primary",
	description: "Yellow Ranger role (example).",
	mechanicsComplete: true,
	spectrumRules: {
	  modifiers: [{ target: "Speed", operation: "add", value: 2 }, { target: "Smarts", operation: "add", value: 1 }],
	  capacityGrowth: "Moderate",
	  notes: "Verified listed Spectrum values only; application timing/order is not encoded here.",
	},
	roleRules: {
	  verification: {
		status: "partial",
		sourceNotes: [
		  "Power Rangers Core Rulebook, Chapter 4: Yellow Ranger table/features pages 55–58 (printed pages around 55–57).",
		  "Table and starting entries are transcribed; expanded narrative mechanics can be refined after deeper per-feature verification."
		],
	  },
	  startingBenefits: [
		{ id: "yellow-armor-training", name: "Armor Training", description: "Training: Light armor." },
		{ id: "yellow-personal-power-regeneration", name: "Personal Power Regeneration", description: "Regain 3 Personal Power per day." },
		{ id: "yellow-personal-power-capacity-growth", name: "Personal Power Capacity Growth", description: "Personal Power Capacity increases by +1 every 3 levels." },
	  ],
	  skillGrants: [
		{ id: "yellow-acrobatics-or-initiative-rank", skillName: "Acrobatics or Initiative", grantType: "training", notes: "Starting Skill Ranks: +1 Acrobatics or +1 Initiative." },
		{ id: "yellow-finesse-rank", skillName: "Finesse", grantType: "training", notes: "Starting Skill Rank: +1 Finesse." },
		{ id: "yellow-alertness-rank", skillName: "Alertness", grantType: "training", notes: "Starting Skill Rank: +1 Alertness." },
	  ],
	  startingEquipment: [
		{ id: "yellow-wrist-communicator", itemName: "Wrist Communicator", quantity: 1 },
		{ id: "yellow-power-morpher", itemName: "Power Morpher", quantity: 1 },
		{ id: "yellow-blade-blaster", itemName: "Blade Blaster", quantity: 1, notes: "Morphed only." },
		{ id: "yellow-two-light-power-weapons", itemName: "Two Light Power Weapons", quantity: 1, notes: "Morphed only." },
	  ],
	  features: [
		{ id: "yellow-its-morphin-time", name: "It's Morphin Time!", gainedAtLevel: 1, actionType: "Standard action", description: "Morph using the Power Morpher. While Morphed: Toughness follows armor-training rules, jump distance maximums are tripled, a Power-based weapon can be summoned as a free action, and when reduced to 0 Health you may avoid Defeat by returning to natural form unconscious at 1 Health." },
		{ id: "yellow-triple-strike-attacks", name: "Triple Strike Attacks", gainedAtLevel: 1, cost: "Spend 1 Personal Power", description: "When making a Finesse attack action, make an attack with each hand at no penalty, then make a third Follow-Up martial arts attack against a target from one of the previous strikes. The Follow-Up attack uses the role table Follow-Up die." },
		{ id: "yellow-nimble-fighter", name: "Nimble Fighter", gainedAtLevel: 2, description: "After each successful melee attack, immediately move 5 feet in any viable direction as free additional movement." },
		{ id: "yellow-strike-bonus-1", name: "Strike Bonus (↑1)", gainedAtLevel: 2, cost: "Spend 1 Personal Power at the beginning of the round", description: "Apply a ↑1 shift to the first melee attack you make during your action." },
		{ id: "yellow-zord", name: "Zord", gainedAtLevel: 3, description: "When piloting your personal Zord, you cannot suffer Snags when using Driving. Gain access to your team-appropriate Zord/Borg/Power vehicle." },
		{ id: "yellow-general-perk-1", name: "General Perk", gainedAtLevel: 4, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "yellow-extra-attack-1", name: "Extra Attack", gainedAtLevel: 5, description: "While Morphed and fighting as an individual, attack twice instead of once when taking the Attack action. These added attacks are not split by Triple Strike Attacks." },
		{ id: "yellow-strike-bonus-2", name: "Strike Bonus (↑2)", gainedAtLevel: 5, cost: "Spend 1 Personal Power at the beginning of the round", description: "Strike Bonus on your first melee attack increases to ↑2." },
		{ id: "yellow-zord-feature-1", name: "Zord Feature", gainedAtLevel: 6, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "yellow-grid-power-1", name: "Grid Power", gainedAtLevel: 6, description: "Choose one qualifying Grid Power." },
		{ id: "yellow-exploit-weakness-1", name: "Exploit Weakness I", gainedAtLevel: 7, description: "After a melee attack against a target with augmented defenses, attempt a DIF 14 Alertness check. On success, you and teammates ignore one of the target's defense bonuses until end of scene." },
		{ id: "yellow-general-perk-2", name: "General Perk", gainedAtLevel: 8, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "yellow-strike-bonus-3", name: "Strike Bonus (↑3)", gainedAtLevel: 8, cost: "Spend 1 Personal Power at the beginning of the round", description: "Strike Bonus on your first melee attack increases to ↑3." },
		{ id: "yellow-whirlwind-strike", name: "Whirlwind Strike", gainedAtLevel: 9, cost: "Spend 1 Personal Power while Morphed", duration: "Until end of round", description: "Your attack action melee attacks can target every adjacent enemy. Rolls are made singly and applied equally to all adjacent enemies, similar to an Area of Effect ranged attack." },
		{ id: "yellow-zord-feature-2", name: "Zord Feature", gainedAtLevel: 10, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "yellow-grid-power-2", name: "Grid Power", gainedAtLevel: 11, description: "Choose one qualifying Grid Power." },
		{ id: "yellow-strike-bonus-4", name: "Strike Bonus (↑4)", gainedAtLevel: 11, cost: "Spend 1 Personal Power at the beginning of the round", description: "Strike Bonus on your first melee attack increases to ↑4." },
		{ id: "yellow-general-perk-3", name: "General Perk", gainedAtLevel: 12, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "yellow-lightning-fast", name: "Lightning Fast", gainedAtLevel: 13, cost: "Spend 1 Personal Power while Morphed", range: "Anywhere within 60 feet and line of sight", description: "Instead of moving normally, instantly appear at a chosen point within range (treated like miniature teleportation)." },
		{ id: "yellow-zord-feature-3", name: "Zord Feature", gainedAtLevel: 14, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "yellow-extra-attack-2", name: "Extra Attack (2)", gainedAtLevel: 15, description: "While Morphed and fighting as an individual, attacks from the Attack action increase to three. Extra attacks are not split by Triple Strike Attacks." },
		{ id: "yellow-exploit-weakness-2", name: "Exploit Weakness II", gainedAtLevel: 15, description: "Exploit Weakness now lets you and teammates ignore all defense augmentative bonuses the target possesses for the scene on a successful DIF 14 Alertness check." },
		{ id: "yellow-general-perk-4", name: "General Perk", gainedAtLevel: 16, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "yellow-grid-power-3", name: "Grid Power", gainedAtLevel: 16, description: "Choose one qualifying Grid Power." },
		{ id: "yellow-zord-feature-4", name: "Zord Feature", gainedAtLevel: 17, description: "Choose one qualifying Zord Feature for your personal Zord." },
		{ id: "yellow-devastating-strike", name: "Devastating Strike (x3)", gainedAtLevel: 18, description: "Your melee critical hits inflict triple damage instead of the normal double damage." },
		{ id: "yellow-general-perk-5", name: "General Perk", gainedAtLevel: 19, description: "Choose one generic Perk for which prerequisites are met." },
		{ id: "yellow-prime", name: "Yellow Ranger Prime", gainedAtLevel: 20, description: "While Morphed: Resistance to normal blunt and sharp damage, +1 damage on Finesse attacks, and Edge on Speed skill checks." },
	  ],
	  progression: [
		{ level: 1, featureIds: ["yellow-its-morphin-time", "yellow-triple-strike-attacks"], personalPowerCapacity: 2, resourceLabel: "Follow-up Die", resourceValue: "1d2", essenceIncreases: [{ target: "Speed", operation: "add", value: 2 }, { target: "Smarts", operation: "add", value: 1 }] },
		{ level: 2, featureIds: ["yellow-nimble-fighter", "yellow-strike-bonus-1"], personalPowerCapacity: 2, resourceLabel: "Follow-up Die", resourceValue: "1d2", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 3, featureIds: ["yellow-zord"], personalPowerCapacity: 3, resourceLabel: "Follow-up Die", resourceValue: "1d2", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 4, featureIds: ["yellow-general-perk-1"], personalPowerCapacity: 3, resourceLabel: "Follow-up Die", resourceValue: "1d2", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 5, featureIds: ["yellow-extra-attack-1", "yellow-strike-bonus-2"], personalPowerCapacity: 4, resourceLabel: "Follow-up Die", resourceValue: "1d4", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 6, featureIds: ["yellow-zord-feature-1", "yellow-grid-power-1"], personalPowerCapacity: 4, resourceLabel: "Follow-up Die", resourceValue: "1d4", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 7, featureIds: ["yellow-exploit-weakness-1"], personalPowerCapacity: 5, resourceLabel: "Follow-up Die", resourceValue: "1d4", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 8, featureIds: ["yellow-general-perk-2", "yellow-strike-bonus-3"], personalPowerCapacity: 5, resourceLabel: "Follow-up Die", resourceValue: "1d4", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 9, featureIds: ["yellow-whirlwind-strike"], personalPowerCapacity: 6, resourceLabel: "Follow-up Die", resourceValue: "1d6", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 10, featureIds: ["yellow-zord-feature-2"], personalPowerCapacity: 6, resourceLabel: "Follow-up Die", resourceValue: "1d6", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 11, featureIds: ["yellow-grid-power-2", "yellow-strike-bonus-4"], personalPowerCapacity: 7, resourceLabel: "Follow-up Die", resourceValue: "1d6", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 12, featureIds: ["yellow-general-perk-3"], personalPowerCapacity: 7, resourceLabel: "Follow-up Die", resourceValue: "1d6", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 13, featureIds: ["yellow-lightning-fast"], personalPowerCapacity: 8, resourceLabel: "Follow-up Die", resourceValue: "1d8", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 14, featureIds: ["yellow-zord-feature-3"], personalPowerCapacity: 8, resourceLabel: "Follow-up Die", resourceValue: "1d8", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 15, featureIds: ["yellow-extra-attack-2", "yellow-exploit-weakness-2"], personalPowerCapacity: 9, resourceLabel: "Follow-up Die", resourceValue: "1d8", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 16, featureIds: ["yellow-general-perk-4", "yellow-grid-power-3"], personalPowerCapacity: 9, resourceLabel: "Follow-up Die", resourceValue: "1d8", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 17, featureIds: ["yellow-zord-feature-4"], personalPowerCapacity: 10, resourceLabel: "Follow-up Die", resourceValue: "1d10", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 18, featureIds: ["yellow-devastating-strike"], personalPowerCapacity: 10, resourceLabel: "Follow-up Die", resourceValue: "1d10", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 19, featureIds: ["yellow-general-perk-5"], personalPowerCapacity: 11, resourceLabel: "Follow-up Die", resourceValue: "1d10", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 20, featureIds: ["yellow-prime"], personalPowerCapacity: 11, resourceLabel: "Follow-up Die", resourceValue: "1d10", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
	  ],
	},
  },
	{
	id: "white",
	name: "White",
	spectrumId: "advanced",
	description: "White Ranger (advanced). Requires Spectrum Shift to access.",
	mechanicsComplete: false,
	notes: "Verified from Chapter 4 printed pages 58–60: White is an Advanced Spectrum role accessed via Spectrum Shift. Full writeups for all White-specific Role Perk mechanics are not fully represented in current project extracts.",
	spectrumRules: {
	  modifiers: [{ target: "Strength", operation: "add", value: 2 }, { target: "Smarts", operation: "add", value: 1 }],
	  capacityGrowth: "Moderate",
	  notes: "Advanced Spectrum table (printed page 58): White has +2 Strength, +1 Smarts, and Moderate Power Capacity Growth.",
	},
	roleRules: {
	  verification: {
		status: "partial",
		sourceNotes: [
		  "Power Rangers Core Rulebook, Chapter 4 printed pages 58–60 (Advanced Spectrum + White Ranger table).",
		  "Verified here: access prerequisite path (Spectrum Shift), starting profile, and level progression table entries (Table 4-9).",
		  "Outstanding: complete mechanical text details for all White-specific features beyond what is shown in the extracted table/page text."
		],
	  },
	  startingBenefits: [
		{ id: "white-personal-power-regeneration", name: "Personal Power Regeneration", description: "Regain 3 Personal Power per day." },
		{ id: "white-personal-power-capacity-growth", name: "Personal Power Capacity Growth", description: "Personal Power Capacity increases by +1 every 3 levels." },
		{ id: "white-advanced-access", name: "Advanced Spectrum Access", description: "White is an Advanced Spectrum role selected via the Spectrum Shift Perk." },
	  ],
	  skillGrants: [
		{ id: "white-might-rank", skillName: "Might", grantType: "training", notes: "Starting Skill Ranks: +2 Might." },
		{ id: "white-culture-rank", skillName: "Culture", grantType: "training", notes: "Starting Skill Rank: +1 Culture." },
	  ],
	  startingEquipment: [
		{ id: "white-wrist-communicator", itemName: "Wrist Communicator", quantity: 1 },
		{ id: "white-power-morpher", itemName: "Power Morpher", quantity: 1 },
		{ id: "white-blade-blaster", itemName: "Blade Blaster", quantity: 1, notes: "Morphed only." },
	  ],
	  features: [
		{ id: "white-its-morphin-time", name: "It's Morphin Time!", gainedAtLevel: 1, description: "Listed in White progression table." },
		{ id: "white-zord", name: "Zord", gainedAtLevel: 1, description: "Listed in White progression table." },
		{ id: "white-grid-relic-weapon", name: "Grid Relic Weapon", gainedAtLevel: 1, description: "Listed in White progression table." },
		{ id: "white-follow-me", name: "Follow Me!", gainedAtLevel: 2, description: "Listed in White progression table." },
		{ id: "white-zord-feature-1", name: "Zord Feature", gainedAtLevel: 3, description: "Listed in White progression table." },
		{ id: "white-general-perk-1", name: "General Perk", gainedAtLevel: 4, description: "Listed in White progression table." },
		{ id: "white-extra-attack-1", name: "Extra Attack", gainedAtLevel: 5, description: "Listed in White progression table." },
		{ id: "white-inspiration-1d4", name: "Inspiration (1d4)", gainedAtLevel: 5, description: "Listed in White progression table." },
		{ id: "white-grid-power-1", name: "Grid Power", gainedAtLevel: 6, description: "Listed in White progression table." },
		{ id: "white-zord-feature-2", name: "Zord Feature", gainedAtLevel: 6, description: "Listed in White progression table." },
		{ id: "white-relic-weapon-trait-1", name: "Relic Weapon Trait", gainedAtLevel: 7, description: "Listed in White progression table." },
		{ id: "white-general-perk-2", name: "General Perk", gainedAtLevel: 8, description: "Listed in White progression table." },
		{ id: "white-shining-leader", name: "Shining Leader", gainedAtLevel: 8, description: "Listed in White progression table." },
		{ id: "white-sidestep", name: "Sidestep", gainedAtLevel: 9, description: "Listed in White progression table." },
		{ id: "white-zord-feature-3", name: "Zord Feature", gainedAtLevel: 10, description: "Listed in White progression table." },
		{ id: "white-inspiration-1d6", name: "Inspiration (1d6)", gainedAtLevel: 10, description: "Listed in White progression table." },
		{ id: "white-grid-power-2", name: "Grid Power", gainedAtLevel: 11, description: "Listed in White progression table." },
		{ id: "white-general-perk-3", name: "General Perk", gainedAtLevel: 12, description: "Listed in White progression table." },
		{ id: "white-relic-weapon-trait-2", name: "Relic Weapon Trait", gainedAtLevel: 12, description: "Listed in White progression table." },
		{ id: "white-extra-attack-2", name: "Extra Attack (2)", gainedAtLevel: 13, description: "Listed in White progression table." },
		{ id: "white-zord-feature-4", name: "Zord Feature", gainedAtLevel: 14, description: "Listed in White progression table." },
		{ id: "white-inspiration-1d8", name: "Inspiration (1d8)", gainedAtLevel: 15, description: "Listed in White progression table." },
		{ id: "white-general-perk-4", name: "General Perk", gainedAtLevel: 16, description: "Listed in White progression table." },
		{ id: "white-grid-power-3", name: "Grid Power", gainedAtLevel: 16, description: "Listed in White progression table." },
		{ id: "white-zord-feature-5", name: "Zord Feature", gainedAtLevel: 17, description: "Listed in White progression table." },
		{ id: "white-relic-weapon-trait-3", name: "Relic Weapon Trait", gainedAtLevel: 17, description: "Listed in White progression table." },
		{ id: "white-at-all-costs", name: "At All Costs", gainedAtLevel: 18, description: "Listed in White progression table." },
		{ id: "white-general-perk-5", name: "General Perk", gainedAtLevel: 19, description: "Listed in White progression table." },
		{ id: "white-prime", name: "White Ranger Prime", gainedAtLevel: 20, description: "Listed in White progression table." },
	  ],
	  progression: [
		{ level: 1, featureIds: ["white-its-morphin-time", "white-zord", "white-grid-relic-weapon"], personalPowerCapacity: 2, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d2", essenceIncreases: [{ target: "Strength", operation: "add", value: 2 }, { target: "Smarts", operation: "add", value: 1 }] },
		{ level: 2, featureIds: ["white-follow-me"], personalPowerCapacity: 2, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d2", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 3, featureIds: ["white-zord-feature-1"], personalPowerCapacity: 3, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d2", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 4, featureIds: ["white-general-perk-1"], personalPowerCapacity: 3, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d4", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 5, featureIds: ["white-extra-attack-1", "white-inspiration-1d4"], personalPowerCapacity: 4, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d4", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 6, featureIds: ["white-grid-power-1", "white-zord-feature-2"], personalPowerCapacity: 4, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d4", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 7, featureIds: ["white-relic-weapon-trait-1"], personalPowerCapacity: 5, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d6", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 8, featureIds: ["white-general-perk-2", "white-shining-leader"], personalPowerCapacity: 5, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d6", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 9, featureIds: ["white-sidestep"], personalPowerCapacity: 6, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d6", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 10, featureIds: ["white-zord-feature-3", "white-inspiration-1d6"], personalPowerCapacity: 6, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d8", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 11, featureIds: ["white-grid-power-2"], personalPowerCapacity: 7, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d8", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 12, featureIds: ["white-general-perk-3", "white-relic-weapon-trait-2"], personalPowerCapacity: 7, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d8", essenceIncreases: [{ target: "Speed", operation: "add", value: 1 }] },
		{ level: 13, featureIds: ["white-extra-attack-2"], personalPowerCapacity: 8, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d10", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 14, featureIds: ["white-zord-feature-4"], personalPowerCapacity: 8, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d10", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 15, featureIds: ["white-inspiration-1d8"], personalPowerCapacity: 9, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d10", essenceIncreases: [{ target: "Social", operation: "add", value: 1 }] },
		{ level: 16, featureIds: ["white-general-perk-4", "white-grid-power-3"], personalPowerCapacity: 9, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d12", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 17, featureIds: ["white-zord-feature-5", "white-relic-weapon-trait-3"], personalPowerCapacity: 10, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d12", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 18, featureIds: ["white-at-all-costs"], personalPowerCapacity: 10, resourceLabel: "Grid Relic Skill Die", resourceValue: "1d12", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
		{ level: 19, featureIds: ["white-general-perk-5"], personalPowerCapacity: 11, resourceLabel: "Grid Relic Skill Die", resourceValue: "2d8", essenceIncreases: [{ target: "Smarts", operation: "add", value: 1 }] },
		{ level: 20, featureIds: ["white-prime"], personalPowerCapacity: 11, resourceLabel: "Grid Relic Skill Die", resourceValue: "2d8", essenceIncreases: [{ target: "Strength", operation: "add", value: 1 }] },
	  ],
	},
  },
];

export default { SPECTRA, ROLES };
