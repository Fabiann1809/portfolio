import { theme } from "@/data/theme";

/** Hint pill (bottom left, wide desktop only): explains the light and the click. */
export function HeroHint() {
  return (
    <p className="label pointer-events-none absolute bottom-8 left-[var(--edge-x)] z-30 hidden rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-xs text-muted backdrop-blur xl:block">
      {theme.hint}
    </p>
  );
}
