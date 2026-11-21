import type { HeroData } from "@/types";
import { projectsSectionId } from "@/data/projects";

// PLACEHOLDER content: fill in name, city, time zone, year and portrait.
export const hero: HeroData = {
  greeting: "Hola, soy",
  displayName: "FABIÁN", // PLACEHOLDER: confirm spelling
  role: "Ingeniero de Software full stack & AI engineering",
  lightLabel: "Luz",
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
  portraitShadow: {
    baseX: -34,
    baseY: -14,
    travelX: 70,
    travelY: 40,
    maxOffset: 90,
    blurMin: 6,
    blurMax: 14,
    scale: 1.04,
    skewBase: 2,
    skewPer100: 3,
  },
  studio: {
    portraitHeight: 78,
    blockCenterY: 50,
    photoBottomFade: 0.28,
    photoScanAlpha: 0.04,
    photoVignette: 0.22,
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
