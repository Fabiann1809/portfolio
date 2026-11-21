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
  light: {
    /** Radius of the light, as a fraction of the larger hero side. */
    radius: number;
    /** Extra opacity of the lines under the light. */
    boost: number;
  };
  brackets: {
    /** Arm length in px. */
    size: number;
    /** Offset from the hero edge, in px (top is below the navbar). */
    inset: { top: number; side: number; bottom: number };
  };
}
