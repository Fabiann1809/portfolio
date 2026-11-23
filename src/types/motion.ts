export interface TunnelConfig {
  /** CSS perspective (px) and depth (px) between two consecutive projects. */
  perspective: number;
  spacing: number;
  /** Frame rings of the corridor: how many, their spacing in projects, every Nth is accent colored. */
  rings: number;
  ringStep: number;
  hotEvery: number;
  /** Easing speed of the camera following the scroll. */
  damping: number;
  /** Width of the project panel: fraction of the stage and max px. */
  panelWidth: number;
  panelMaxPx: number;
}

/** Coverflow of the work gallery; arrays are indexed by distance from the active card (0..3). */
export interface WorkGalleryConfig {
  /** Horizontal offset in card widths, scale, Y rotation (deg), depth (px) and opacity. */
  x: number[];
  scale: number[];
  rotate: number[];
  depth: number[];
  opacity: number[];
  /** Same offsets on phones, where fewer neighbours are visible. */
  xCompact: number[];
  /** Neighbours shown on each side (desktop / compact). */
  visible: number;
  visibleCompact: number;
  perspective: number;
  transitionMs: number;
  /** Scroll length (svh) the pinned gallery spends on each project. */
  scrollVh: number;
  /** Scroll per project on phones (shorter, so it advances faster). */
  scrollVhCompact: number;
}

export interface MotionData {
  /** Lenis smooth scroll tuning. */
  lenis: { lerp: number; wheelMultiplier: number };
  /** Scroll length (vh) of the pinned origin story. */
  originScrollVh: number;
  /** Screens of scroll per project in the pinned mission tunnel. */
  missionScreensPerProject: number;
  tunnel: TunnelConfig;
  gallery: WorkGalleryConfig;
  /** Scroll reveal: delay between staggered children (ms) and how far items rise (px). */
  reveal: { stagger: number; rise: number };
}
