import { Reveal } from "@/components/loader/Reveal";

/**
 * Seamless studio paper: the theme background with a vignette, plus a soft radial light that
 * follows --light-x / --light-y (set by useStudioLight on the stage). Colors come from tokens.
 */
export function StudioBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 38%, transparent 35%, var(--vignette) 100%), linear-gradient(to bottom, transparent 55%, var(--vignette) 190%)",
        }}
      />
      <Reveal className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 55vmax at var(--light-x, 30%) var(--light-y, 22%), var(--light-tint), transparent 62%)",
          }}
        />
      </Reveal>
    </div>
  );
}
