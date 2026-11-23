import type { Localized, Testimonial, TestimonialsMarqueeConfig } from "@/types";

export const testimonialsTitle: Localized<string> = {
  es: "Lo que dicen quienes han trabajado conmigo",
  en: "What people who have worked with me say",
};

/** Language-neutral tuning of the marquee. */
export const testimonialsMarqueeTiming = {
  fastSpeed: 105,
  mobileSpeed: 85,
  slowSpeed: 12,
  dampingMs: 400,
  gap: 24,
};

export const testimonialsMarquee: Localized<TestimonialsMarqueeConfig> = {
  es: {
    regionLabel: "Testimonios de compañeros, docentes y clientes",
    pauseLabel: "Pausar",
    playLabel: "Reproducir",
    ...testimonialsMarqueeTiming,
  },
  en: {
    regionLabel: "Testimonials from teammates, teachers and clients",
    pauseLabel: "Pause",
    playLabel: "Play",
    ...testimonialsMarqueeTiming,
  },
};

// PLACEHOLDER content: replace names, quotes and (optionally) add `avatar` photos.
export const testimonials: Localized<Testimonial[]> = {
  es: [
    {
      id: "t-1",
      name: "PLACEHOLDER: nombre",
      role: "Compañero",
      quote: "PLACEHOLDER: cita de un compañero de equipo sobre cómo es trabajar con Fabian.",
    },
    {
      id: "t-2",
      name: "PLACEHOLDER: nombre",
      role: "Docente",
      quote: "PLACEHOLDER: cita de un docente sobre el trabajo y la constancia de Fabian.",
    },
    {
      id: "t-3",
      name: "PLACEHOLDER: nombre",
      role: "Cliente",
      quote: "PLACEHOLDER: cita de un cliente sobre el resultado de un proyecto.",
    },
  ],
  en: [
    {
      id: "t-1",
      name: "PLACEHOLDER: name",
      role: "Teammate",
      quote: "PLACEHOLDER: quote from a teammate about what it is like to work with Fabian.",
    },
    {
      id: "t-2",
      name: "PLACEHOLDER: name",
      role: "Teacher",
      quote: "PLACEHOLDER: quote from a teacher about Fabian's work and persistence.",
    },
    {
      id: "t-3",
      name: "PLACEHOLDER: name",
      role: "Client",
      quote: "PLACEHOLDER: quote from a client about the outcome of a project.",
    },
  ],
};
