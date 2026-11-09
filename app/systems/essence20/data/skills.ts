// Essence20 skill list (developer-provided, mechanically partial)
// Only include verified entries; do not invent full official lists.

export type SkillItem = {
  id: string;
  name: string;
  /** Associated Essence score when verified ("Strength", "Speed", "Smarts", "Social") */
  associated?: string;
	/** Suggested/verified specializations from source text */
  specializations?: string[];
  /** Explicitly false for skills that do not allow specializations */
  allowsSpecializations?: boolean;
  /** Explicitly set only where source verifies a fixed max level */
  maxSkillLevels?: number;
  mechanicsComplete: boolean;
  notes?: string;
};

export const SKILLS: SkillItem[] = [
  {
	id: "athletics",
	name: "Athletics",
	associated: "Strength",
	specializations: ["Climbing", "Jogging/Running", "Sports Activity", "Swimming", "Throwing"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "brawn",
	name: "Brawn",
	associated: "Strength",
	specializations: ["Drag", "Lift", "Stamina"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Brawn also governs carrying capacity and interacts with some equipment requirements; full formulas/tables are not encoded in this data file.",
  },
  {
	id: "conditioning",
	name: "Conditioning",
	associated: "Strength",
	allowsSpecializations: false,
	maxSkillLevels: 6,
	mechanicsComplete: true,
	notes: "No specializations. Each skill level adds Health per source rules.",
  },
  {
	id: "intimidation",
	name: "Intimidation",
	associated: "Strength",
	specializations: ["Distract", "Frighten", "Taunt"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "might",
	name: "Might",
	associated: "Strength",
	specializations: ["Blunt Weapons", "Grappling", "Martial Arts", "Power Weapons", "Pushing"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "acrobatics",
	name: "Acrobatics",
	associated: "Speed",
	specializations: ["Balance", "Flying", "Gymnastics", "Maneuverability"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "driving",
	name: "Driving",
	associated: "Speed",
	specializations: ["Autopilot", "Boat", "Hovercraft", "Motorcycle", "Rotor", "Submersible", "Tracked", "Wheeled", "Winged", "Zord"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "finesse",
	name: "Finesse",
	associated: "Speed",
	specializations: ["Escape Artist", "Martial Arts", "Power Weapon", "Sharp Weaponry", "Steady Action", "Throwing"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "infiltration",
	name: "Infiltration",
	associated: "Speed",
	specializations: ["Burglary", "Sleight of Hand", "Shadowing", "Stealth"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "initiative",
	name: "Initiative",
	associated: "Speed",
	allowsSpecializations: false,
	maxSkillLevels: 6,
	mechanicsComplete: true,
	notes: "No specializations.",
  },
  {
	id: "targeting",
	name: "Targeting",
	associated: "Speed",
	specializations: ["Archery", "Ballistic", "Energy", "Power Weapon", "Specific Weapon", "Throwing", "Trajectory", "Vehicle"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "alertness",
	name: "Alertness",
	associated: "Smarts",
	specializations: ["Insight", "Investigation", "Perception"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "culture",
	name: "Culture",
	associated: "Smarts",
	specializations: ["Grid Lore", "History", "Language", "Psychology", "Specific Culture"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "science",
	name: "Science",
	associated: "Smarts",
	specializations: ["Medicine", "Specific Subject"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "survival",
	name: "Survival",
	associated: "Smarts",
	specializations: ["Cartography", "Foraging", "Hunting", "Specific Environment", "Weather Prediction"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "technology",
	name: "Technology",
	associated: "Smarts",
	specializations: ["Computer", "Grid Tech", "Engineering", "Specific Technology"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "animal-handling",
	name: "Animal Handling",
	associated: "Social",
	specializations: ["Calming", "Riding", "Animal Type", "Training"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "deception",
	name: "Deception",
	associated: "Social",
	specializations: ["Bluffing", "Disguise", "Distraction"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "performance",
	name: "Performance",
	associated: "Social",
	specializations: ["Visual Arts", "Literary Arts", "Performing Arts", "Culinary Arts"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "persuasion",
	name: "Persuasion",
	associated: "Social",
	specializations: ["Diplomacy", "Embellishments", "Flattery", "Romance", "Truth"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
  {
	id: "streetwise",
	name: "Streetwise",
	associated: "Social",
	specializations: ["Black Market", "Crime", "Gossip", "Transportation"],
	allowsSpecializations: true,
	mechanicsComplete: true,
	notes: "Listed specializations are the rulebook sample set.",
  },
];

export default { SKILLS };
