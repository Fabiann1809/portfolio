"use client";

import { useEffect, useRef } from "react";

interface DemoDialogProps {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title: string;
  closeLabel: string;
}

/** Full demo video in a native modal dialog (Esc, backdrop click and the close button dismiss it). */
export function DemoDialog({ open, onClose, src, poster, title, closeLabel }: DemoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      videoRef.current?.play().catch(() => {});
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) videoRef.current?.pause();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="demo-dialog m-auto w-[min(92vw,1100px)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 text-white">
          <p className="mono-label">{title}</p>
          <button type="button" onClick={onClose} className="bracket-link text-white">
            {closeLabel}
          </button>
        </div>
        <video
          ref={videoRef}
          src={open ? src : undefined}
          poster={poster}
          controls
          playsInline
          className="aspect-video w-full rounded-2xl border border-emphasis bg-black object-contain"
        />
      </div>
    </dialog>
  );
}
