import type { ArtData, Localized } from "@/types";

/** Language-neutral part of each artwork (photo in public/images/art). Years are still PLACEHOLDER. */
const artworkBases = [1, 2, 3, 4].map((n) => ({ id: `art-${n}`, image: `/images/art/art-${n}.jpg`, year: "PLACEHOLDER" }));

const artworkTexts = {
  es: [
    { title: "Retrato geométrico", technique: "Pintura sobre fondo negro" },
    { title: "Native", technique: "Pintura sobre fondo negro" },
    { title: "Estudios de rostros", technique: "Bolígrafo sobre papel" },
    { title: "Retrato en azul", technique: "Bolígrafo sobre papel" },
  ],
  en: [
    { title: "Geometric portrait", technique: "Paint on black ground" },
    { title: "Native", technique: "Paint on black ground" },
    { title: "Face studies", technique: "Ballpoint pen on paper" },
    { title: "Portrait in blue", technique: "Ballpoint pen on paper" },
  ],
};

export const art: Localized<ArtData> = {
  es: {
    id: "art",
    title: "Mi lado artístico",
    text: "Dibujar y pintar es mi forma de desconectarme y de ver el mundo de otra manera. Aquí van algunas de mis obras.",
    techniqueLabel: "Técnica",
    yearLabel: "Año",
    galleryAria: "Galería de obras",
    wheelAria: "Selector de obras",
    select: "Ir a la obra",
    artworks: artworkBases.map((base, i) => ({ ...base, ...artworkTexts.es[i] })),
  },
  en: {
    id: "art",
    title: "My artistic side",
    text: "Drawing and painting is my way of disconnecting and seeing the world differently. Here are some of my works.",
    techniqueLabel: "Technique",
    yearLabel: "Year",
    galleryAria: "Artwork gallery",
    wheelAria: "Artwork selector",
    select: "Go to artwork",
    artworks: artworkBases.map((base, i) => ({ ...base, ...artworkTexts.en[i] })),
  },
};
