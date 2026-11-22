import type { Ability, ExtraData, Localized } from "@/types";

// Technologies name items of data/stack.ts (shared across languages). Verified against the repositories of Fabiann1809 and Proyecto-final-4.
const technologies = {
  frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "Framer Motion", "Three.js", "Zod", "Vitest"],
  backend: ["Spring Boot", "Java", "NestJS", "Node.js", "TypeORM", "Supabase", "Docker", "AWS Lambda", "Jest"],
  databases: ["PostgreSQL", "MySQL", "SQL", "MongoDB", "Supabase", "Firebase"],
  ai: ["LangGraph", "LangChain", "LangSmith", "AWS Bedrock", "Spring AI", "OpenAI", "Claude API"],
  ml: ["TensorFlow", "TensorFlow Lite", "scikit-learn", "pandas", "NumPy", "SciPy", "Jupyter", "MediaPipe", "Python", "Streamlit"],
  mobile: ["Kotlin", "Jetpack Compose", "Android", "Wear OS", "Firebase"],
  desktop: ["Electron", "Godot", "TypeScript", "Git"],
};

type Copy = Record<keyof typeof technologies, { name: string; description: string }>;

const copy: Localized<Copy> = {
  es: {
    frontend: {
      name: "Frontend",
      description: "Interfaces web modernas y animadas con React y Next.js, tipadas con TypeScript, validadas con Zod y probadas con Vitest.",
    },
    backend: {
      name: "Backend",
      description: "APIs REST seguras con Spring Boot (JWT, JPA, Flyway) y NestJS con TypeORM, contenedores con Docker y funciones serverless en AWS Lambda.",
    },
    databases: {
      name: "Bases de datos",
      description: "Relacionales como PostgreSQL (con pgvector para búsqueda semántica) y MySQL, y no relacionales como MongoDB y Firebase.",
    },
    ai: {
      name: "IA y agentes",
      description: "Agentes conversacionales con LangGraph y LangChain, trazados con LangSmith, y modelos de lenguaje vía AWS Bedrock, OpenAI y Claude.",
    },
    ml: {
      name: "Machine learning",
      description: "Modelos entrenados en Python con TensorFlow y scikit-learn, exportados a TensorFlow Lite para correr en el dispositivo, y visión por computadora con MediaPipe.",
    },
    mobile: {
      name: "Android y Wear OS",
      description: "Apps nativas en Kotlin con Jetpack Compose para el teléfono y el reloj, con Room, CameraX, ML Kit y Health Services.",
    },
    desktop: {
      name: "Escritorio y juegos",
      description: "Apps de escritorio con Electron y un roguelike en Godot con una IA que aprende cómo juegas.",
    },
  },
  en: {
    frontend: {
      name: "Frontend",
      description: "Modern, animated web interfaces with React and Next.js, typed with TypeScript, validated with Zod and tested with Vitest.",
    },
    backend: {
      name: "Backend",
      description: "Secure REST APIs with Spring Boot (JWT, JPA, Flyway) and NestJS with TypeORM, containers with Docker and serverless functions on AWS Lambda.",
    },
    databases: {
      name: "Databases",
      description: "Relational ones like PostgreSQL (with pgvector for semantic search) and MySQL, and non-relational ones like MongoDB and Firebase.",
    },
    ai: {
      name: "AI and agents",
      description: "Conversational agents with LangGraph and LangChain, traced with LangSmith, and language models through AWS Bedrock, OpenAI and Claude.",
    },
    ml: {
      name: "Machine learning",
      description: "Models trained in Python with TensorFlow and scikit-learn, exported to TensorFlow Lite to run on-device, and computer vision with MediaPipe.",
    },
    mobile: {
      name: "Android and Wear OS",
      description: "Native Kotlin apps with Jetpack Compose for the phone and the watch, with Room, CameraX, ML Kit and Health Services.",
    },
    desktop: {
      name: "Desktop and games",
      description: "Desktop apps with Electron and a Godot roguelike with an AI that learns how you play.",
    },
  },
};

const abilities = (locale: "es" | "en"): Ability[] =>
  (Object.keys(technologies) as (keyof typeof technologies)[]).map((id) => ({
    id,
    ...copy[locale][id],
    technologies: technologies[id],
  }));

export const extra: Localized<ExtraData> = {
  es: {
    label: "Perfil de habilidades",
    codePrefix: "PWR",
    activeLabel: "Activa",
    scanLabel: "Escáner",
    technologiesLabel: "Tecnologías",
    abilities: abilities("es"),
  },
  en: {
    label: "Skills profile",
    codePrefix: "PWR",
    activeLabel: "Active",
    scanLabel: "Scanner",
    technologiesLabel: "Technologies",
    abilities: abilities("en"),
  },
};
