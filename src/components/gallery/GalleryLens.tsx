"use client";

import { useCrossfade } from "@/hooks/useCrossfade";
import { galleryConfig } from "@/data/gallery";
import { ProjectMedia } from "./ProjectMedia";
import type { Project } from "@/types";

/**
 * Central "lens": rounded, bulged-looking screen with a bluish glow halo, vignette, scanlines
 * and a specular highlight. The media cross-fades with a subtle CRT flicker (see globals.css).
 */
export function GalleryLens({ project }: { project: Project }) {
  const { current, leaving } = useCrossfade(project, galleryConfig.transitionMs);

  return (
    <div
      className="relative aspect-[16/10] w-full rounded-[10%/14%]"
      style={{
        boxShadow:
          "0 0 50px 6px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 0 150px 30px color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[10%/14%] bg-black">
        <div className="absolute inset-0" style={{ filter: "saturate(1.1) contrast(1.05)" }}>
          {leaving && (
            <div key={leaving.id} className="gallery-lens-out absolute inset-0">
              <ProjectMedia project={leaving} />
            </div>
          )}
          <div key={current.id} className="gallery-lens-in absolute inset-0">
            <ProjectMedia project={current} alt={current.title} />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.16), transparent 42%), repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px)",
            boxShadow: "inset 0 0 90px 20px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
      </div>
    </div>
  );
}
