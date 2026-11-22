import type { CSSProperties, Ref } from "react";
import type { Artwork } from "@/types";

interface ArtCardProps {
  work: Artwork;
  label: string;
  onOpen: () => void;
  eager?: boolean;
  focusable?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
}

/** Clickable artwork thumbnail (used by the cloud and the static grid). */
export function ArtCard({ work, label, onOpen, eager = false, focusable = true, buttonRef, className = "", style }: ArtCardProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      tabIndex={focusable ? 0 : -1}
      onClick={onOpen}
      style={style}
      className={`cursor-pointer overflow-hidden rounded-xl border border-foreground/20 bg-surface shadow-[0_10px_40px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) ${className}`}
    >
      {work.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={work.image}
          alt=""
          draggable={false}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover"
        />
      )}
    </button>
  );
}
