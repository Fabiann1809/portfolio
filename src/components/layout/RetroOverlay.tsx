import { retro } from "@/data/retro";

/** SVG feTurbulence noise tile as a data URI (grayscale, blended with `overlay`). */
function grainImage(frequency: number): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='2' stitchTiles='stitch'/>` +
    `<feColorMatrix type='saturate' values='0'/></filter>` +
    `<rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Fixed, non-interactive CRT / film layer over the whole site: film grain, faint scanlines,
 * soft vignette and an optional slow flicker (CSS turns it off under reduced motion).
 */
export function RetroOverlay() {
  const style = {
    "--grain-image": grainImage(retro.grainFrequency),
    "--grain-size": retro.grainSizePx + "px",
    "--grain-opacity": retro.grainOpacity,
    "--scan-opacity": retro.scanlineOpacity,
    "--scan-pitch": retro.scanlinePitchPx + "px",
    "--flicker": retro.flicker,
    "--flicker-seconds": retro.flickerSeconds + "s",
  } as React.CSSProperties;

  return (
    <div aria-hidden="true" className="retro-overlay" data-flicker={retro.flicker > 0} style={style}>
      <div className="retro-overlay__layer retro-overlay__vignette" />
      <div className="retro-overlay__layer retro-overlay__scan" />
      <div className="retro-overlay__layer retro-overlay__grain" />
    </div>
  );
}
