import { Button } from "@/components/ui/Button";

interface GalleryNavProps {
  previousLabel: string;
  nextLabel: string;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/** Previous / next buttons (used where there is no wheel capture, i.e. embedded mode). */
export function GalleryNav({ previousLabel, nextLabel, canPrevious, canNext, onPrevious, onNext }: GalleryNavProps) {
  return (
    <div className="flex justify-center gap-3">
      <Button type="button" aria-label={previousLabel} disabled={!canPrevious} onClick={onPrevious} className="size-10 px-0">
        <span aria-hidden="true">←</span>
      </Button>
      <Button type="button" aria-label={nextLabel} disabled={!canNext} onClick={onNext} className="size-10 px-0">
        <span aria-hidden="true">→</span>
      </Button>
    </div>
  );
}
