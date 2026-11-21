import type { Testimonial, TestimonialsMarqueeConfig } from "@/types";

export const testimonialsTitle = "Lo que dicen quienes han trabajado conmigo";

export const testimonialsMarquee: TestimonialsMarqueeConfig = {
  regionLabel: "Testimonios de compañeros, docentes y clientes",
  pauseLabel: "Pausar",
  playLabel: "Reproducir",
  fastSpeed: 80,
  slowSpeed: 12,
  dampingMs: 400,
  gap: 24,
};

// PLACEHOLDER content: replace names, quotes and (optionally) add `avatar` photos.
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "PLACEHOLDER: nombre",
    role: "Compañero",
    quote: "PLACEHOLDER: cita de un compañero de equipo sobre cómo es trabajar con Fabián.",
  },
  {
    id: "t-2",
    name: "PLACEHOLDER: nombre",
    role: "Docente",
    quote: "PLACEHOLDER: cita de un docente sobre el trabajo y la constancia de Fabián.",
  },
  {
    id: "t-3",
    name: "PLACEHOLDER: nombre",
    role: "Cliente",
    quote: "PLACEHOLDER: cita de un cliente sobre el resultado de un proyecto.",
  },
];
