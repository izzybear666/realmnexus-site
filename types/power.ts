// Generic power/ability model
export interface Power {
  /** Unique identifier for the power (e.g., 'energy_blast') */
  id: string;
  /** Human-friendly name (e.g., 'Energy Blast') */
  name: string;
  /** Optional developer-written description. Avoid copyrighted text. */
  description?: string;
  /** Optional level, tier, or rank for the power. Nullable by design. */
  level?: number | null;
  /** Optional cost or resource consumption (system-specific meaning) */
  cost?: number | null;
  /** Extra metadata for UI hints or system-specific flags */
  metadata?: Record<string, unknown>;
}
