import type { CSSProperties } from "react";

const DOTS: CSSProperties = {
  backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--foreground) 28%, transparent) 1px, transparent 1.6px)",
  backgroundSize: "5px 5px",
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Pixelated avatar; falls back to initials on a dot-matrix circle. Decorative (name is next to it). */
export function TestimonialAvatar({ name, src }: { name: string; src?: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative size-14 shrink-0 overflow-hidden rounded-full border border-line bg-background"
      style={DOTS}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- tiny pixel-art avatar, optimization would blur it
        <img src={src} alt="" className="size-full object-cover" style={{ imageRendering: "pixelated" }} />
      ) : (
        <span className="flex size-full items-center justify-center font-display text-xl font-black text-foreground">
          {initialsOf(name)}
        </span>
      )}
    </div>
  );
}
