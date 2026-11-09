// Perks and Hang-Ups data for Essence20 (developer-provided, mechanically partial)
export type OptionItem = {
  id: string;
  name: string;
  description?: string;
  mechanicsComplete: boolean; // whether mechanical details are verified
  notes?: string;
};

// Currently no verified Perks or Hang-Ups are present in the project data.
// We export empty arrays so the UI can render gracefully until authoritative
// options are added. Do NOT invent game mechanics here.
export const PERKS: OptionItem[] = [
  {
	id: "acute-sense",
	name: "Acute (Sense)",
	description: "Choose one sense. Gain Edge on Alertness checks when that sense applies, gain a shift benefit on related non-Alertness checks, and this perk can be taken up to five times (once per sense).",
	mechanicsComplete: true,
  },
  {
	id: "always-alert",
	name: "Always Alert",
	description: "Gain Edge on Initiative rolls and cannot be surprised while conscious.",
	mechanicsComplete: true,
  },
  {
	id: "athletes-grace",
	name: "Athlete’s Grace",
	description: "Improve movement handling: faster ground speed on hard surfaces, stand from prone with less movement, and climb without halving movement.",
	mechanicsComplete: true,
  },
  {
	id: "adolescent-attitude",
	name: "Adolescent Attitude",
	description: "Reroll 1s on Social skill dice; once per scene, attempt one untrained skill as if you had d2 in it.",
	mechanicsComplete: true,
  },
  {
	id: "bowl-over",
	name: "Bowl-Over",
	description: "When you Sprint, you can use a Free action to Push an adjacent creature during the movement; successful Push targets are also knocked Prone when possible.",
	mechanicsComplete: true,
  },
  {
	id: "defender",
	name: "Defender",
	description: "Prerequisite: Speed 3+. While wielding a Finesse weapon you are specialized with, you can react when an adjacent ally is hit by melee and reduce the attacker’s result by your rolled skill dice.",
	mechanicsComplete: true,
  },
  {
	id: "dig-deep",
	name: "Dig Deep",
	description: "Gain two scene-limited resilience options: once per scene, ignore 1 Damage by taking an automatic Snag on all Skill Tests until the end of your next turn; and once per scene, heal 1d2 Health by forfeiting your entire turn.",
	mechanicsComplete: true,
  },
  {
	id: "dodgy",
	name: "Dodgy",
	description: "Prerequisite: Speed 3+. Gain +2 Evasion. On turns where you move no more than 5 feet, you may Defend as a Free action.",
	mechanicsComplete: true,
  },
  {
	id: "educated",
	name: "Educated",
	description: "Prerequisite: Smarts 3+. Gain fluency in one language, add one Story Point to the team pool each session, and once per day treat yourself as specialized in a Smarts skill.",
	mechanicsComplete: true,
  },
  {
	id: "emt-crash-course",
	name: "EMT Crash Course",
	description: "With a medical kit: once per scene, spend an action to heal 1 Damage on yourself or an ally; restore an Essence point to an ally; and gain Edge on Science: Medicine checks to learn clues from deceased persons.",
	mechanicsComplete: true,
  },
  {
	id: "expertise",
	name: "Expertise",
	description: "Prerequisite: choose a skill at d4+. For that skill, ignore the first downshift and reroll 1s on skill dice.",
	mechanicsComplete: true,
  },
  {
	id: "extra-grid-power",
	name: "Extra Grid Power",
	description: "Increase your maximum Personal Power by 1 and gain one Grid Power you qualify for.",
	mechanicsComplete: true,
  },
  {
	id: "fast",
	name: "Fast",
	description: "Gain a +2 bonus to Initiative tests and increase one movement type you already have by 10 feet.",
	mechanicsComplete: true,
  },
  {
	id: "fearsome-reputation",
	name: "Fearsome Reputation",
	description: "Intimidation counts as a Social Essence skill for you, and while Morphed you gain an additional shift bonus when using Intimidation.",
	mechanicsComplete: true,
  },
  {
	id: "garage-band",
	name: "Garage Band",
	description: "Prerequisite: Performance d4+. After performances, gain stronger Streetwise and Persuasion leverage with fans.",
	mechanicsComplete: true,
  },
  {
	id: "giant-killer",
	name: "Giant-Killer",
	description: "Gain attack bonuses against targets significantly larger than you, with stronger benefits against very large size gaps.",
	mechanicsComplete: true,
  },
  {
	id: "grid-champion",
	name: "Grid Champion",
	description: "Prerequisite: previously vanquished a Towering-or-larger enemy. Gain anti-minion advantages versus Putties and Tengas, including surprise interaction and attack bonus.",
	mechanicsComplete: true,
  },
  {
	id: "heavy-armor-shell",
	name: "Heavy Armor Shell",
	description: "Prerequisite: Medium Armor Training. Gain Heavy Armor Training, updating your Morphed Toughness bonus.",
	mechanicsComplete: true,
  },
  {
	id: "heroic-intervention",
	name: "Heroic Intervention",
	description: "Prerequisite: Level 8+. Add one Story Point each session; spend 1 Power for emergency repositioning in combat; gain +1 to defenses while adjacent to an ally.",
	mechanicsComplete: true,
  },
  {
	id: "humanitarian",
	name: "Humanitarian",
	description: "Prerequisite: Social 3+. Gain social and support advantages when helping humans, including healing utility and resource-acquisition edge from human sources.",
	mechanicsComplete: true,
  },
  {
	id: "inspired",
	name: "Inspired",
	description: "Once per day, reroll one die you rolled.",
	mechanicsComplete: true,
  },
  {
	id: "instinctual-initiative",
	name: "Instinctual Initiative",
	description: "Gain Edge on Initiative and limited action economy even when surprised (move or Free action, not both).",
	mechanicsComplete: true,
  },
  {
	id: "iron-hands",
	name: "Iron Hands",
	description: "Prerequisite: Strength Essence 3+. Your Might (Martial Arts) attacks deal +1 damage.",
	mechanicsComplete: true,
  },
  {
	id: "keen-eye",
	name: "Keen Eye",
	description: "Prerequisite: Alertness (Perception). Gain Edge on Alertness (Perception), gain ↑1 on Skill Tests based on sight, and you may attempt a DIF 12 Alertness test to recall visual details from the last 24 hours.",
	mechanicsComplete: true,
  },
  {
	id: "linguistics",
	name: "Linguistics",
	description: "Gain fluency in three languages of your choice.",
	mechanicsComplete: true,
  },
  {
	id: "luck",
	name: "Luck",
	description: "You may reroll natural 1s on skill dice of d4 or higher, and must keep the second result.",
	mechanicsComplete: true,
  },
  {
	id: "medium-armor-shell",
	name: "Medium Armor Shell",
	description: "Prerequisite: Light Armor Training. Gain Medium Armor Training, updating your Morphed Toughness bonus.",
	mechanicsComplete: true,
  },
  {
	id: "ninja-power",
	name: "Ninja Power",
	description: "Prerequisite: Personal Power Maximum 4+. Spend Power with It’s Morphin Time! to enter Ninja Power, granting temporary boosts to martial attacks, speed skills, damage typing, and jump mobility.",
	mechanicsComplete: true,
  },
  {
	id: "peerless-pilot",
	name: "Peerless Pilot",
	description: "Prerequisite: any Driving specialization at d6+. Gain piloting Initiative and Driving advantages in qualified vehicles and automatically pass emergency disembark tests.",
	mechanicsComplete: true,
  },
  {
	id: "righteous-heart",
	name: "Righteous Heart",
	description: "Immune to fear effects; while Morphed, you can use a Free action to gain temporary resistance to one damage type until the end of your next turn.",
	mechanicsComplete: true,
  },
  {
	id: "sharpshooters-grace",
	name: "Sharpshooter’s Grace",
	description: "Prerequisite: Targeting d6+. Ignore a long-range ranged-attack Snag and gain a close-range ranged-attack bonus.",
	mechanicsComplete: true,
  },
  {
	id: "spectrum-shift",
	name: "Spectrum Shift",
	description: "Change your Ranger Spectrum color; operational rules are defined in the Role Spectrum section.",
	mechanicsComplete: true,
  },
  {
	id: "supercharged-essence",
	name: "Supercharged Essence",
	description: "Prerequisite: choose an Essence score at 5+. While Morphed, skills linked to that Essence gain a shift bonus. May be taken multiple times, once per Essence.",
	mechanicsComplete: true,
  },
  {
	id: "terran-study",
	name: "Terran Study",
	description: "Prerequisite: cannot originally be from Earth. Gain social/cultural advantages when dealing with humans and gain fluency in two Earth languages.",
	mechanicsComplete: true,
  },
  {
	id: "ultra-heavy-armor-shell",
	name: "Ultra-Heavy Armor Shell",
	description: "Prerequisite: Heavy Armor Training. Gain Ultra-Heavy Armor Training, updating your Morphed Toughness bonus.",
	mechanicsComplete: true,
  },
  {
	id: "vast-wealth",
	name: "Vast Wealth",
	description: "Gain session-limited monetary auto-success for buyable outcomes, plus social and Wealth-check advantages tied to your resources.",
	mechanicsComplete: true,
  },
  {
	id: "wrestler",
	name: "Wrestler",
	description: "Prerequisite: Strength 3+. Gain Edge on Grapple attacks and a Free-action pin attempt using a Might test to drop a grappled target prone.",
	mechanicsComplete: true,
  },
];

export const HANGUPS: OptionItem[] = [
  {
	id: "artisan-hangup",
	name: "Artisan Hang-Up",
	description: "When absorbed in your art, you lose focus on unrelated social/smarts demands and may create spotlight or planning friction based on your art style.",
	mechanicsComplete: true,
  },
  {
	id: "caretaker-hangup",
	name: "Caretaker Hang-Up",
	description: "You prioritize the safety of those in your care before broader tactical goals, even when that choice puts pressure on the team.",
	mechanicsComplete: true,
  },
  {
	id: "community-helper-hangup",
	name: "Community Helper Hang-Up",
	description: "You feel compelled to protect civilians first and often heal others before yourself, even when strategically risky.",
	mechanicsComplete: true,
  },
  {
	id: "small-town-roots-hangup",
	name: "Small Town Roots Hang-Up",
	description: "When first meeting someone with whom you share no Influence, you suffer a Snag on your first Social skill test with them.",
	mechanicsComplete: true,
  },
  {
	id: "martial-artist-hangup",
	name: "Martial Artist Hang-Up",
	description: "Your show-off tendencies make you easier to bait; social attempts to goad you into action are more effective.",
	mechanicsComplete: true,
  },
  {
	id: "nomad-hangup",
	name: "Nomad Hang-Up",
	description: "You are slow to trust strangers and generally do not believe someone the first time you meet them.",
	mechanicsComplete: true,
  },
  {
	id: "not-from-around-here-hangup",
	name: "Not From Around Here Hang-Up",
	description: "You suffer a Snag on Social-based skill tests tied to naturally understanding human behavior.",
	mechanicsComplete: true,
  },
  {
	id: "student-hangup",
	name: "Student Hang-Up",
	description: "Overconfidence in your study focus can cause Snags on off-topic recall and can blind you to other clues at GM discretion.",
	mechanicsComplete: true,
  },
  {
	id: "survivor-hangup",
	name: "Survivor Hang-Up",
	description: "When confronted with reminders of your trauma, you lose focus and suffer a Snag on Alertness checks.",
	mechanicsComplete: true,
  },
  {
	id: "teacher-hangup",
	name: "Teacher Hang-Up",
	description: "You cannot resist instructing others and may force yourself to demonstrate tasks first in non-combat scenes when you are more skilled.",
	mechanicsComplete: true,
  },
];

export default { PERKS, HANGUPS };
