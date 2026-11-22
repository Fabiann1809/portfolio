import type { ExperienceEntry, ExperienceGroup, ExperienceLabels, Locale, Localized } from "@/types";
import { projectLabels, projects } from "@/data/projects";

export const experienceTitle: Localized<string> = {
  es: "Experiencia",
  en: "Experience",
};

export const experienceLabels: Localized<ExperienceLabels> = {
  es: {
    details: "Detalles",
    timeline: "Línea de tiempo",
  },
  en: {
    details: "Details",
    timeline: "Timeline",
  },
};

const academic: Localized<ExperienceEntry[]> = {
  es: [
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
      organization: "Tecnoacademia de Túquerres",
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
  ],
  en: [
    {
      id: "ucc",
      title: "Software Engineering",
      organization: "Universidad Cooperativa de Colombia",
      period: "2024 – Present",
      subtitle: "5th semester",
      tags: ["Top GPA scholarship", "Teaching assistant", "In progress"],
      notes: [
        "Scholarship for the highest GPA of the entire program.",
        "Teaching assistant for the program (subjects: PLACEHOLDER).",
      ],
    },
    {
      id: "sena",
      title: "Software Programming Technician",
      organization: "SENA",
      period: "PLACEHOLDER: years",
      subtitle: "Technical training",
    },
    {
      id: "semillero",
      title: "Research seedbed",
      organization: "Tecnoacademia de Túquerres",
      period: "PLACEHOLDER: years",
      subtitle: "Biotechnology",
      tags: ["RedCOLSI", "Recognition"],
      notes: [
        "Recognition for standing out in a biotechnology project (PLACEHOLDER: project name).",
        "Took part three times in RedCOLSI at the national level (PLACEHOLDER: years).",
      ],
    },
    {
      id: "bachiller",
      title: "High school diploma",
      organization: "Institución Educativa Instituto Teresiano",
      period: "2023",
      subtitle: "Graduation",
      tags: ["Top GPA"],
      notes: ["Recognition for the highest GPA of the year and of the graduating class."],
    },
  ],
};

const groupLabels: Localized<{ academic: string; development: string; personalProject: string }> = {
  es: { academic: "Académica", development: "Desarrollo de software", personalProject: "Proyecto personal" },
  en: { academic: "Academic", development: "Software development", personalProject: "Personal project" },
};

/** One entry per project of data/projects.ts, with its real stack. */
const development = (locale: Locale): ExperienceEntry[] =>
  projects[locale].map((project) => ({
    id: `dev-${project.id}`,
    title: project.title,
    organization: project.collaborative ? projectLabels[locale].collaborative : groupLabels[locale].personalProject,
    period: project.year,
    subtitle: project.technologies.join(" · "),
    notes: [project.description],
  }));

const buildGroups = (locale: Locale): ExperienceGroup[] => [
  { id: "academic", label: groupLabels[locale].academic, entries: academic[locale] },
  { id: "development", label: groupLabels[locale].development, entries: development(locale) },
];

export const experienceGroups: Localized<ExperienceGroup[]> = {
  es: buildGroups("es"),
  en: buildGroups("en"),
};
