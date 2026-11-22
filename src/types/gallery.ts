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

/** Cloud size and spread for one breakpoint. Distances are in "units" (one unit = min(unitVh * stage height, unitVw * stage width)). */
export interface ArtCloudLayout {
  /** Cards in the cloud; artworks repeat to reach it. */
  count: number;
  unitVh: number;
  unitVw: number;
  spreadX: number;
  spreadY: number;
  spreadZ: number;
  /** Extra scroll distance (in viewport heights) while the section is pinned. */
  trackScreens: number;
}

/** Tuning of the scroll-driven 3D image cloud. */
export interface ArtCloudConfig {
  perspective: number;
  /** Seed of the deterministic card generator. */
  seed: number;
  /** Cloud rotation (deg) over the whole scroll track. */
  scrollDeg: number;
  /** Slow idle drift (deg per second). */
  idleDegPerSec: number;
  /** Easing speed of scroll progress: 1 - exp(-speed * dt). */
  scrollEase: number;
  /** Progress (0-1) where the closing (collapse to one card) starts. */
  closeStart: number;
  /** Opacity of the farthest cards. */
  minOpacity: number;
  /** Cards loaded eagerly. */
  eagerCount: number;
  tilt: {
    maxDeg: number;
    stiffness: number;
    damping: number;
    /** Pointer parallax shift (units) of the nearest cards. */
    parallax: number;
  };
  desktop: ArtCloudLayout;
  mobile: ArtCloudLayout;
}
