import type { ArtData, Localized } from "@/types";

/**
 * PLACEHOLDER artworks: replace titles, techniques and years, and drop the images in
 * public/images/art (then set `image: "/images/art/<file>"`). Without an image a gradient is shown.
 */
const artworkNumbers = [1, 2, 3, 4, 5, 6];

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
    artworks: artworkNumbers.map((n) => ({
      id: `art-${n}`,
      title: `PLACEHOLDER: título de la obra ${n}`,
      technique: "PLACEHOLDER: técnica",
      year: "PLACEHOLDER",
    })),
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
    artworks: artworkNumbers.map((n) => ({
      id: `art-${n}`,
      title: `PLACEHOLDER: artwork title ${n}`,
      technique: "PLACEHOLDER: technique",
      year: "PLACEHOLDER",
    })),
  },
};
