import type { ArtGalleryConfig, GalleryConfig, GalleryLabels, Localized } from "@/types";

/** Language-neutral route of the gallery page (see lib/locale.ts for the localized path). */
export const galleryRoute = "/projects";

// PLACEHOLDER copy.
export const galleryLabels: Localized<GalleryLabels> = {
  es: {
    counterSeparator: "/",
    viewAll: "Ver todos los proyectos",
    backHome: "Volver al inicio",
    pageTitle: "Proyectos",
    pageDescription: "Galería de todos los proyectos",
    galleryAria: "Galería de proyectos",
    status: "Proyecto {current} de {total}",
    previous: "Proyecto anterior",
    next: "Proyecto siguiente",
    select: "Ir al proyecto",
    wheelAria: "Selector de proyectos",
    technologies: "Tecnologías",
  },
  en: {
    counterSeparator: "/",
    viewAll: "View all projects",
    backHome: "Back to home",
    pageTitle: "Projects",
    pageDescription: "Gallery of all projects",
    galleryAria: "Project gallery",
    status: "Project {current} of {total}",
    previous: "Previous project",
    next: "Next project",
    select: "Go to project",
    wheelAria: "Project selector",
    technologies: "Technologies",
  },
};

export const galleryConfig: GalleryConfig = {
  transitionMs: 700,
  cooldownMs: 600,
  reducedCooldownMs: 250,
  wheelThreshold: 30,
  wheelIdleMs: 140,
  swipeThreshold: 40,
  enterMs: 1200,
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  wheel: {
    page: { thumbWidth: 96, thumbHeight: 60, radius: 360, stepDeg: 15, scaleActive: 1.3, scaleFalloff: 0.07, lift: 14, fade: 0.28, reach: 3 },
    embedded: { thumbWidth: 64, thumbHeight: 40, radius: 220, stepDeg: 17, scaleActive: 1.3, scaleFalloff: 0.07, lift: 8, fade: 0.28, reach: 3 },
  },
};

export const artGalleryConfig: ArtGalleryConfig = {
  lens: { distortion: 0.15, chromatic: 1.1, glow: 32, tilt: 18, fadeMs: 450 },
  ring: {
    perspective: 1400,
    tiltDeg: -6,
    snapSpeed: 9,
    gap: 10,
    page: { thumbWidth: 96, thumbHeight: 60 },
    embedded: { thumbWidth: 64, thumbHeight: 40 },
  },
};
