/** Parameters of the procedural topographic backdrop of the hero (WebGL fragment shader). */
export interface ContourBackdropData {
  /** Max device pixel ratio used by the canvas. */
  maxPixelRatio: number;
  /** Noise scale (per hero-height unit) of the contour field. */
  frequency: number;
  /** Number of contour levels across the noise range. */
  levels: number;
  /** Drift of the field through noise space, per second (x, y). */
  drift: [number, number];
  /** Line AA width multiplier (fwidth). */
  lineSoftness: number;
  /** Cold line opacity as a fraction of the --contour-alpha tone token. */
  idleAlpha: number;
  /** Line opacity inside the pointer blob. */
  hotAlpha: number;
  /** Pointer reaction: a gaussian bump under the cursor plus a trail-driven gooey blob. */
  pointer: {
    /** Gaussian sharpness of the bump (distance in hero-height units). */
    bumpK: number;
    /** Height added at the pointer. */
    bumpAmp: number;
    /** Height added by the trail texture. */
    trailAmp: number;
    /** Brush radius in CSS px. */
    brushSize: number;
    /** Trail texture scale relative to the hero size. */
    trailScale: number;
    /** Per-frame (at 60fps) trail decay factor. */
    trailDecay: number;
    /** Seconds without movement before the influence eases out. */
    idleSeconds: number;
    /** Easing speed of the influence in/out (per second). */
    easeRate: number;
  };
  brackets: {
    /** Arm length in px. */
    size: number;
    /** Offset from the hero edge, in px (top is below the navbar). */
    inset: { top: number; side: number; bottom: number };
  };
}
