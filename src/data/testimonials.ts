import type { Testimonial, TestimonialsMarqueeConfig } from "@/types";

export const testimonialsTitle = "Testimonios";

export const testimonialsMarquee: TestimonialsMarqueeConfig = {
  regionLabel: "Testimonios de clientes y colegas",
  pauseLabel: "Pausar",
  playLabel: "Reproducir",
  fastSpeed: 80,
  slowSpeed: 12,
  dampingMs: 400,
  gap: 24,
};

// PLACEHOLDER content: replace names, companies and quotes with real ones.
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Cliente Ejemplo",
    role: "Directora de Producto",
    company: "Empresa Uno",
    quote: "PLACEHOLDER: Entregó el proyecto antes de lo previsto y con una calidad que superó lo que esperábamos.",
  },
  {
    id: "t-2",
    name: "Colega Ejemplo",
    role: "Tech Lead",
    company: "Empresa Dos",
    quote: "PLACEHOLDER: Un perfil muy completo, cuida cada detalle y comunica con claridad en todo momento.",
  },
  {
    id: "t-3",
    name: "Fundador Ejemplo",
    role: "CEO",
    company: "Startup Tres",
    quote: "PLACEHOLDER: Convirtió una idea difusa en un producto sólido. Volvería a trabajar con él sin dudarlo.",
  },
  {
    id: "t-4",
    name: "Diseñadora Ejemplo",
    role: "Product Designer",
    company: "Estudio Cuatro",
    quote: "PLACEHOLDER: Entiende el diseño y lo implementa fielmente. La colaboración fue fluida y muy agradable.",
  },
  {
    id: "t-5",
    name: "Gerente Ejemplo",
    role: "Gerente de Proyectos",
    company: "Agencia Cinco",
    quote: "PLACEHOLDER: Proactivo, ordenado y siempre atento a los plazos. Un gran activo para cualquier equipo.",
  },
  {
    id: "t-6",
    name: "Cliente Ejemplo Dos",
    role: "Director de Marketing",
    company: "Marca Seis",
    quote: "PLACEHOLDER: El nuevo sitio mejoró nuestras conversiones desde la primera semana. Excelente trabajo.",
  },
];
