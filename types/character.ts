import type { Stat } from "./stat";
import type { Skill } from "./skill";
import type { Power } from "./power";
import type { Equipment } from "./equipment";
import type { SystemId } from "./system";

// Core, system-agnostic character model
export interface Character {
  /** Unique identifier for the character */
  id: string;
  /** Character display name */
  name: string;
  /** The system this character belongs to (matches GameSystem.id) */
  systemId: SystemId;
  /** Optional short concept or blurb about the character */
  concept?: string;
  /** Creation timestamp (ISO string) */
  createdAt: string;
  /** Last updated timestamp (ISO string) */
  updatedAt?: string;
  /** Primary collections for a character */
  stats: Stat[];
  skills: Skill[];
  powers: Power[];
  equipment: Equipment[];
  /** Freeform notes and non-structured data */
  notes?: string;
  /** Metadata for UI, versioning, or migration helpers */
  metadata?: Record<string, unknown>;
}
