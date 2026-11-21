import { Reveal } from "@/components/loader/Reveal";
import { ContourField } from "./ContourField";
import { FrameBrackets } from "./FrameBrackets";

/**
 * Hero backdrop: the theme background with animated topographic contour lines, a vignette and corner
 * brackets. Colors come from tokens.
 */
export function StudioBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Reveal className="absolute inset-0">
        <ContourField />
      </Reveal>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 38%, transparent 35%, var(--vignette) 100%), linear-gradient(to bottom, transparent 55%, var(--vignette) 190%)",
        }}
      />
      <FrameBrackets />
    </div>
  );
}
