import type { Project, ProjectLabels } from "@/types";

// Technologies: frameworks, libraries and tools only. Verified against each repository (Fabiann1809/*).
/** Must match the id of the Projects section (and the navigation entry). */
export const projectsSectionId = "projects";

export const projectLabels: ProjectLabels = {
  heading: "Archivos de misión",
  countLabel: "registros",
  codePrefix: "MSN",
  collaborative: "Colaboré",
  github: "GitHub",
  demo: "Demo",
  download: "APK",
  progressAria: "Progreso de proyectos",
};

export const projects: Project[] = [
  {
    id: "state-ai",
    title: "stateAI (Smartwatch)",
    description:
      "Aplicación para Wear OS que mide tu energía y concentración con la variabilidad del ritmo cardíaco. Una mascota te guía y, con pulsos hápticos, te avisa cuándo respirar o pausar.",
    technologies: ["Wear OS", "Jetpack Compose", "Room", "TensorFlow Lite", "scikit-learn"],
    collaborative: false,
    year: "2026",
    links: { github: "https://github.com/Fabiann1809/stateAI" },
  },
  {
    id: "reader",
    title: "Asistente de lectura (Android)",
    description:
      "Biblioteca personal con IA: fotografías un párrafo difícil y te lo explica con analogías cotidianas, y después te evalúa con quizzes. Tus datos se quedan en tu dispositivo.",
    technologies: ["Jetpack Compose", "Room", "ML Kit", "Readium", "Firebase", "LLM API"],
    collaborative: false,
    year: "2026",
    links: {
      github: "https://github.com/Fabiann1809/reader",
      download: "https://github.com/Fabiann1809/reader/releases/download/v0.6.0/app-release.apk",
    },
  },
  {
    id: "camino-a-casa",
    title: "Camino a casa",
    description:
      "Roguelike de mazmorras con tres escenarios y el regreso a casa como hilo narrativo. Colaboré en este juego, que integra una IA que aprende cómo juegas y reacciona.",
    technologies: ["Godot 4"],
    collaborative: true,
    year: "2026",
    links: { github: "https://github.com/Fabiann1809/isla-espejo" },
  },
  {
    id: "vyro",
    title: "VYRO",
    description:
      "Entrenador de habilidades de escritorio: observa tu técnica con la cámara y te corrige en tiempo real, con seguimiento de tu progreso. Todo se procesa en tu computador.",
    technologies: ["Electron", "React", "Tailwind CSS", "MediaPipe", "Supabase", "Zustand"],
    collaborative: false,
    year: "2026",
    links: { github: "https://github.com/Fabiann1809/vyro" },
  },
  {
    id: "fabify",
    title: "Fabify",
    description: "Proyecto práctico sobre estructuras de datos y algoritmos, centrado en una lista doblemente enlazada.",
    technologies: ["PLACEHOLDER: tecnologías"],
    collaborative: false,
    year: "2026",
    links: { github: "https://github.com/Fabiann1809" },
  },
];
