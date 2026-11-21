import type { ExperienceEntry, ExperienceGroup, ExperienceLabels } from "@/types";
import { projectLabels, projects } from "@/data/projects";

export const experienceTitle = "Experiencia";

export const experienceLabels: ExperienceLabels = {
  details: "Detalles",
  timeline: "Línea de tiempo",
};

const academic: ExperienceEntry[] = [
  {
    id: "ucc",
    title: "Ingeniería de Software",
    organization: "Universidad Cooperativa de Colombia",
    period: "2024 – Presente",
    subtitle: "5.º semestre",
    tags: ["Beca mejor promedio", "Monitor", "En curso"],
    notes: [
      "Beca por el mejor promedio de toda la carrera.",
      "Monitor de la carrera (materias: PLACEHOLDER).",
    ],
  },
  {
    id: "sena",
    title: "Técnico en Programación de Software",
    organization: "SENA",
    period: "PLACEHOLDER: años",
    subtitle: "Formación técnica",
  },
  {
    id: "semillero",
    title: "Semillero de investigación",
    organization: "Universidad Cooperativa de Colombia",
    period: "PLACEHOLDER: años",
    subtitle: "Biotecnología",
    tags: ["RedCOLSI", "Reconocimiento"],
    notes: [
      "Reconocimiento por destacarme en un proyecto de biotecnología (PLACEHOLDER: nombre del proyecto).",
      "Participación en tres ocasiones en RedCOLSI a nivel nacional (PLACEHOLDER: años).",
    ],
  },
  {
    id: "bachiller",
    title: "Bachiller",
    organization: "Institución Educativa Instituto Teresiano",
    period: "2023",
    subtitle: "Graduación",
    tags: ["Mejor promedio"],
    notes: ["Reconocimiento al mejor promedio académico del año y de la graduación."],
  },
];

/** One entry per project of data/projects.ts, with its real stack. */
const development: ExperienceEntry[] = projects.map((project) => ({
  id: `dev-${project.id}`,
  title: project.title,
  organization: project.collaborative ? projectLabels.collaborative : "Proyecto personal",
  period: project.year,
  subtitle: project.technologies.join(" · "),
  notes: [project.description],
}));

export const experienceGroups: ExperienceGroup[] = [
  { id: "academic", label: "Académica", entries: academic },
  { id: "development", label: "Desarrollo de software", entries: development },
];
