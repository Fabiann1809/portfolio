import type { MenuLabels, NavItem, NavbarBrand } from "@/types";

// Ids must match the section ids in components/sections ("extra" and "art" have no nav entry: the previous item stays highlighted while scrolling through them).
export const navigation: NavItem[] = [
  { id: "hero", label: "Inicio" },
  { id: "about", label: "Acerca de mí" },
  { id: "projects", label: "Proyectos" },
  { id: "testimonials", label: "Testimonios" },
  { id: "experience", label: "Experiencia" },
  { id: "contact", label: "Contacto" },
];

export const menuLabels: MenuLabels = {
  open: "Abrir menú",
  close: "Cerrar menú",
  panel: "Menú de navegación",
};

export const navbarBrand: NavbarBrand = {
  /** Small wordmark at the left of the header. */
  label: "FABIAN",
  /** "Let's talk" link with a green status dot, before the section links. */
  cta: { label: "Hablemos", targetId: "contact" },
};
