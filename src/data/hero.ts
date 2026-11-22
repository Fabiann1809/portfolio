import type { HeroData, Localized } from "@/types";
import { projectsSectionId } from "@/data/projects";

/** Language-neutral part of the hero (layout, portrait, targets); shared by every locale. */
export const heroShared = {
  displayName: "FABIAN",
  metaLabel: "// PORTFOLIO",
  copyrightYear: 2026,
  workTargetId: projectsSectionId,
  cvPath: "/cv/fabian-cv.pdf",
  portrait: {
    src: "/images/hero/portrait.webp",
    alt: "Fabian",
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
};

export const hero: Localized<HeroData> = {
  es: {
    ...heroShared,
    greeting: "Hola, soy Fabian",
    role: "Ingeniero de Software Full Stack & AI Engineering",
    roleLines: ["Ingeniero de Software", "Full Stack & AI Engineering"],
    tagline: "Diseño y desarrollo productos digitales que piensan, aprenden y resuelven problemas reales.",
    description: "Diseño y desarrollo productos digitales que piensan, aprenden y resuelven problemas reales.",
    workLabel: "Ver proyectos",
    cvLabel: "Descargar CV",
    status: {
      availability: "Disponible para oportunidades",
      city: "Túquerres / Pasto",
      timeZone: "America/Bogota",
      locale: "es",
      stage: "5.º semestre · Ing. de Software",
    },
  },
  en: {
    ...heroShared,
    greeting: "Hi, I'm Fabian",
    role: "Software Engineer Full Stack & AI Engineering",
    roleLines: ["Software Engineer", "Full Stack & AI Engineering"],
    tagline: "I design and build digital products that think, learn and solve real problems.",
    description: "I design and build digital products that think, learn and solve real problems.",
    workLabel: "View projects",
    cvLabel: "Download CV",
    status: {
      availability: "Available for opportunities",
      city: "Túquerres / Pasto",
      timeZone: "America/Bogota",
      locale: "en",
      stage: "5th semester · Software Eng.",
    },
  },
};
