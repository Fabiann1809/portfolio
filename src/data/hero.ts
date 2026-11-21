import type { HeroData } from "@/types";
import { projectsSectionId } from "@/data/projects";

// PLACEHOLDER content: fill in name, city, time zone, year and portrait.
export const hero: HeroData = {
  greeting: "Hola, soy",
  name: "Nombre Apellido",
  displayName: "FABIÁN", // PLACEHOLDER: confirm spelling
  role: "Ingeniero de Software full stack & AI engineering",
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
  status: {
    availability: "Disponible para trabajar",
    city: "Ciudad, País", // PLACEHOLDER
    timeZone: "America/Bogota", // PLACEHOLDER
    locale: "es",
    experienceSince: 2021, // PLACEHOLDER
    yearsLabel: "{years} años de experiencia",
  },
};
