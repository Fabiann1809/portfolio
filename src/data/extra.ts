import type { ExtraData } from "@/types";

// PLACEHOLDER content. Stats are 0-100 per axis.
export const extra: ExtraData = {
  label: "Perfil de habilidades",
  codePrefix: "PWR",
  activeLabel: "Activa",
  scanLabel: "Escáner",
  technologiesLabel: "Tecnologías",
  radarAria: "Gráfico de radar de la habilidad activa",
  axes: ["Claridad", "Velocidad", "Sistemas", "Oficio", "Alcance"],
  abilities: [
    {
      id: "full-stack",
      name: "Full stack",
      description: "PLACEHOLDER: de la base de datos a la interfaz, entregando producto completo y mantenible.",
      stats: [88, 80, 90, 86, 78],
      technologies: ["React", "Next.js", "Node.js", "Tailwind CSS"],
    },
    {
      id: "ai-engineering",
      name: "AI engineering",
      description: "PLACEHOLDER: integración de modelos de lenguaje, agentes y flujos de datos en productos reales.",
      stats: [76, 70, 84, 74, 90],
      technologies: ["Vercel AI SDK", "Next.js", "Node.js"],
    },
    {
      id: "frontend",
      name: "Interfaces",
      description: "PLACEHOLDER: interfaces rápidas, accesibles y con movimiento cuidado.",
      stats: [92, 84, 70, 94, 66],
      technologies: ["React", "Next.js", "Tailwind CSS"],
    },
    {
      id: "backend",
      name: "APIs y sistemas",
      description: "PLACEHOLDER: servicios claros, bien tipados y listos para crecer.",
      stats: [82, 72, 94, 80, 70],
      technologies: ["Node.js", "Next.js"],
    },
  ],
};
