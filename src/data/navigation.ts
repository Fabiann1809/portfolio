import type { MenuLabels, NavItem, NavbarBrand } from "@/types";

// Ids must match the section ids in components/sections (the "extra" power profile has no nav entry).
export const navigation: NavItem[] = [
  { id: "hero", label: "Inicio" },
  { id: "about", label: "Acerca de mí" },
  { id: "projects", label: "Proyectos" },
  { id: "testimonials", label: "Testimonios" },
  { id: "experience", label: "Experiencia" },
  { id: "art", label: "Mi lado artístico" },
  { id: "contact", label: "Contacto" },
];

export const menuLabels: MenuLabels = {
  open: "Abrir menú",
  close: "Cerrar menú",
  panel: "Menú de navegación",
};

export const navbarBrand: NavbarBrand = {
  /** Small wordmark at the left of the header. */
  label: "FABIÁN",
  /** "Let's talk" link with a green status dot, before the section links. */
  cta: { label: "Hablemos", targetId: "contact" },
};
