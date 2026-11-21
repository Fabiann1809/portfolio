import type { HeroData } from "@/types";
import { projectsSectionId } from "@/data/projects";

// PLACEHOLDER content: fill in name, city, time zone, year and portrait.
export const hero: HeroData = {
  greeting: "Hola, soy",
  displayName: "FABIÁN", // PLACEHOLDER: confirm spelling
  role: "Ingeniero de Software full stack & AI engineering",
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
    blur: 10,
    scale: 1.04,
    skew: 2,
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
