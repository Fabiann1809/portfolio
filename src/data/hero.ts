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
  portrait: {
    src: "/images/hero/portrait.webp",
    alt: "Fabián",
    width: 1145,
    height: 1374,
  },
  studio: {
    portraitHeight: 78,
    blockCenterY: 50,
    photoBottomFade: 0.28,
    photoScanAlpha: 0.04,
    photoVignette: 0.22,
  },
  screen: {
    nameFit: 84,
    nameTracking: 0.05,
    nameCenterY: 75,
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
      gap: 0.16,
      contrast: 1.25,
      gamma: 0.72,
      bottomFade: 0.3,
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
