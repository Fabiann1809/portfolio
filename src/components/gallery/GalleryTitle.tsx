"use client";

import { useCrossfade } from "@/hooks/useCrossfade";
import { galleryConfig } from "@/data/gallery";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const titleClass = "col-start-1 row-start-1 font-display text-xl font-extrabold tracking-[0.1em] uppercase";

/** Active project title, uppercase, cross-fading between projects. */
export function GalleryTitle({ project, className }: { project: Project; className?: string }) {
  const { current, leaving } = useCrossfade(project, galleryConfig.transitionMs);
  return (
    <div aria-hidden="true" className={cn("grid", className)}>
      {leaving && (
        <p key={leaving.id} className={`gallery-fade-out ${titleClass}`}>
          {leaving.title}
        </p>
      )}
      <p key={current.id} className={`gallery-fade-in ${titleClass}`}>
        {current.title}
      </p>
    </div>
  );
}
