// Origins data for Essence20 (developer-provided, mechanically partial)
export type Origin = {
  id: string; // stable id
  name: string; // display name
  description?: string; // optional developer-written blurb
  // Known mechanical details (only include verified values)
  startingHealth?: number;
	statMods?: Record<string, number>; // legacy fixed-mod representation (unused when choice-based)
  essenceIncreaseOptions?: string[];
  bonusSkillOptions?: string[];
  groundMovement?: number;
  languagesRule?: string;
  originBenefitName?: string;
  originBenefitSummary?: string;
  // Freeform notes about additional benefits without inventing specifics
  notes?: string;
  // Whether the origin's mechanical data is complete (true) or incomplete/placeholder (false)
  mechanicsComplete: boolean;
};

export const ORIGINS: Origin[] = [
  {
	id: "athletic",
	name: "Athletic",
	description: "Physically disciplined and naturally strong or fast.",
	startingHealth: 2,
	essenceIncreaseOptions: ["Strength", "Speed"],
	bonusSkillOptions: ["Athletics", "Brawn", "Might", "Acrobatics", "Finesse", "Initiative"],
	groundMovement: 40,
	languagesRule: "Native language plus one additional language per 3 Social.",
	originBenefitName: "Always Training",
	originBenefitSummary: "When making an untrained Strength- or Speed-based skill check, roll a d2 skill die and do not suffer the untrained Snag.",
	mechanicsComplete: true,
  },
  {
	id: "brainy",
	name: "Brainy",
	description: "Academic and technical focus with broad recall.",
	startingHealth: 1,
	essenceIncreaseOptions: ["Speed", "Smarts"],
	bonusSkillOptions: ["Driving", "Infiltration", "Alertness", "Culture", "Technology", "Science"],
	groundMovement: 25,
	languagesRule: "Native language plus one additional language per 1 Smarts.",
	originBenefitName: "I remember reading about...",
	originBenefitSummary: "When the team is stumped, spend 1 Story Point to gain a clue from the GM.",
	mechanicsComplete: true,
  },
  {
	id: "comedic",
	name: "Comedic",
	description: "Uses humor and social agility to navigate danger.",
	startingHealth: 1,
	essenceIncreaseOptions: ["Smarts", "Social"],
	bonusSkillOptions: ["Alertness", "Culture", "Deception", "Performance", "Persuasion"],
	groundMovement: 30,
	languagesRule: "Native language plus one additional language per 3 Social.",
	originBenefitName: "Keep 'Em Laughing",
	originBenefitSummary: "When your antics make teammates or opponents laugh, add 1 Story Point to the pool.",
	mechanicsComplete: true,
  },
  {
	id: "curious",
	name: "Curious",
	description: "Investigative and nosy, with strong secret-finding instincts.",
	startingHealth: 1,
	essenceIncreaseOptions: ["Smarts", "Social"],
	bonusSkillOptions: ["Alertness", "Culture", "Technology", "Deception", "Persuasion", "Streetwise"],
	groundMovement: 35,
	languagesRule: "Native language plus one additional language per 2 Smarts.",
	originBenefitName: "Secret Knowledge",
	originBenefitSummary: "Choose one General Perk for which you meet prerequisites.",
	mechanicsComplete: true,
  },
  {
	id: "cynical",
	name: "Cynical",
	description: "Emotionally hardened, skeptical, and difficult to rattle.",
	startingHealth: 2,
	essenceIncreaseOptions: ["Speed", "Social"],
	bonusSkillOptions: ["Acrobatics", "Initiative", "Animal Handling", "Deception", "Streetwise"],
	groundMovement: 30,
	languagesRule: "Native language plus one additional language per 3 Smarts.",
	originBenefitName: "Oh, What Now?",
	originBenefitSummary: "Effects targeting you emotionally suffer Snag; you gain Edge when rolling to overcome emotional distress.",
	mechanicsComplete: true,
  },
  {
	id: "kind",
	name: "Kind",
	description: "Compassionate helper with broad social goodwill.",
	startingHealth: 1,
	essenceIncreaseOptions: ["Smarts", "Social"],
	bonusSkillOptions: ["Alertness", "Culture", "Science", "Technology", "Animal Handling", "Performance", "Persuasion"],
	groundMovement: 30,
	languagesRule: "Native language plus one additional language per 3 Social.",
	originBenefitName: "I Know A Guy",
	originBenefitSummary: "Once per day, attempt a DIF 12 Persuasion test to call in a friendly contact for help, information, or a missing skill.",
	mechanicsComplete: true,
  },
  {
	id: "oddball",
	name: "Oddball",
	description: "Eccentric and unconventional with unusual skill breadth.",
	startingHealth: 2,
	essenceIncreaseOptions: ["Any"],
	bonusSkillOptions: ["Intimidation", "Might", "Alertness", "Culture", "Survival", "Infiltration", "Animal Handling", "Deception", "Performance", "Streetwise"],
	groundMovement: 30,
	languagesRule: "Native language plus one additional language per 3 Smarts.",
	originBenefitName: "Nobody Like Me",
	originBenefitSummary: "Choose any Perk for which you meet prerequisites.",
	mechanicsComplete: true,
  },
  {
	id: "popular",
	name: "Popular",
	description: "Well-known social figure with celebrity leverage.",
	startingHealth: 1,
	essenceIncreaseOptions: ["Strength", "Social"],
	bonusSkillOptions: ["Athletics", "Intimidation", "Performance", "Persuasion", "Streetwise"],
	groundMovement: 30,
	languagesRule: "Native language plus one additional language per 3 Social.",
	originBenefitName: "Are You Who I Think You Are?",
	originBenefitSummary: "When recognized as a local social celebrity, treat yourself as having an applicable Specialization in Deception, Persuasion, or Streetwise.",
	mechanicsComplete: true,
  },
  {
	id: "rebellious",
	name: "Rebellious",
	description: "Defiant nonconformist who learns outside normal systems.",
	startingHealth: 2,
	essenceIncreaseOptions: ["Strength", "Speed"],
	bonusSkillOptions: ["Brawn", "Intimidation", "Might", "Driving", "Infiltration", "Initiative"],
	groundMovement: 30,
	languagesRule: "Native language plus one additional language per 4 Smarts.",
	originBenefitName: "You Can't Tell Me What To Learn!",
	originBenefitSummary: "Choose any Perk for which you meet prerequisites.",
	mechanicsComplete: true,
  },
  {
	id: "tragic",
	name: "Tragic",
	description: "Marked by hardship and resilience under pressure.",
	startingHealth: 2,
	essenceIncreaseOptions: ["Any"],
	bonusSkillOptions: ["Athletics", "Brawn", "Alertness", "Culture", "Survival", "Driving", "Infiltration", "Deception", "Streetwise"],
	groundMovement: 30,
	languagesRule: "Native language plus one additional language per 2 Social.",
	originBenefitName: "Capable of Anything",
	originBenefitSummary: "Once per scene, you may reroll any die result of 1 and must accept the new result.",
	mechanicsComplete: true,
  },
];

export default ORIGINS;
