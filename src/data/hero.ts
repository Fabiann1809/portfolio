import type { HeroData } from "@/types";
import { projectsSectionId } from "@/data/projects";

// PLACEHOLDER content: fill in name, city, time zone, year and portrait.
export const hero: HeroData = {
  greeting: "Hola, soy",
  name: "Nombre Apellido",
  displayName: "FABIÁN", // PLACEHOLDER: confirm spelling
  roleLines: ["Ingeniero de Software", "Full stack & AI"],
  tagline: "PLACEHOLDER: breve descripción de lo que haces y del tipo de proyectos que buscas.",
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
    nameWidthEm: 3.66, // measured: Doto 900 "FABIÁN" = 3.6em + tracking; adjust if the font or the name changes
    nameFit: 90,
    introClearancePx: 250,
    nameRiseEm: 0.27,
    nameCenterY: 60,
    nameTracking: 0.01,
    letterStaggerMs: 60,
    letterRadius: 0.22,
    letterRest: 0.55,
    parallax: { wall: 6, name: 10, person: 16 },
    keyLight: { radius: 60, strength: 0.9 },
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
