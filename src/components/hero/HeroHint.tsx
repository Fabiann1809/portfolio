import { theme } from "@/data/theme";

/** Hint pill (bottom left, desktop only): explains the light and the click. */
export function HeroHint() {
  return (
    <p className="pointer-events-none absolute bottom-6 left-8 z-30 hidden rounded-full border border-line bg-surface/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-muted uppercase backdrop-blur md:block lg:left-12">
      {theme.hint}
    </p>
  );
}
