import type { ArtData } from "@/types";

/**
 * PLACEHOLDER artworks: replace titles, techniques and years, and drop the images in
 * public/images/art (then set `image: "/images/art/<file>"`). Without an image a gradient is shown.
 */
export const art: ArtData = {
  id: "art",
  title: "Mi lado artístico",
  text: "Dibujar y pintar es mi forma de desconectarme y de ver el mundo de otra manera. Aquí van algunas de mis obras.",
  techniqueLabel: "Técnica",
  yearLabel: "Año",
  galleryAria: "Galería de obras",
  wheelAria: "Selector de obras",
  previous: "Obra anterior",
  next: "Obra siguiente",
  select: "Ir a la obra",
  artworks: [1, 2, 3, 4, 5, 6].map((n) => ({
    id: `art-${n}`,
    title: `PLACEHOLDER: título de la obra ${n}`,
    technique: "PLACEHOLDER: técnica",
    year: "PLACEHOLDER",
  })),
};
