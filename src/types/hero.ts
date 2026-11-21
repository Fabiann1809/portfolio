export interface HeroPortrait {
  /** Path of the cut-out (transparent WebP/PNG) that the mosaic is built from. */
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

/** Desktop layout (>= lg) of the hero, in % of the stage, plus the giant-name tunables. */
export interface HeroStudio {
  /** Advance width of the display name in em (Doto 900, with tracking); fits the name to the stage width. */
  nameWidthEm: number;
  /** Name width as % of the stage width. */
  nameFit: number;
  /** Letter spacing of the name (em). */
  nameTracking: number;
  /** Vertical center of the name as % of the stage height (the name sits in front of the portrait). */
  nameCenterY: number;
  /** Distance (em) from the name center up to the top of its capitals; keeps the name below the side blocks. */
  nameRiseEm: number;
  /** Portrait slot: top edge and height as % of the stage height (width follows the photo aspect). */
  portraitTop: number;
  portraitHeight: number;
  /** Vertical center of the left / right text blocks as % of the stage height. */
  blockCenterY: number;
  /** Delay between letters of the entrance (ms). */
  letterStaggerMs: number;
  /** Light radius that lights a letter, as a fraction of the stage width. */
  letterRadius: number;
  /** Letter proximity (0..1) without a fine pointer or with reduced motion. */
  letterRest: number;
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

/** Pixel / voxel mosaic of the portrait. */
export interface HeroMosaic {
  /** Tile size (CSS px) at 1440px of stage width; scaled with the stage width within `cellScale`. */
  cellPx: number;
  cellScale: [number, number];
  /** Tile size (CSS px) on touch / narrow screens. */
  cellPxMobile: number;
  /** Gap between tiles and corner radius, as a fraction of the tile. */
  gap: number;
  radius: number;
  /** Tone curve of the photo luminance. */
  contrast: number;
  gamma: number;
  /** Height of the plane mesh (segments) and relief amplitude as a fraction of the portrait width. */
  segments: [number, number];
  depth: number;
  /** Glitch amount (0 = none, 1 = default) and RGB fringe (CSS px). */
  glitch: number;
  fringePx: number;
  /** Fraction of the portrait height (from the bottom) that dissolves into the dark. */
  bottomFade: number;
  /** Cursor light: radius as a fraction of the portrait height and extra brightness. */
  lightRadius: number;
  lightGain: number;
}

/** Head turn toward the cursor (degrees) and idle sway without a cursor. */
export interface HeroHead {
  maxYawDeg: number;
  maxPitchDeg: number;
  /** Damping time (s) of the turn. */
  followSeconds: number;
  idleSwayDeg: number;
  /** Camera distance as a multiple of the stage height (perspective strength). */
  focal: number;
}

export interface HeroScene {
  /** Max device pixel ratio of the hero canvas. */
  maxDpr: number;
  /** Seconds of the scan-in once the loader leaves. */
  revealSeconds: number;
  grid: HeroGrid;
  mosaic: HeroMosaic;
  head: HeroHead;
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
  /** Head yaw / pitch (rad), damped toward the cursor. */
  yaw: number;
  pitch: number;
  /** Cursor light from the stage center in CSS px (y up), and how strongly it is on (0..1). */
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
  /** Label next to the light cursor while over the hero. */
  lightLabel: string;
  portrait: HeroPortrait;
  studio: HeroStudio;
  scene: HeroScene;
  status: HeroStatus;
}
