// Generic description of a game system (system-agnostic)
export interface GameSystem {
  /** Unique identifier for the system (e.g., 'essence20') */
  id: string;
  /** Human-friendly name (e.g., 'Power Rangers Essence20') */
  name: string;
  /** URL-friendly slug used in routes (e.g., 'essence20') */
  slug: string;
  /** Optional short description written by the developer */
  description?: string;
  /** Optional version or edition string */
  version?: string;
  /** Any extra metadata the app or UI might need */
  metadata?: Record<string, unknown>;
}

export type SystemId = GameSystem['id'];
