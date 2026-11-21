export interface GalleryLabels {
  /** Between the current number and the total, e.g. "/". */
  counterSeparator: string;
  viewAll: string;
  backHome: string;
  pageTitle: string;
  pageDescription: string;
  galleryAria: string;
  /** Screen reader status; "{current}" and "{total}" are replaced. */
  status: string;
  previous: string;
  next: string;
  /** Prefix of a thumbnail's accessible name, followed by the project title. */
  select: string;
  wheelAria: string;
  technologies: string;
}

export interface WheelGeometry {
  thumbWidth: number;
  thumbHeight: number;
  /** Radius (px) of the arc the thumbnails sit on. */
  radius: number;
  /** Angle (deg) between neighbouring thumbnails. */
  stepDeg: number;
  scaleActive: number;
  /** Scale lost per step away from the active item. */
  scaleFalloff: number;
  /** How far (px) the active thumbnail is raised. */
  lift: number;
  /** Opacity lost per step away from the active item. */
  fade: number;
  /** Steps shown on each side of the active item. */
  reach: number;
}

export interface GalleryConfig {
  transitionMs: number;
  /** Lock after a step so one gesture is one step. */
  cooldownMs: number;
  reducedCooldownMs: number;
  /** Accumulated wheel delta (px) needed for a step. */
  wheelThreshold: number;
  /** A wheel gap longer than this starts a new gesture. */
  wheelIdleMs: number;
  /** Touch travel (px) needed for a swipe step. */
  swipeThreshold: number;
  enterMs: number;
  ease: string;
  wheel: { page: WheelGeometry; embedded: WheelGeometry };
}
