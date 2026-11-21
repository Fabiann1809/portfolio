/** Parameters of the procedural topographic backdrop of the hero. */
export interface ContourBackdropData {
  /** Grid cell size in CSS px (smaller = smoother lines, more work). */
  cellSize: { desktop: number; mobile: number };
  /** Max device pixel ratio used by the canvas. */
  maxPixelRatio: number;
  /** Frames per second while animating. */
  fps: number;
  /** Number of iso-levels drawn. */
  levels: number;
  /** Noise range the levels span (0..1). */
  levelRange: [number, number];
  /** Every n-th level is drawn as a stronger "index" line. */
  majorEvery: number;
  lineWidth: number;
  majorLineWidth: number;
  /** Noise frequency in cycles per 1000 px. */
  frequency: number;
  octaves: number;
  /** Horizontal drift of the field, in noise units per second. */
  driftSpeed: number;
  /** Speed of the slow warping (third noise dimension), in noise units per second. */
  warpSpeed: number;
  /** Base opacity multiplier of the lines (the tone token --contour-alpha scales it). */
  baseAlpha: number;
  scan: {
    /** Seconds for the scan line to cross the hero. */
    periodSeconds: number;
    /** Width in px of the band where contours turn accent-colored. */
    bandWidth: number;
    lineAlpha: number;
    contourAlpha: number;
  };
  /** Pointer reaction: a gaussian bump under the cursor plus a decaying wake (trail). */
  pointer: {
    /** Gaussian sharpness of the bump (distance in hero-height units). */
    bumpK: number;
    /** Height added at the pointer. */
    bumpAmp: number;
    /** Gaussian sharpness of each trail point. */
    trailK: number;
    /** Height added by the trail (sum clamped to 1). */
    trailAmp: number;
    /** Seconds for a trail point to fade out. */
    trailLife: number;
    /** Min distance in px between recorded trail points. */
    trailSpacing: number;
    /** Max trail points kept. */
    trailMax: number;
    /** Seconds without movement before the influence eases out. */
    idleSeconds: number;
    /** Easing speed of the influence in/out (per second). */
    easeRate: number;
    /** Line opacity at full heat (mixed from the base opacity). */
    hotAlpha: number;
    /** Number of heat steps lines are bucketed into (accent mix). */
    hotSteps: number;
  };
  brackets: {
    /** Arm length in px. */
    size: number;
    /** Offset from the hero edge, in px (top is below the navbar). */
    inset: { top: number; side: number; bottom: number };
  };
}
