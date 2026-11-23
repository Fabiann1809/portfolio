import { ProjectMedia } from "@/components/gallery/ProjectMedia";
import type { Project } from "@/types";

/** Project image in a framed panel with an accent border and faint scanlines. */
export function MissionFrame({
  project,
  code,
  className = "",
  still = false,
}: {
  project: Project;
  code: string;
  className?: string;
  /** Poster only, no video element (used for unfocused panels on phones). */
  still?: boolean;
}) {
  return (
    <div className={`relative aspect-[16/10] overflow-hidden rounded-2xl border border-emphasis bg-surface ${className}`}>
      <ProjectMedia project={project} still={still} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, color-mix(in srgb, #000 14%, transparent) 0 1px, transparent 1px 3px)",
        }}
      />
      <span className="mono-label absolute top-2 left-3 text-[10px] text-white mix-blend-difference">{code}</span>
    </div>
  );
}
