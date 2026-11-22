import type { Localized, Project, ProjectLabels } from "@/types";

// Technologies: frameworks, libraries and tools only. Verified against each repository (Fabiann1809/*).
/** Must match the id of the Projects section (and the navigation entry). */
export const projectsSectionId = "projects";

export const projectLabels: Localized<ProjectLabels> = {
  es: {
    heading: "Mis proyectos",
    countLabel: "proyectos",
    codePrefix: "MSN",
    collaborative: "Colaboré",
    github: "GitHub",
    demo: "Demo",
    download: "APK",
    progressAria: "Progreso de proyectos",
    hoverHint: "Pasa el cursor para ver la demo",
    tapHint: "Toca para ver la demo",
  },
  en: {
    heading: "My projects",
    countLabel: "projects",
    codePrefix: "MSN",
    collaborative: "Collaborated",
    github: "GitHub",
    demo: "Demo",
    download: "APK",
    progressAria: "Projects progress",
    hoverHint: "Hover to play the demo",
    tapHint: "Tap to play the demo",
  },
};

/** Language-neutral part of each project (stack, links, media, year). */
type ProjectBase = Omit<Project, "title" | "description">;

const projectBases: ProjectBase[] = [
  {
    id: "vyro",
    technologies: ["Electron", "React", "Tailwind CSS", "MediaPipe", "Supabase", "Zustand"],
    collaborative: false,
    year: "2026",
    links: { github: "https://github.com/Fabiann1809/vyro" },
  },
  {
    id: "reader",
    image: "/images/projects/reader-poster.jpg",
    video: "/videos/projects/reader-demo.mp4",
    technologies: ["Jetpack Compose", "Room", "ML Kit", "Readium", "Firebase", "LLM API"],
    collaborative: false,
    year: "2026",
    links: {
      github: "https://github.com/Fabiann1809/reader",
      download: "https://github.com/Fabiann1809/reader/releases/download/v0.6.0/app-release.apk",
    },
  },
  {
    id: "state-ai",
    technologies: ["Wear OS", "Jetpack Compose", "Room", "TensorFlow Lite", "scikit-learn"],
    collaborative: false,
    year: "2026",
    links: { github: "https://github.com/Fabiann1809/stateAI" },
    image: "/images/projects/stateai-poster.jpg",
    video: "/videos/projects/stateai-demo.mp4",
  },
  {
    id: "isla-espejo",
    technologies: ["Godot 4"],
    collaborative: true,
    year: "2026",
    links: { github: "https://github.com/Fabiann1809/isla-espejo" },
  },
  {
    id: "finanzia",
    image: "/images/projects/finanzia-poster.jpg",
    video: "/videos/projects/finanzia-demo.mp4",
    technologies: ["Next.js", "React", "Tailwind CSS", "Spring Boot", "PostgreSQL", "LangGraph"],
    collaborative: true,
    year: "2026",
    links: {
      github: "https://github.com/Proyecto-final-4",
      repos: [
        { label: "Frontend", url: "https://github.com/Proyecto-final-4/frontend" },
        { label: "Backend", url: "https://github.com/Proyecto-final-4/backend" },
        { label: "IA", url: "https://github.com/Proyecto-final-4/finanzIA-agent" },
      ],
      vercel: "https://frontend-sooty-five-52.vercel.app",
    },
  },
];

const projectTexts: Localized<Record<string, { title: string; description: string }>> = {
  es: {
    vyro: {
      title: "VYRO",
      description:
        "Entrenador de habilidades de escritorio: observa tu técnica con la cámara y te corrige en tiempo real, con seguimiento de tu progreso. Todo se procesa en tu computador.",
    },
    reader: {
      title: "Asistente de lectura (Android)",
      description:
        "Biblioteca personal con IA: fotografías un párrafo difícil y te lo explica con analogías cotidianas, y después te evalúa con quizzes. Tus datos se quedan en tu dispositivo.",
    },
    "state-ai": {
      title: "stateAI (Smartwatch)",
      description:
        "Aplicación para Wear OS que mide tu energía y concentración con la variabilidad del ritmo cardíaco. Una mascota te guía y, con pulsos hápticos, te avisa cuándo respirar o pausar.",
    },
    "isla-espejo": {
      title: "Isla Espejo",
      description:
        "Roguelike de mazmorras con tres escenarios y el regreso a casa como hilo narrativo. Colaboré en este juego, que integra una IA que aprende cómo juegas y reacciona.",
    },
    finanzia: {
      title: "finanzIA",
      description:
        "Asistente financiero personal con chat: registra y consulta tus ingresos y gastos conversando con un agente de IA. Colaboré en esta plataforma dividida en interfaz web, API segura con búsqueda semántica y el agente.",
    },
  },
  en: {
    vyro: {
      title: "VYRO",
      description:
        "Desktop skills trainer: it watches your technique through the camera and corrects you in real time, tracking your progress. Everything is processed on your computer.",
    },
    reader: {
      title: "Reading Assistant (Android)",
      description:
        "A personal library with AI: photograph a hard paragraph and it explains it with everyday analogies, then tests you with quizzes. Your data stays on your device.",
    },
    "state-ai": {
      title: "stateAI (Smartwatch)",
      description:
        "A Wear OS app that measures your energy and focus using heart rate variability. A mascot guides you and, with haptic pulses, tells you when to breathe or take a break.",
    },
    "isla-espejo": {
      title: "Isla Espejo",
      description:
        "A dungeon roguelike with three settings and the journey back home as its narrative thread. I collaborated on this game, which features an AI that learns how you play and reacts.",
    },
    finanzia: {
      title: "finanzIA",
      description:
        "A personal finance assistant with chat: record and query your income and expenses by talking to an AI agent. I collaborated on this platform, split into a web interface, a secure API with semantic search, and the agent.",
    },
  },
};

const buildProjects = (locale: keyof typeof projectTexts): Project[] =>
  projectBases.map((base) => ({ ...base, ...projectTexts[locale][base.id] }));

export const projects: Localized<Project[]> = {
  es: buildProjects("es"),
  en: buildProjects("en"),
};
