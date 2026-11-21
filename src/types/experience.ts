export type ExperienceType = "freelance" | "full-time" | "part-time" | "internship";

export interface ExperienceEntry {
  id: string;
  type: ExperienceType;
  role: string;
  company: string;
  period: string;
  description: string;
}
