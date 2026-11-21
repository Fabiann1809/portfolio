import type { ExtraData } from "@/types";

// Stats are 0-100 per axis (radar shape only). Technologies name items of data/stack.ts.
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
      name: "Full stack web",
      description: "Aplicaciones de escritorio y web de la interfaz a los datos, como VYRO: React, Tailwind CSS y Supabase.",
      stats: [84, 78, 86, 82, 76],
      technologies: ["React", "Next.js", "Tailwind CSS", "Supabase", "Electron"],
    },
    {
      id: "mobile",
      name: "Apps Android y Wear OS",
      description: "Aplicaciones nativas para el teléfono y el reloj, como el asistente de lectura y stateAI.",
      stats: [80, 74, 78, 84, 70],
      technologies: ["Jetpack Compose", "Android", "Wear OS", "Firebase"],
    },
    {
      id: "ai-engineering",
      name: "AI engineering",
      description: "Modelos que corren en el dispositivo y APIs de lenguaje integradas en productos reales.",
      stats: [74, 70, 82, 72, 88],
      technologies: ["TensorFlow Lite", "scikit-learn"],
    },
    {
      id: "games",
      name: "Juegos y simulación",
      description: "Roguelike con una IA adaptativa que aprende cómo juegas, hecho con Godot.",
      stats: [78, 72, 80, 84, 68],
      technologies: ["Godot"],
    },
  ],
};
