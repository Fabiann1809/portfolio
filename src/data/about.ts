import type { AboutData } from "@/types";

// PLACEHOLDER content.
export const about: AboutData = {
  label: "Historia de origen",
  statement: [
    { text: "PLACEHOLDER: empecé escribiendo código por curiosidad y terminé construyendo " },
    { text: "productos que la gente usa", emphasis: true },
    { text: ". Hoy diseño y desarrollo software full stack con foco en " },
    { text: "inteligencia artificial", emphasis: true },
    { text: ", cuidando cada detalle de la experiencia." },
  ],
  timeline: [
    { id: "step-1", place: "Ciudad natal", period: "Origen" },
    { id: "step-2", place: "Universidad", period: "2020" },
    { id: "step-3", place: "Primer proyecto", period: "2022" },
    { id: "step-4", place: "Freelance", period: "2024" },
    { id: "step-5", place: "Hoy", period: "2026" },
  ],
  facts: [
    { label: "Ubicación", value: "PLACEHOLDER: Ciudad, País" },
    { label: "Fuera de la tecnología", value: "PLACEHOLDER: hobbies, deporte, música, lecturas." },
  ],
  stackTitle: "Stack",
};
