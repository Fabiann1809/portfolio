import type { ExperienceEntry, ExperienceGroup, Locale, Localized } from "@/types";
import { projectLabels, projects } from "@/data/projects";

export const experienceTitle: Localized<string> = {
  es: "Experiencia",
  en: "Experience",
};

const education: Localized<ExperienceEntry[]> = {
  es: [
    {
      id: "ucc",
      period: "2024 — Actualidad",
      title: "Ingeniería de Software",
      organization: "Universidad Cooperativa de Colombia",
      description:
        "5.º semestre. Beca por el mejor promedio de toda la carrera y monitor académico del programa.",
    },
    {
      id: "sena",
      period: "2022 — 2023",
      title: "Técnico en Programación de Software",
      organization: "SENA",
      description: "Formación técnica en programación de software.",
    },
    {
      id: "semillero",
      period: "2021 — 2023",
      title: "Semillero de investigación en Biotecnología",
      organization: "Tecnoacademia",
      place: "Túquerres",
      description:
        "Reconocimiento por destacarme en un proyecto de biotecnología y ponente en el Encuentro Nacional de RedCOLSI en Medellín (2022) y Cartagena (2023).",
    },
    {
      id: "bachiller",
      period: "2023",
      title: "Bachiller",
      organization: "Institución Educativa Instituto Teresiano",
      description: "Reconocimiento al mejor promedio académico del año y de la graduación.",
    },
  ],
  en: [
    {
      id: "ucc",
      period: "2024 — Present",
      title: "Software Engineering",
      organization: "Universidad Cooperativa de Colombia",
      description:
        "5th semester. Scholarship for the highest GPA of the entire program and program teaching assistant.",
    },
    {
      id: "sena",
      period: "2022 — 2023",
      title: "Software Programming Technician",
      organization: "SENA",
      description: "Technical training in software programming.",
    },
    {
      id: "semillero",
      period: "2021 — 2023",
      title: "Biotechnology research seedbed",
      organization: "Tecnoacademia",
      place: "Túquerres",
      description:
        "Recognition for standing out in a biotechnology project and speaker at the RedCOLSI National Meeting in Medellín (2022) and Cartagena (2023).",
    },
    {
      id: "bachiller",
      period: "2023",
      title: "High school diploma",
      organization: "Institución Educativa Instituto Teresiano",
      description: "Recognition for the highest GPA of the year and of the graduating class.",
    },
  ],
};

const freelance: Localized<ExperienceEntry> = {
  es: {
    id: "freelance",
    period: "2024 — Actualidad",
    title: "Desarrollador de software Full Stack e IA",
    organization: "Freelance",
    place: "Remoto",
    description: "Diseño, desarrollo y despliegue de productos web, móviles, de escritorio y de IA, de la interfaz al despliegue.",
  },
  en: {
    id: "freelance",
    period: "2024 — Present",
    title: "Full Stack & AI Software Developer",
    organization: "Freelance",
    place: "Remote",
    description: "Design, development and deployment of web, mobile, desktop and AI products, from the interface to production.",
  },
};

const languages: Localized<ExperienceEntry> = {
  es: { id: "english", title: "Inglés B2", organization: "Idiomas", description: "Español nativo e inglés de nivel B2." },
  en: { id: "english", title: "English B2", organization: "Languages", description: "Native Spanish and B2-level English." },
};

const groupLabels: Localized<{ education: string; development: string; personalProject: string }> = {
  es: { education: "Educación", development: "Freelance", personalProject: "Proyecto personal" },
  en: { education: "Education", development: "Freelance", personalProject: "Personal project" },
};

/** One entry per project of data/projects.ts. */
const development = (locale: Locale): ExperienceEntry[] =>
  projects[locale].map((project) => ({
    id: `dev-${project.id}`,
    period: project.year,
    title: project.title,
    organization: project.collaborative ? projectLabels[locale].collaborative : groupLabels[locale].personalProject,
    place: project.technologies.slice(0, 3).join(", "),
    description: project.description,
  }));

const buildGroups = (locale: Locale): ExperienceGroup[] => [
  { id: "education", label: groupLabels[locale].education, entries: [...education[locale], languages[locale]] },
  { id: "development", label: groupLabels[locale].development, entries: [freelance[locale], ...development(locale)] },
];

export const experienceGroups: Localized<ExperienceGroup[]> = {
  es: buildGroups("es"),
  en: buildGroups("en"),
};
