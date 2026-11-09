// Generic skill model
export interface Skill {
  /** Unique identifier for the skill (e.g., 'athletics') */
  id: string;
  /** Human-friendly name (e.g., 'Athletics') */
  name: string;
  /** Optional short description written by the developer */
  description?: string;
  /** Rank, level, or points invested. Nullable to allow non-numeric systems */
  rank?: number | null;
  /** Whether the character is trained or has special access to this skill */
  trained?: boolean;
  /** Extra metadata for UI or system-specific flags */
  metadata?: Record<string, unknown>;
}
