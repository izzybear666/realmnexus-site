// Influence choices for Essence20 (developer-provided, mechanically partial)
export type Influence = {
  id: string; // stable lowercase id
  name: string; // display name
  description?: string; // short developer-written blurb
	perk?: string; // optional human-readable perk description (read-only)
  mechanicsComplete: boolean; // whether mechanical details are verified
	bondsTable?: string[]; // optional d12 Background Bond table (12 entries required for random roll)
  bondsComplete?: boolean; // whether the bondsTable is a verified complete d12 table
  notes?: string; // freeform notes about missing/unverified details
};

// Structured chosen influence for character drafts. Kept minimal and optional
// so legacy saves (string[] of ids) remain compatible.
export type ChosenInfluence = {
  id: string; // stable influence id
  perk?: string; // optional perk id or freeform value
  hangup?: string; // optional hang-up id or freeform value
  bonds?: string[]; // optional background bonds
  options?: Record<string, string | string[] | undefined>; // influence-specific small fields
};

/**
 * Convert legacy influence representations (string[] or mixed) into a
 * structured ChosenInfluence[] preserving order. This is additive and
 * does not modify stored data; use in-memory when loading drafts.
 */
export type RawInfluenceInput =
  | string
  | null
  | undefined
  | {
	  id?: string;
	  name?: string;
	  perk?: string;
	  hangup?: string;
	  bonds?: Array<string | number> | null;
	  options?: Record<string, string | string[] | undefined> | null;
	};

export function toChosenInfluences(input?: RawInfluenceInput[] | null): ChosenInfluence[] {
  if (!input) return [];
  if (!Array.isArray(input)) return [];
  const out: ChosenInfluence[] = [];
  for (const it of input) {
	try {
	  if (typeof it === "string") {
		const byId = INFLUENCES.find((i) => i.id === it);
		const byName = INFLUENCES.find((i) => i.name === it);
		const id = byId ? byId.id : byName ? byName.id : it;
		out.push({ id });
		continue;
	  }
	  if (!it || typeof it !== "object") {
		// Skip unexpected values but preserve them as stringified ids
		out.push({ id: String(it) });
		continue;
	  }

	  const raw = it as {
		id?: unknown;
		name?: unknown;
		perk?: unknown;
		hangup?: unknown;
		bonds?: unknown;
		options?: unknown;
	  };

	  const idCandidate = typeof raw.id === "string" ? raw.id : typeof raw.name === "string" ? raw.name : undefined;
	  const byId = idCandidate ? INFLUENCES.find((i) => i.id === idCandidate) : undefined;
	  const byName = idCandidate ? INFLUENCES.find((i) => i.name === idCandidate) : undefined;
	  const id = byId ? byId.id : byName ? byName.id : idCandidate ? String(idCandidate) : String(raw.id ?? raw.name ?? "");

	  let bonds: string[] | undefined = undefined;
	  if (Array.isArray(raw.bonds)) {
		bonds = raw.bonds.filter((b) => b !== null && b !== undefined).map((b) => String(b));
	  }

	  let options: Record<string, string | string[] | undefined> | undefined = undefined;
	  if (raw.options && typeof raw.options === "object") {
		options = {};
		for (const [k, v] of Object.entries(raw.options as Record<string, unknown>)) {
		  if (v == null) {
			options[k] = undefined;
		  } else if (typeof v === "string") {
			options[k] = v;
		  } else if (Array.isArray(v)) {
			options[k] = v.filter((x) => x != null).map(String);
		  } else {
			// ignore unexpected types, stringify as fallback
			options[k] = String(v);
		  }
		}
	  }

	  const perk = typeof raw.perk === "string" ? raw.perk : undefined;
	  const hangup = typeof raw.hangup === "string" ? raw.hangup : undefined;

	  out.push({ id, perk, hangup, bonds, options });
	} catch (e) {
	  // Defensive: on any unexpected error, preserve the item as a string id
	  out.push({ id: String(it) });
	}
  }
  return out;
}

export const INFLUENCES: Influence[] = [
	{
	id: "artisan",
	name: "Artisan",
	description: "Hands-on maker or craftsperson.",
	mechanicsComplete: true,
	perk: "Gain Edge when art is relevant, including artistic performance, sharing techniques, or applying art to a mission. Gain Edge on Social and Smarts Skill Tests where art applies.",
	bondsTable: [
	  "I'm happiest when everyone is getting along, and make it my business to defuse out tensions among my team.",
	  "I am too competitive with my artistic pursuits.",
	  "I regularly recite stories, speeches, and monologues to inspire my comrades.",
	  "Someone stole my work and I'm trying to get it back.",
	  "I once bombed so badly that a highly respected group has ostracized me.",
	  "I have never felt my art was good enough.",
	  "I believe art should exist for its own sake, and doesn't need to serve a function or promote an idea.",
	  "I use tools that were handed down to me from a great artist, and I seek another artist to hand them down to.",
	  "I'm an incurable gossip, and love to know what's going on in any group I'm in.",
	  "Making people smile makes all my work worthwhile.",
	  "I won't stop creating until my name is known across the world.",
	  "My muse strikes at the worst times - in the middle of the night, during missions, and worse."
	],
	bondsComplete: true,
  },
  {
	id: "caretaker",
	name: "Caretaker",
	description: "Looks after others or property.",
	mechanicsComplete: true,
	perk: "Gain Edge on all Medicine and Group Checks. When using Lend Assistance, grant an additional Edge to those you help.",
	bondsTable: [
	  "The person I care for means more to me than anyone else in the world.",
	  "I feel forced into my responsibilities out of a sense of duty and obligation.",
	  "Someone got hurt under my care, and I’ll never forgive myself.",
	  "I cannot stand to see an animal harmed in any way.",
	  "A goal of mine is to one day earn a doctorate degree in medicine.",
	  "I fear that nobody will care for me as much as I care for others.",
	  "I will always make sure that people around me are happy and content.",
	  "I carry my grandparent’s ring as a reminder of unconditional love.",
	  "I was very ill as a child and will always strive to be as nurturing as the person who took care of me.",
	  "My quick temper often gets in the way of my bedside manner.",
	  "I became a guardian to another at a very young age.",
	  "I hope to someday open a home for the needy."
	],
	bondsComplete: true,
  },
  {
	id: "community-helper",
	name: "Community Helper",
	description: "Volunteer or civic-minded member.",
	mechanicsComplete: true,
	perk: "Gain Edge on non-combat tasks related to your chosen service when the Influence applies; the GM determines applicability.",
	bondsTable: [
	  "Helping others is my calling.",
	  "The service I provide to my community runs in my family, and I am following in their footsteps.",
	  "I lost my partner/coworker in an emergency situation in the field, and I carry that loss with me every day.",
	  "I originally joined my chosen service to impress someone.",
	  "I had no good role models in my youth, and I strive to be one for others.",
	  "I have an obsession with safety and often annoy others with repeating safety rules.",
	  "I never want to fall in love because I am afraid that my job is too dangerous.",
	  "I have a rivalry with another associate in my chosen service.",
	  "I want to rise to a position of authority and feel challenged and angry when someone else tells me what to do.",
	  "I am always prepared with supplies and tools for any sort of emergency.",
	  "Any defeat is because someone cheated me.",
	  "I’m constantly checking to see how the public reacts to my Power Ranger persona to be sure everyone is impressed by my heroism."
	],
	bondsComplete: true,
  },
  {
	id: "small-town-roots",
	name: "Small Town Roots",
	description: "Grew up in a small town.",
	mechanicsComplete: true,
	perk: "Once per session, when making a choice, ask the GM which of two options is more beneficial. The GM answers truthfully if able to estimate.",
	bondsTable: [
	  "People tell me who they really are by what they do, not what they say.",
	  "I show respect to all my friends and enemies.",
	  "I keep up with folks back home - they don't know that I am a hero, but I try to inspire them anyway.",
	  "No one is beyond redemption, it just takes giving an honest chance and hard work.",
	  "I act on what's right instead of what's best for the mission.",
	  "I find peace by passing the time playing a simple instrument.",
	  "When I need to relax, I seek simple comforts and good friends.",
	  "Others may call me stubborn, but it's my determination that's gotten me this far.",
	  "I'd rather do something and be wrong than hesitate until the exact right moment.",
	  "Most folks just need someone to believe in them to succeed.",
	  "I truly believe that the early bird gets the worm.",
	  "I recognize there are gaps in my knowledge and I seek out mentors to help me be the best hero I can be."
	],
	bondsComplete: true,
  },
  {
	id: "martial-artist",
	name: "Martial Artist",
	description: "Trained in martial disciplines.",
	mechanicsComplete: true,
	perk: "After observing another martial artist for one minute, the GM compares their Threat Level, Toughness, and Evasion with yours, indicating whether each is equal, superior, or inferior.",
	bondsTable: [
	  "I do all I can to avoid fighting, but if combat erupts, I fight all out.",
	  "I apply the same focus I have for martial arts with one of my hobbies that I share with my friends.",
	  "I am too quick to anger and feel staggering remorse after a fight ends.",
	  "My martial arts master occasionally sends students to me to mentor.",
	  "Whenever people hear about my martial arts experience, they want me to show off and perform tricks like a circus animal.",
	  "When I'm stressed or need focus, I can be found practicing my martial arts.",
	  "My art stresses the importance of contributing for the greater good of society.",
	  "Martial arts is a respected practice all over the world, and I seek to use my skills to become famous.",
	  "I believe the ultimate goal of my martial arts training is to spark the growth and development of the spirit, mind and body.",
	  "I must protect others because I have the strength and skills to do so.",
	  "I tightly follow the vows of my martial art.",
	  "I love martial arts movies and competitions and talk about them incessantly."
	],
	bondsComplete: true,
  },
  {
	id: "nomad",
	name: "Nomad",
	description: "A wanderer with varied experiences.",
	mechanicsComplete: true,
	perk: "Gain Edge on Social tests to understand motives or detect lies, and on Knowledge tests about cities where you have lived.",
	bondsTable: [
	  "I write a letter every month to a friend whom I left behind in my last move.",
	  "I adapt to new living situations very quickly but have a hard time sleeping soundly.",
	  "I've never known anyone long enough to call them my \"best friend.\"",
	  "I love learning about new cultures.",
	  "I left an item from my childhood in a state I left, and I vow to go back to find it.",
	  "I resent my parents for subjecting me to a life without permanent roots.",
	  "When I arrive in a new town, I like to find the local library first.",
	  "I don't trust others with my secrets.",
	  "I pick up on local accents very quickly.",
	  "I miss my nomadic lifestyle and sometimes feel stuck in one place.",
	  "My immediate family has never owned property, and I hope to buy a home when I'm older.",
	  "I collect figurines from every city I've lived in."
	],
	bondsComplete: true,
  },
  {
	id: "not-from-around-here",
	name: "Not From Around Here",
	description: "New to the region or culture.",
	mechanicsComplete: true,
	perk: "Gain Edge on out-of-combat Skill Tests when your unusual background or upbringing applies. Know one additional language.",
	bondsTable: [
	  "I want to someday show my friends where I came from.",
	  "I am always nervous when meeting new people.",
	  "I often compare myself to my human friends.",
	  "New foods or earthly devices fascinate me.",
	  "I'm quick to anger when others treat me differently due to how I look.",
	  "I never show my true face to strangers.",
	  "I struggle to learn the proper way to fit in with different cultures and traditions and am often perceived as awkward or out of place.",
	  "The society I have left behind resents me, and I fear I have no home to return to.",
	  "I keep a secret about my home that I am afraid may be revealed.",
	  "I sometimes put on different personalities to help me fit in with others.",
	  "I am extremely superstitious, often quoting parables of my culture.",
	  "I carry a stone from my home and consider it a good-luck charm and reminder of my roots."
	],
	bondsComplete: true,
  },
  {
	id: "student",
	name: "Student",
	description: "Currently in formal education.",
	mechanicsComplete: true,
	perk: "Gain Edge on Skill Tests to recall facts or perform tasks related to your chosen subject. Institutions associated with your subject recognize you and welcome you to conduct further research.",
	bondsTable: [
	  "I feel happy, comfortable, and welcome in schools and libraries.",
	  "I often quote books or famous figures related to my area of study.",
	  "I will take risks to learn new information.",
	  "I have a closer bond with a teacher or mentor than I do with my own parent.",
	  "I sometimes look down on others whom I feel aren't as smart as me.",
	  "I have a difficult time discussing topics that aren't academic subjects.",
	  "I feel personally offended when others don't trust the information I impart to them.",
	  "I am always respectful to my elders and to those who have more knowledge than I do.",
	  "I tend to over-examine new information, sometimes to a point where I am wasting time.",
	  "I believe that emotions can cloud logical thought, so I prioritize logistics over feelings.",
	  "I will someday be famous for the knowledge I have in my area of study.",
	  "I will always encourage research prior to any impulsive action."
	],
	bondsComplete: true,
  },
  {
	id: "survivor",
	name: "Survivor",
	description: "Overcame a significant hardship.",
	mechanicsComplete: true,
	perk: "Gain Edge on Survival or related checks involving emergency situations or instinctive choices. If Smarts would be lowered to 0, roll a Willpower check with DIF 10 or higher as specified by the rules to keep it at 1.",
	bondsTable: [
	  "I've always looked at my hardship as an opportunity to learn and grow.",
	  "It was only when I thought things couldn't get worse that I saw all of the ways that my life could get better.",
	  "All of the lasting effects of the ordeal that I survived have contributed to the awesome person I am today.",
	  "I still suffer nightmares about my survival experience, but I don't talk about them much.",
	  "People say that I inspire them to overcome their own troubles, but sometimes I still need support too.",
	  "Going through the worst of times gave me the opportunity to see who my true friends are.",
	  "After my survival, I gave myself a complete physical and mental makeover.",
	  "I may have survived my hardship, but someone I loved deeply did not.",
	  "I make impulsive decisions, because I know that I no longer want to waste a single day of my life.",
	  "I regularly make charitable contributions and volunteer my time to good causes.",
	  "I strive to eat healthy food and exercise to take care of myself as best as I can.",
	  "When I see someone who is sad or in other distress, I feel compelled to reach out in friendship."
	],
	bondsComplete: true,
  },
  {
	id: "teacher",
	name: "Teacher",
	description: "Experienced in instructing others.",
	mechanicsComplete: true,
	perk: "When another Ranger makes a non-combat Skill Test, you can Lend Assistance with an additional Edge. If you have a Specialization in that Skill, you can provide two additional Edges, but the task takes twice as long.",
	bondsTable: [
	  "Teaching others about the things I'm passionate about is truly fulfilling.",
	  "I cannot say no when asked for help.",
	  "Some people think I am bossy, but I am just trying to help them do things the correct way.",
	  "I value being a confidant and mentor to others.",
	  "I often give unsolicited advice.",
	  "I will always take the time to teach others anything I've learned that they also want to know.",
	  "I believe the best teacher is one who wants their student to surpass them in skill.",
	  "Only those who are educated have the ability to make a truly informed choice.",
	  "I am secretly jealous of one of my students.",
	  "I'm resentful that I am not paid (enough) for sharing my knowledge and experience.",
	  "While I have knowledge in certain areas, I still feel like I have a lot to learn.",
	  "I'm painfully shy, and I only feel extroverted and confident when I am showing others what I know."
	],
	bondsComplete: true,
  },
];

export default INFLUENCES;
