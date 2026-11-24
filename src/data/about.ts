import type { AboutData, Localized } from "@/types";

export const about: Localized<AboutData> = {
  es: {
    label: "Sobre mí",
    statement: [
      { text: "Soy estudiante de Ingeniería de Software enfocado en " },
      { text: "desarrollo full stack", emphasis: true },
      { text: " e " },
      { text: "inteligencia artificial", emphasis: true },
      { text: ". Disfruto convertir ideas y problemas reales en productos digitales prácticos. Me gusta construir de punta a punta, de la interfaz al modelo de IA, cuidando que cada detalle funcione bien. Desde 2024 lo hago como freelance, con proyectos que van de un asistente financiero conversacional a modelos que corren en el dispositivo." },
    ],
    paragraphs: [
      "Mi trabajo ha sido reconocido con la beca al mejor promedio de la carrera, soy monitor académico del programa y fui ponente en dos encuentros nacionales de RedCOLSI. Fuera del código dibujo y pinto: un lienzo en blanco me relaja y me reta a la vez, y es mi forma de desconectarme y de ver las cosas desde otro ángulo (varias obras están en \"Mi lado artístico\"). Esa misma atención al detalle es la que llevo a cada proyecto.",
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
      { text: ". I enjoy turning ideas and real-world problems into practical digital products. I like building end to end, from the interface to the AI model, making sure every detail works well. I've done it as a freelancer since 2024, with projects ranging from a conversational finance assistant to models that run on-device." },
    ],
    paragraphs: [
      "My work has been recognized with the scholarship for the highest GPA in my program; I'm a teaching assistant for the program and was a speaker at two RedCOLSI national meetings. Outside of code I draw and paint: a blank canvas relaxes and challenges me at once, and it's how I unplug and see things from another angle (several works are in \"My artistic side\"). That same attention to detail is what I bring to every project.",
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
