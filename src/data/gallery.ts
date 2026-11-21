import type { GalleryConfig, GalleryLabels } from "@/types";

// PLACEHOLDER copy.
export const galleryRoute = "/projects";

export const galleryLabels: GalleryLabels = {
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
