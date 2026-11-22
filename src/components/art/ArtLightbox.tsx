"use client";

import { useEffect, useRef } from "react";
import type { Artwork } from "@/types";

interface ArtLightboxProps {
  work: Artwork;
  open: boolean;
  onClose: () => void;
  closeLabel: string;
}

/** Enlarged artwork in a native modal dialog (Esc, backdrop click and the close button dismiss it). */
export function ArtLightbox({ work, open, onClose, closeLabel }: ArtLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={work.title}
      onClose={onClose}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target === event.currentTarget || target.dataset.backdrop !== undefined) onClose();
      }}
      className="m-auto size-full max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      <div data-backdrop="" className="flex size-full flex-col items-center justify-center gap-4 p-4 md:p-8">
        <button type="button" onClick={onClose} className="bracket-link self-end text-white">
          {closeLabel}
        </button>
        {work.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={work.image} alt={work.title} className="min-h-0 max-w-full flex-1 object-contain" />
        )}
      </div>
    </dialog>
  );
}
