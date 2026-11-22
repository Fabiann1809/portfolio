export interface Artwork {
  id: string;
  title: string;
  /** Technique (e.g. "Óleo sobre lienzo"). */
  technique: string;
  year: string;
  /** Optional image path under public/images/art. Without it a generated gradient is shown. */
  image?: string;
  /** Width / height of the image; the lens takes this shape (16/10 when missing). */
  aspect?: number;
}

export interface ArtData {
  /** Section id and nav target. */
  id: string;
  title: string;
  text: string;
  techniqueLabel: string;
  yearLabel: string;
  /** Accessible labels of the artwork wheel. */
  galleryAria: string;
  wheelAria: string;
  /** Prefix of a thumbnail accessible name, followed by the artwork title. */
  select: string;
  artworks: Artwork[];
}
