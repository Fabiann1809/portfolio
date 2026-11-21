import type { ExperienceEntry, ExperienceGroup } from "@/types";
import { projectLabels, projects } from "@/data/projects";

export const experienceTitle = "Experiencia";

const academic: ExperienceEntry[] = [
  {
    id: "ucc",
    title: "Ingeniería de Software",
    organization: "Universidad Cooperativa de Colombia",
    period: "5.º semestre, en curso",
    note: "Beca por el mejor promedio de toda la carrera. Monitor de la carrera (materias: PLACEHOLDER).",
  },
  {
    id: "sena",
    title: "Técnico en Programación de Software",
    organization: "SENA",
    period: "PLACEHOLDER: años",
  },
  {
    id: "semillero",
    title: "Semillero de investigación",
    organization: "Universidad Cooperativa de Colombia",
    period: "PLACEHOLDER: años",
    note: "Reconocimiento por destacarme en un proyecto de biotecnología (PLACEHOLDER: nombre del proyecto). Participación en tres ocasiones en RedCOLSI a nivel nacional (PLACEHOLDER: años).",
  },
  {
    id: "bachiller",
    title: "Bachiller",
    organization: "Institución Educativa Instituto Teresiano",
    period: "2023",
    note: "Reconocimiento al mejor promedio académico del año y de la graduación.",
  },
];

/** One line per project of data/projects.ts, with its real stack. */
const development: ExperienceEntry[] = projects.map((project) => ({
  id: `dev-${project.id}`,
  title: project.title,
  organization: project.collaborative ? projectLabels.collaborative : "Proyecto personal",
  period: project.year,
  note: project.technologies.join(" · "),
}));

export const experienceGroups: ExperienceGroup[] = [
  { id: "academic", label: "Académica", entries: academic },
  { id: "development", label: "Desarrollo de software", entries: development },
];
