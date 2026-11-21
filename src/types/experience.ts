export interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  /** Date pill aligned right (e.g. "2024 – Presente"). */
  period: string;
  /** Line under the title (place, degree detail, stack). */
  subtitle?: string;
  /** Small chips (e.g. "Monitor", "En curso"). */
  tags?: string[];
  /** Optional logo (path under /public); falls back to an initials badge. */
  logo?: string;
  /** Bullet notes, collapsed under the entry. */
  notes?: string[];
}

export interface ExperienceGroup {
  id: string;
  /** Sub-label of the group (e.g. "Académica"). */
  label: string;
  entries: ExperienceEntry[];
}

export interface ExperienceLabels {
  /** Summary of the collapsed notes. */
  details: string;
  /** Accessible name prefix of each timeline list. */
  timeline: string;
}
