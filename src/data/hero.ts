import type { HeroData } from "@/types";
import { projectsSectionId } from "@/data/projects";

// PLACEHOLDER content: fill in name, city, time zone, year and portrait.
export const hero: HeroData = {
  displayName: "FABIÁN", // PLACEHOLDER: confirm spelling
  roleLines: ["Ingeniero de Software", "Full stack & AI"],
  metaLabel: "// PORTFOLIO",
  copyrightYear: 2026,
  tagline: "PLACEHOLDER: breve descripción de lo que haces y del tipo de proyectos que buscas.",
  description: "PLACEHOLDER: software que une ingeniería, diseño e IA. Interfaces rápidas y sistemas claros.",
  workLabel: "Ver mi trabajo",
  workTargetId: projectsSectionId,
  cvLabel: "Descargar CV",
  cvPath: "/cv/cv.pdf",
  lightLabel: "Luz",
  portrait: {
    src: "/images/hero/portrait.webp",
    alt: "Fabián",
    width: 1145,
    height: 1374,
  },
  studio: {
    nameWidthEm: 3.9, // measured: Doto 900 "FABIÁN" = 3.6em + 6 x tracking (0.05em); adjust if the font, the name or the tracking change
    nameFit: 84,
    nameTracking: 0.05,
    nameCenterY: 75,
    nameRiseEm: 0.34,
    portraitTop: 13,
    portraitHeight: 65,
    blockCenterY: 40,
    letterStaggerMs: 60,
    letterRadius: 0.22,
    letterRest: 0.6,
  },
  scene: {
    maxDpr: 1.5,
    revealSeconds: 1.8,
    grid: {
      baseCols: 9,
      cellAspect: 0.8,
      curve: 0.5,
      lineWidthPx: 1,
      lineAlpha: 0.7,
      splitThresholds: [0.1, 0.3, 0.55],
      randomSplit: 0.08,
      flicker: 0.5,
      vignette: 0.55,
      edgeFringePx: 2.2,
      lightRadius: 0.28,
      lightGain: 1.1,
      maskCols: 128,
      maskDilate: 2,
      maskBlur: 9,
    },
    mosaic: {
      cellPx: 5,
      cellScale: [0.8, 1.3],
      cellPxMobile: 4,
      gap: 0.16,
      radius: 0.22,
      contrast: 1.25,
      gamma: 0.72,
      segments: [128, 154],
      depth: 0.15,
      glitch: 1,
      fringePx: 1.6,
      bottomFade: 0.3,
      lightRadius: 0.5,
      lightGain: 0.35,
    },
    head: {
      maxYawDeg: 12,
      maxPitchDeg: 6,
      followSeconds: 0.35,
      idleSwayDeg: 3,
      focal: 1.9,
    },
  },
  status: {
    availability: "Disponible para trabajar",
    city: "Ciudad, País", // PLACEHOLDER
    timeZone: "America/Bogota", // PLACEHOLDER
    locale: "es",
    experienceSince: 2021, // PLACEHOLDER
    yearsLabel: "{years} años de experiencia",
  },
};
