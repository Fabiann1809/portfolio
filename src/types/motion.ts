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

export interface MotionData {
  /** Lenis smooth scroll tuning. */
  lenis: { lerp: number; wheelMultiplier: number };
  /** Scroll length (vh) of the pinned origin story. */
  originScrollVh: number;
  /** Screens of scroll per project in the pinned mission tunnel. */
  missionScreensPerProject: number;
  tunnel: TunnelConfig;
  /** Scroll reveal: delay between staggered children (ms) and how far items rise (px). */
  reveal: { stagger: number; rise: number };
}
