// Generic stat model used across systems
export interface Stat {
  /** Unique identifier for the stat (e.g., 'strength') */
  id: string;
  /** Human-friendly name (e.g., 'Strength') */
  name: string;
  /** Optional short abbreviation (e.g., 'STR') */
  abbreviation?: string;
  /** Numeric value when applicable. Keep nullable if a system doesn't use numbers. */
  value?: number | null;
  /** Optional min/max bounds when relevant to the system or UI */
  min?: number | null;
  max?: number | null;
  /** Extra metadata for UI hints or system-specific flags */
  metadata?: Record<string, unknown>;
}
