export interface Artwork {
  id: string;
  title: string;
  /** Technique (e.g. "Óleo sobre lienzo"). */
  technique: string;
  year: string;
  /** Optional image path under public/images/art. Without it a generated gradient is shown. */
  image?: string;
}

export interface ArtData {
  /** Section id and nav target. */
  id: string;
  title: string;
  text: string;
  techniqueLabel: string;
  yearLabel: string;
  artworks: Artwork[];
}
