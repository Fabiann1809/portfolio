import type { HeroData } from "@/types";
import { projectsSectionId } from "@/data/projects";

export const hero: HeroData = {
  greeting: "Hola, soy Fabián",
  displayName: "FABIÁN",
  role: "Ingeniería de Software Full Stack & AI Engineering",
  roleLines: ["Ingeniería de Software", "Full Stack & AI Engineering"],
  metaLabel: "// PORTFOLIO",
  copyrightYear: 2026,
  tagline: "Diseño y desarrollo productos digitales que piensan, aprenden y resuelven problemas reales.",
  description: "Diseño y desarrollo productos digitales que piensan, aprenden y resuelven problemas reales.",
  workLabel: "Ver proyectos",
  workTargetId: projectsSectionId,
  cvLabel: "Descargar CV",
  cvPath: "/cv/fabian-cv.pdf",
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
    availability: "Disponible para oportunidades",
    city: "Túquerres / Pasto",
    timeZone: "America/Bogota",
    locale: "es",
    stage: "5.º semestre · Ing. de Software",
  },
};
