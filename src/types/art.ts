export interface Artwork {
  id: string;
  title: string;
  /** Technique (e.g. "Óleo sobre lienzo"). */
  technique: string;
  year: string;
  /** Optional image path under public/images/art. */
  image?: string;
  /** Width / height of the image; cards take this shape (square when missing). */
  aspect?: number;
}

export interface ArtData {
  /** Section id and nav target. */
  id: string;
  title: string;
  text: string;
  techniqueLabel: string;
  yearLabel: string;
  /** Accessible name of the artwork cloud. */
  galleryAria: string;
  /** Screen-reader description of the cloud (there are no visible captions). */
  description: string;
  /** Prefix of a card accessible name, followed by the artwork title. */
  openArtwork: string;
  /** Close button of the enlarged-artwork dialog. */
  close: string;
  artworks: Artwork[];
}
