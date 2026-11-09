// Generic equipment / item model
export interface Equipment {
  /** Unique identifier for the item (e.g., 'laser_pistol') */
  id: string;
  /** Human-friendly name (e.g., 'Laser Pistol') */
  name: string;
  /** Optional developer-written description; do not include copyrighted text */
  description?: string;
  /** Quantity owned by the character */
  quantity?: number;
  /** Optional weight or bulk value where relevant */
  weight?: number | null;
  /** Extra metadata for UI or system-specific flags */
  metadata?: Record<string, unknown>;
}
