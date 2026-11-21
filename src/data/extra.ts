import type { ExtraData } from "@/types";

// Technologies name items of data/stack.ts.
export const extra: ExtraData = {
  label: "Perfil de habilidades",
  technologiesLabel: "Tecnologías",
  wheelAria: "Habilidades",
  select: "Ver habilidad",
  previous: "Habilidad anterior",
  next: "Habilidad siguiente",
  counterSeparator: "/",
  abilities: [
    {
      id: "full-stack",
      name: "Full stack web",
      description: "Aplicaciones de escritorio y web de la interfaz a los datos, como VYRO: React, Tailwind CSS y Supabase.",
      technologies: ["React", "Next.js", "Tailwind CSS", "Supabase", "Electron"],
    },
    {
      id: "mobile",
      name: "Apps Android y Wear OS",
      description: "Aplicaciones nativas para el teléfono y el reloj, como el asistente de lectura y stateAI.",
      technologies: ["Jetpack Compose", "Android", "Wear OS", "Firebase"],
    },
    {
      id: "ai-engineering",
      name: "AI engineering",
      description: "Modelos que corren en el dispositivo y APIs de lenguaje integradas en productos reales.",
      technologies: ["TensorFlow Lite", "scikit-learn"],
    },
    {
      id: "games",
      name: "Juegos y simulación",
      description: "Roguelike con una IA adaptativa que aprende cómo juegas, hecho con Godot.",
      technologies: ["Godot"],
    },
  ],
};
