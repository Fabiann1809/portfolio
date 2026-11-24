import type { AboutData, Localized } from "@/types";

export const about: Localized<AboutData> = {
  es: {
    label: "Sobre mí",
    statement: [
      { text: "Soy estudiante de Ingeniería de Software enfocado en " },
      { text: "desarrollo full stack", emphasis: true },
      { text: " e " },
      { text: "inteligencia artificial", emphasis: true },
      { text: ". Disfruto convertir ideas y problemas reales en productos digitales prácticos." },
    ],
    paragraphs: [
      "Trabajo de punta a punta: interfaces web con React y Next.js, APIs con Spring Boot y NestJS, bases de datos relacionales y no relacionales, apps nativas para Android y Wear OS, y agentes de IA con LangGraph y LangChain. Desde 2024 desarrollo proyectos como freelance, y he construido desde un asistente financiero conversacional hasta modelos de machine learning que corren en el dispositivo.",
      "Mi trabajo ha sido reconocido con la beca al mejor promedio de la carrera, y soy monitor académico del programa. Me formé como técnico en programación en el SENA y fui ponente en dos encuentros nacionales de RedCOLSI. Fuera del código dibujo, pinto y practico deporte, y esa misma constancia es la que llevo a cada proyecto.",
    ],
    timeline: [
      { id: "step-1", place: "Túquerres", period: "Origen" },
      { id: "step-2", place: "SENA", period: "Técnico en Programación" },
      { id: "step-3", place: "Pasto · UCC", period: "Ingeniería de Software" },
      { id: "step-4", place: "Full stack & AI", period: "Hoy" },
    ],
    stackTitle: "Tecnologías con las que trabajo",
  },
  en: {
    label: "About me",
    statement: [
      { text: "I'm a Software Engineering student focused on " },
      { text: "full stack development", emphasis: true },
      { text: " and " },
      { text: "artificial intelligence", emphasis: true },
      { text: ". I enjoy turning ideas and real-world problems into practical digital products." },
    ],
    paragraphs: [
      "I work end to end: web interfaces with React and Next.js, APIs with Spring Boot and NestJS, relational and non-relational databases, native Android and Wear OS apps, and AI agents with LangGraph and LangChain. I've been building projects as a freelancer since 2024, from a conversational finance assistant to machine learning models that run on-device.",
      "My work has been recognized with the scholarship for the highest GPA in my program, and I'm a teaching assistant for the program. I trained as a programming technician at SENA and was a speaker at two RedCOLSI national meetings. Outside of code I draw, paint and play sports, and that same persistence is what I bring to every project.",
    ],
    timeline: [
      { id: "step-1", place: "Túquerres", period: "Origin" },
      { id: "step-2", place: "SENA", period: "Programming Technician" },
      { id: "step-3", place: "Pasto · UCC", period: "Software Engineering" },
      { id: "step-4", place: "Full stack & AI", period: "Today" },
    ],
    stackTitle: "Technologies I work with",
  },
};
