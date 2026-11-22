import { ArtCard } from "@/components/art/ArtCard";
import type { ArtData } from "@/types";

interface ArtGridProps {
  art: ArtData;
  onOpen: (index: number) => void;
}

/** Static responsive grid of the artworks (reduced motion: no pinning, no rotation). */
export function ArtGrid({ art, onOpen }: ArtGridProps) {
  return (
    <ul className="mt-12 grid grid-cols-2 items-start gap-4 md:grid-cols-4" aria-label={art.galleryAria}>
      {art.artworks.map((work, i) => (
        <li key={work.id}>
          <ArtCard
            work={work}
            label={`${art.openArtwork} ${work.title}`}
            onOpen={() => onOpen(i)}
            eager={i < 4}
            className="block w-full"
            style={{ aspectRatio: String(work.aspect ?? 1) }}
          />
        </li>
      ))}
    </ul>
  );
}
