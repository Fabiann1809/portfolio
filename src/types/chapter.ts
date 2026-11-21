/** How a chapter is shown while it is current. */
export type ChapterLayout = "backdrop" | "stream";

/**
 * "stream": the previous screen exits diagonally while the next one enters.
 * "expand": the current screen itself grows to fill the viewport and becomes the next backdrop.
 */
export type TransitionMode = "stream" | "expand";

/** Transition zone placed BEFORE a chapter, between it and the previous one. */
export interface ChapterTransition {
  mode: TransitionMode;
  /** Scroll length of the zone, in viewport heights. */
  lengthVh: number;
}

/** Visual drawn in code instead of loaded from an image. */
export type GeneratedVisual = "hero";

export interface Chapter {
  /** Same id as the section element and the navigation entry. */
  id: string;
  /** "backdrop": one screen that expands behind the section. "stream": many screens (one per item). */
  layout: ChapterLayout;
  /** Optional image path. Without it a generated gradient/noise texture is used. */
  visual?: string;
  /** Visual generated in code (takes the theme into account). */
  generated?: GeneratedVisual;
  /** Absent for the first chapter. */
  transition?: ChapterTransition;
}

/** One screen of a "stream" chapter (e.g. a project). */
export interface StreamItem {
  id: string;
  visual?: string;
}

/** Normalised sub-range [start, end] of a zone's progress (0..1). */
export type PhaseRange = [number, number];

export interface JourneyConfig {
  /** Start a zone this many viewport heights before its top reaches the viewport top. */
  leadVh: number;
  /** Cap for the frame delta (seconds) used by every damped value. */
  maxDelta: number;
  /** Smooth times in seconds (maath damp: approximate time to reach the target). */
  smooth: {
    journey: number;
    position: number;
    shape: number;
    smear: number;
  };
  phases: {
    shrink: PhaseRange;
    stream: PhaseRange;
    expand: PhaseRange;
    /** Movement between two screens of the same stream chapter. */
    streamInner: PhaseRange;
    /** "expand" mode: the current screen grows. */
    expandSelf: PhaseRange;
    /** "expand" mode: the next backdrop fades in beneath. */
    expandNextIn: PhaseRange;
    /** "expand" mode: the grown screen fades out. */
    expandSelfOut: PhaseRange;
  };
  stream: {
    /** Offset of the neighbouring screen, as a fraction of the viewport. */
    offsetX: number;
    offsetY: number;
    /** World units pushed back per unit of distance from the centre. */
    depth: number;
    /** Scale lost per unit of distance from the centre. */
    scaleFalloff: number;
    /** Radians of rotation per unit of distance (screens face the centre). */
    tiltX: number;
    tiltY: number;
    tiltZ: number;
  };
  screen: {
    widthRatio: number;
    maxHeightRatio: number;
    aspect: number;
    /** Barrel curvature at rest. */
    curve: number;
    /** Filled screens overscan the viewport by this factor. */
    overscan: number;
  };
  fx: {
    /** Screens per second of stream speed that maps to a full smear. */
    smearGain: number;
    rgbBase: number;
    rgbGain: number;
    scan: number;
    vignette: number;
    /** Darkening of a filled screen so DOM text stays readable. */
    dimFilled: number;
    /** Slow drift of filled backdrops, per viewport of scroll. */
    drift: number;
  };
  lenis: {
    lerp: number;
    wheelMultiplier: number;
    /** Duration (s) of a navbar jump while the journey is active. */
    jumpDuration: number;
  };
}
