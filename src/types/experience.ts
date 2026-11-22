export interface ExperienceEntry {
  id: string;
  /** Date range shown above the title (e.g. "2024 — Actualidad"). */
  period?: string;
  title: string;
  /** Institution, company or project kind, shown in the accent colour. */
  organization: string;
  /** City / country, appended to the organization. */
  place?: string;
  /** Short, complete description (always visible). */
  description?: string;
}

export interface ExperienceGroup {
  id: string;
  /** Column label (e.g. "Educación"). */
  label: string;
  entries: ExperienceEntry[];
}
