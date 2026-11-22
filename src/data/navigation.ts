import type { Localized, MenuLabels, NavItem, NavbarBrand } from "@/types";

// Ids must match the section ids in components/sections ("extra" and "art" have no nav entry: the previous item stays highlighted while scrolling through them).
export const navigation: Localized<NavItem[]> = {
  es: [
    { id: "hero", label: "Inicio" },
    { id: "about", label: "Acerca de mí" },
    { id: "projects", label: "Proyectos" },
    { id: "testimonials", label: "Testimonios" },
    { id: "experience", label: "Experiencia" },
    { id: "contact", label: "Contacto" },
  ],
  en: [
    { id: "hero", label: "Home" },
    { id: "about", label: "About me" },
    { id: "projects", label: "Projects" },
    { id: "testimonials", label: "Testimonials" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ],
};

/** Section ids in nav order (language-neutral). */
export const navigationIds = navigation.es.map((item) => item.id);

export const menuLabels: Localized<MenuLabels> = {
  es: {
    open: "Abrir menú",
    close: "Cerrar menú",
    panel: "Menú de navegación",
    sections: "Secciones",
  },
  en: {
    open: "Open menu",
    close: "Close menu",
    panel: "Navigation menu",
    sections: "Sections",
  },
};

export const navbarBrand: Localized<NavbarBrand> = {
  es: {
    /** Small wordmark at the left of the header. */
    label: "FABIAN",
    /** "Let's talk" link with a green status dot, before the section links. */
    cta: { label: "Hablemos", targetId: "contact" },
  },
  en: {
    label: "FABIAN",
    cta: { label: "Let's talk", targetId: "contact" },
  },
};
