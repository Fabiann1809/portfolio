export interface HeroPortrait {
  /** Path of the cut-out (transparent WebP/PNG): shown as is on the hero, mosaic-ed on the screen texture. */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface HeroStatus {
  availability: string;
  city: string;
  /** IANA time zone of the city, used for the live clock. */
  timeZone: string;
  /** Locale used for the date and the time. */
  locale: string;
  /** First working year; the third line shows the years since. */
  experienceSince: number;
  /** Template with a `{years}` placeholder. */
  yearsLabel: string;
}

/** Desktop layout (>= lg) of the hero, in % of the stage, plus the light CRT treatment of the photo. */
export interface HeroStudio {
  /** Portrait height as % of the stage height (bottom-anchored; width follows the photo aspect). */
  portraitHeight: number;
  /** Vertical center of the left / right text blocks as % of the stage height. */
  blockCenterY: number;
  /** Share of the portrait height (from the bottom) that fades into the background. */
  photoBottomFade: number;
  /** Opacity (0..1) of the scanline overlay on the photo (keep it at 0.05 or less). */
  photoScanAlpha: number;
  /** Strength (0..1) of the tiny vignette on the photo. */
  photoVignette: number;
}

/** Look of the hero texture drawn on the curved screen (wall + pixel mosaic + giant name). */
export interface HeroScreen {
  /** Name width as % of the texture width. */
  nameFit: number;
  /** Letter spacing of the name (em). */
  nameTracking: number;
  /** Vertical center of the name as % of the texture height. */
  nameCenterY: number;
}

/** Barrel-distorted wireframe wall with quadtree subdivision around the figure. */
export interface HeroGrid {
  /** Columns of the coarsest cells across the (undistorted) screen. */
  baseCols: number;
  /** Cell height / cell width of the coarsest level. */
  cellAspect: number;
  /** Barrel strength (0 = flat grid; 0.5 = strong bulge). */
  curve: number;
  /** Line width (CSS px) and opacity (0..1). */
  lineWidthPx: number;
  lineAlpha: number;
  /** Mask value (0..1) above which a cell splits, for levels 1, 2 and 3. */
  splitThresholds: [number, number, number];
  /** Chance (0..1) that a coarse cell far from the figure splits once anyway. */
  randomSplit: number;
  /** Share of cells whose line flickers (0..1) and the depth of the flicker. */
  flicker: number;
  /** Edge darkening (0..1) and edge chromatic shift (CSS px). */
  vignette: number;
  edgeFringePx: number;
  /** Cursor light on the lines: radius as a fraction of the stage height and extra brightness. */
  lightRadius: number;
  lightGain: number;
  /** Resolution (columns) of the silhouette mask; the dilate / blur radii are in mask cells. */
  maskCols: number;
  maskDilate: number;
  maskBlur: number;
}

/** Pixel mosaic of the portrait on the screen texture. */
export interface HeroMosaic {
  /** Gap between tiles, as a fraction of the tile. */
  gap: number;
  /** Tone curve of the photo luminance. */
  contrast: number;
  gamma: number;
  /** Fraction of the portrait height (from the bottom) that dissolves. */
  bottomFade: number;
}

export interface HeroScene {
  /** Max device pixel ratio of the hero canvas. */
  maxDpr: number;
  /** Seconds of the scan-in of the grid wall once the loader leaves. */
  revealSeconds: number;
  grid: HeroGrid;
  mosaic: HeroMosaic;
}

/** CRT colors of one tone, read from the --crt-* tokens (hex strings). */
export interface HeroTint {
  bg: string;
  glow: string;
  line: string;
  hot: string;
  shadow: string;
  mid: string;
  high: string;
  streak: string;
}

/** Rectangle in CSS px relative to the hero stage (top-left origin). */
export interface SlotRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Per-frame values shared by the scene components (mutated in place, never React state). */
export interface HeroRig {
  /** Stage size (CSS px) and canvas pixel ratio. */
  width: number;
  height: number;
  dpr: number;
  /** Seconds of animated time (frozen with reduced motion). */
  time: number;
  /** Scan-in progress 0..1. */
  reveal: number;
  /** Pointer highlight on the wall: position across the stage (0..1, y down) and how strongly it is on (0..1). */
  lightX: number;
  lightY: number;
  lightOn: number;
}

export interface HeroData {
  displayName: string;
  /** Role title, shown in two lines. */
  roleLines: [string, string];
  /** Mono meta line under the role: label and copyright year. */
  metaLabel: string;
  copyrightYear: number;
  tagline: string;
  /** Uppercase justified description (right block). */
  description: string;
  /** Primary call to action: scrolls to the section `targetId`. */
  workLabel: string;
  workTargetId: string;
  cvLabel: string;
  cvPath: string;
  portrait: HeroPortrait;
  studio: HeroStudio;
  scene: HeroScene;
  screen: HeroScreen;
  status: HeroStatus;
}
