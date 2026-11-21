import type { MenuLabels, NavItem } from "@/types";

// PLACEHOLDER content. Ids must match the section ids in components/sections.
export const navigation: NavItem[] = [
  { id: "hero", label: "Inicio" },
  { id: "about", label: "Sobre mí" },
  { id: "projects", label: "Proyectos" },
  { id: "testimonials", label: "Testimonios" },
  { id: "experience", label: "Experiencia" },
  { id: "education", label: "Educación" },
  { id: "extra", label: "Extra" },
  { id: "contact", label: "Contacto" },
];

export const menuLabels: MenuLabels = {
  open: "Abrir menú",
  close: "Cerrar menú",
  panel: "Menú de navegación",
};
