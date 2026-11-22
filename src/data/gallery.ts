import type { ArtCloudConfig, GalleryConfig, GalleryLabels, Localized } from "@/types";

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

export const artCloudConfig: ArtCloudConfig = {
  perspective: 1200,
  seed: 20240611,
  scrollDeg: 340,
  idleDegPerSec: 4,
  scrollEase: 6,
  openEnd: 0.22,
  closeStart: 0.78,
  minOpacity: 0.32,
  eagerCount: 4,
  tilt: { maxDeg: 14, stiffness: 80, damping: 12, parallax: 0.35 },
  desktop: { count: 14, unitVh: 0.22, unitVw: 0.2, spreadX: 2.7, spreadY: 1.15, spreadZ: 2.4, trackScreens: 3.2 },
  mobile: { count: 8, unitVh: 0.19, unitVw: 0.33, spreadX: 1.05, spreadY: 1.5, spreadZ: 1.6, trackScreens: 2.4 },
};
