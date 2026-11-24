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

export const testimonials: Localized<Testimonial[]> = {
  es: [
    {
      id: "francisco-ruales",
      name: "Francisco Ruales",
      role: "Ingeniero de IA",
      company: "Blossom",
      quote:
        "Tuve la oportunidad de trabajar junto a Fabian en el desarrollo de FinanzIA, y puedo destacar su capacidad técnica y su mentalidad para resolver problemas reales. No se queda solo en lo que le piden: siempre propone mejoras y está pendiente de que cada detalle funcione bien.",
    },
    {
      id: "maria-jose-molina",
      name: "María José Molina",
      role: "Estudiante de medicina",
      company: "Universidad de Caldas",
      quote:
        "Colaborar con Fabian me hizo ver cómo la tecnología realmente puede facilitar nuestro trabajo en salud. Siempre está dispuesto a escuchar lo que uno necesita desde la parte médica y transformarlo en herramientas fáciles de usar.",
    },
    {
      id: "jhonny-bastidas",
      name: "Jhonny Bastidas",
      role: "Ingeniero de Sistemas",
      company: "SENA",
      quote:
        "Fabian es muy comprometido con lo que hace. He visto cómo aborda los proyectos y siempre busca que las cosas queden bien estructuradas desde el principio. Además, es un gran compañero de equipo.",
    },
  ],
  en: [
    {
      id: "francisco-ruales",
      name: "Francisco Ruales",
      role: "AI Engineer",
      company: "Blossom",
      quote:
        "I had the chance to work alongside Fabian on FinanzIA, and I can highlight his technical skill and his mindset for solving real problems. He doesn't stop at what he's asked for: he always proposes improvements and makes sure every detail works well.",
    },
    {
      id: "maria-jose-molina",
      name: "María José Molina",
      role: "Medical student",
      company: "Universidad de Caldas",
      quote:
        "Working with Fabian showed me how technology can truly make our work in healthcare easier. He is always willing to listen to what we need on the medical side and turn it into easy-to-use tools.",
    },
    {
      id: "jhonny-bastidas",
      name: "Jhonny Bastidas",
      role: "Systems Engineer",
      company: "SENA",
      quote:
        "Fabian is very committed to what he does. I've seen how he approaches projects, always making sure things are well structured from the start. He's also a great teammate.",
    },
  ],
};
