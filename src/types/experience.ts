export interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  period: string;
  /** Small tag after the organization (e.g. "Colaboré"). */
  tag?: string;
  note?: string;
}

export interface ExperienceGroup {
  id: string;
  /** Sub-label of the group (e.g. "Académica"). */
  label: string;
  entries: ExperienceEntry[];
}
