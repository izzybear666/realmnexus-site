import type { Character } from "./character";
import type { Stat } from "./stat";
import type { Skill } from "./skill";
import type { Power } from "./power";

// Essence20-specific structural extensions.
// These are lightweight, structural types only. Do not include rule numbers
// or copyrighted text. Keep them optional so they do not force values.

export interface Essence20Stat extends Stat {
  /** Optional category for UI grouping (e.g., "Core", "Derived") */
  category?: string;
}

export interface Essence20Skill extends Skill {
  /** Optional skill group or specialization */
  group?: string;
}

export interface Essence20Power extends Power {
  /** Optional power classification (e.g., offensive, defensive) */
  powerType?: string;
}

export interface Essence20Character extends Character {
  /** Optional player-facing concept/title (e.g., "Red Ranger") */
  concept?: string;
  /** System-specific stat list (uses Essence20Stat) */
  stats: Essence20Stat[];
  skills: Essence20Skill[];
  powers: Essence20Power[];
  /** Version or edition string specific to Essence20 usage */
  systemVersion?: string;
  /** Structured influences (optional). Backwards-compatible with legacy string[] */
  influenceDetails?: {
	id: string;
	perk?: string;
	hangup?: string;
	bonds?: string[];
	options?: Record<string, string | string[] | undefined>;
  }[];
}
