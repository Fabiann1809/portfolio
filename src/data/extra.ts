import type { ExtraData, Localized } from "@/types";

// Technologies name items of data/stack.ts (shared across languages).
const technologies = {
  "full-stack": ["React", "Next.js", "Tailwind CSS", "Supabase", "Electron"],
  mobile: ["Jetpack Compose", "Android", "Wear OS", "Firebase"],
  "ai-engineering": ["TensorFlow Lite", "scikit-learn"],
  games: ["Godot"],
};

export const extra: Localized<ExtraData> = {
  es: {
    label: "Perfil de habilidades",
    codePrefix: "PWR",
    activeLabel: "Activa",
    scanLabel: "Escáner",
    technologiesLabel: "Tecnologías",
    abilities: [
      {
        id: "full-stack",
        name: "Full stack web",
        description: "Aplicaciones de escritorio y web de la interfaz a los datos, como VYRO: React, Tailwind CSS y Supabase.",
        technologies: technologies["full-stack"],
      },
      {
        id: "mobile",
        name: "Apps Android y Wear OS",
        description: "Aplicaciones nativas para el teléfono y el reloj, como el asistente de lectura y stateAI.",
        technologies: technologies.mobile,
      },
      {
        id: "ai-engineering",
        name: "AI engineering",
        description: "Modelos que corren en el dispositivo y APIs de lenguaje integradas en productos reales.",
        technologies: technologies["ai-engineering"],
      },
      {
        id: "games",
        name: "Juegos y simulación",
        description: "Roguelike con una IA adaptativa que aprende cómo juegas, hecho con Godot.",
        technologies: technologies.games,
      },
    ],
  },
  en: {
    label: "Skills profile",
    codePrefix: "PWR",
    activeLabel: "Active",
    scanLabel: "Scanner",
    technologiesLabel: "Technologies",
    abilities: [
      {
        id: "full-stack",
        name: "Full stack web",
        description: "Desktop and web applications from the interface to the data, like VYRO: React, Tailwind CSS and Supabase.",
        technologies: technologies["full-stack"],
      },
      {
        id: "mobile",
        name: "Android and Wear OS apps",
        description: "Native apps for the phone and the watch, like the reading assistant and stateAI.",
        technologies: technologies.mobile,
      },
      {
        id: "ai-engineering",
        name: "AI engineering",
        description: "On-device models and language APIs integrated into real products.",
        technologies: technologies["ai-engineering"],
      },
      {
        id: "games",
        name: "Games and simulation",
        description: "A roguelike with an adaptive AI that learns how you play, built with Godot.",
        technologies: technologies.games,
      },
    ],
  },
};
