import type { ArtData, Localized } from "@/types";

/** Language-neutral part of each artwork (photo in public/images/art). Years are still PLACEHOLDER. */
const artworkAspects = [1098 / 1322, 1138 / 1444, 1280 / 940, 1600 / 1116, 1280 / 932, 1280 / 1014, 1600 / 1200, 1200 / 1600, 1600 / 1200];
const artworkBases = artworkAspects.map((aspect, i) => ({
  id: `art-${i + 1}`,
  image: `/images/art/art-${i + 1}.jpg`,
  aspect,
  year: "PLACEHOLDER",
}));

const artworkTexts = {
  es: [
    { title: "Retrato geométrico", technique: "Pintura sobre fondo negro" },
    { title: "Native", technique: "Pintura sobre fondo negro" },
    { title: "Estudios de rostros", technique: "Bolígrafo sobre papel" },
    { title: "Retrato en azul", technique: "Bolígrafo sobre papel" },
    { title: "Autorretrato, versión de Van Gogh", technique: "Pintura" },
    { title: "La noche estrellada, versión", technique: "Pintura" },
    { title: "Gato y mariposa", technique: "Pintura sobre fondo negro" },
    { title: "Mirada felina", technique: "Pintura sobre fondo negro" },
    { title: "Labios y mariposa", technique: "Pintura" },
  ],
  en: [
    { title: "Geometric portrait", technique: "Paint on black ground" },
    { title: "Native", technique: "Paint on black ground" },
    { title: "Face studies", technique: "Ballpoint pen on paper" },
    { title: "Portrait in blue", technique: "Ballpoint pen on paper" },
    { title: "Self-portrait, after Van Gogh", technique: "Paint" },
    { title: "The Starry Night, my version", technique: "Paint" },
    { title: "Cat and butterfly", technique: "Paint on black ground" },
    { title: "Feline gaze", technique: "Paint on black ground" },
    { title: "Lips and butterfly", technique: "Paint" },
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
    description: "Nube de obras que gira al hacer scroll. Pulsa una obra para verla en grande.",
    openArtwork: "Ver en grande",
    close: "Cerrar",
    artworks: artworkBases.map((base, i) => ({ ...base, ...artworkTexts.es[i] })),
  },
  en: {
    id: "art",
    title: "My artistic side",
    text: "Drawing and painting is my way of disconnecting and seeing the world differently. Here are some of my works.",
    techniqueLabel: "Technique",
    yearLabel: "Year",
    galleryAria: "Artwork gallery",
    description: "Cloud of artworks that turns as you scroll. Select an artwork to view it larger.",
    openArtwork: "View larger",
    close: "Close",
    artworks: artworkBases.map((base, i) => ({ ...base, ...artworkTexts.en[i] })),
  },
};
