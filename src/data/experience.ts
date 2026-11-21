import type { ExperienceEntry, ExperienceType } from "@/types";

// PLACEHOLDER content.
export const experienceTitle = "Experiencia";

export const experienceTypeLabels: Record<ExperienceType, string> = {
  freelance: "Freelance",
  "full-time": "Tiempo completo",
  "part-time": "Medio tiempo",
  internship: "Prácticas",
};

export const experience: ExperienceEntry[] = [
  {
    id: "exp-1",
    type: "freelance",
    role: "Desarrollador Web",
    company: "Independiente",
    period: "2024 - Presente",
    description: "PLACEHOLDER: sitios y aplicaciones a medida para clientes, de la idea al despliegue.",
  },
  {
    id: "exp-2",
    type: "internship",
    role: "Desarrollador Junior",
    company: "Empresa de ejemplo",
    period: "2023 - 2024",
    description: "PLACEHOLDER: descripción de responsabilidades y logros.",
  },
];
