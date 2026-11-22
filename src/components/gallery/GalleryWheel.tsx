import { ProjectMedia } from "./ProjectMedia";
import type { GalleryConfig, GalleryLabels, Project, WheelGeometry } from "@/types";

interface GalleryWheelProps {
  projects: Project[];
  index: number;
  geometry: WheelGeometry;
  reduced: boolean;
  labels: Pick<GalleryLabels, "select" | "wheelAria">;
  timing: Pick<GalleryConfig, "transitionMs" | "ease">;
  onSelect: (index: number) => void;
}

/**
 * Thumbnails on an arc seen in perspective (film-reel look). Each item is positioned from its
 * offset to the active index; CSS transitions rotate the wheel when the index changes.
 */
export function GalleryWheel({ projects, index, geometry: g, reduced, labels, timing, onSelect }: GalleryWheelProps) {
  const stepRad = (g.stepDeg * Math.PI) / 180;
  const duration = reduced ? 0 : timing.transitionMs;

  return (
    <ul
      aria-label={labels.wheelAria}
      className="relative size-full"
      style={{ perspective: reduced ? "none" : "900px" }}
    >
      {projects.map((project, i) => {
        const o = i - index;
        const abs = Math.abs(o);
        const a = reduced ? 0 : o * stepRad;
        const x = reduced ? o * (g.thumbWidth + 12) : g.radius * Math.sin(a);
        const z = reduced ? 0 : g.radius * (Math.cos(a) - 1);
        const active = o === 0;
        const y = active ? -g.lift : reduced ? 0 : (1 - Math.cos(a)) * g.radius * 0.25;
        const scale = active ? g.scaleActive : Math.max(0.4, 1 - abs * g.scaleFalloff);
        const hidden = abs > g.reach;
        const opacity = hidden ? 0 : Math.max(0.12, 1 - abs * g.fade);
        const rotate = (a * 180) / Math.PI;

        return (
          <li
            key={project.id}
            className="absolute bottom-3 left-1/2"
            style={{
              width: g.thumbWidth,
              height: g.thumbHeight,
              marginLeft: -g.thumbWidth / 2,
              zIndex: 100 - abs,
              opacity,
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotate}deg) scale(${scale})`,
              transition: `transform ${duration}ms ${timing.ease}, opacity ${duration}ms ${timing.ease}`,
              pointerEvents: hidden ? "none" : "auto",
            }}
          >
            <button
              type="button"
              tabIndex={hidden ? -1 : 0}
              aria-label={`${labels.select} ${project.title}`}
              aria-current={active ? "true" : undefined}
              onClick={() => onSelect(i)}
              className={
                "block size-full cursor-pointer overflow-hidden rounded-md border transition-[border-color,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) " +
                (active
                  ? "border-foreground/70 shadow-[0_0_24px_color-mix(in_srgb,var(--color-primary)_55%,transparent)]"
                  : "border-foreground/15")
              }
            >
              <ProjectMedia project={project} still />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
