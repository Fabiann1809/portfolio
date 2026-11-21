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
  /** Optional image (.jpg/.png/.webp) or video (.mp4/.webm) URL. Wins over `scene`; without either a generated gradient is used. */
  visual?: string;
  /** Visual generated in code (takes the theme into account). */
  generated?: GeneratedVisual;
  /** Procedural 3D backdrop, used when `visual` is not set. */
  scene?: ProceduralScene;
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
    /** Per-screen deterministic pose variation at rest (radians). */
    tiltVariance: { y: number; z: number };
    /** Bezel thickness as a fraction of the screen height. */
    bezel: number;
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
    /** Texture blur (mip bias) applied to filled procedural / image backdrops behind text. */
    blurFilled: number;
    /** Reflection / glow strengths. */
    glow: number;
  };
  lenis: {
    lerp: number;
    wheelMultiplier: number;
    /** Duration (s) of a navbar jump while the journey is active. */
    jumpDuration: number;
  };
}

/** Procedural 3D scenes that can fill an expanded chapter backdrop (rendered to a texture). */
export type ProceduralSceneKind = "tunnel" | "corridor" | "grid";

export interface ProceduralScene {
  kind: ProceduralSceneKind;
  /** Accent of the scene: "primary" / "accent" (theme tokens) or any CSS hex color. */
  tint: string;
  /** Free number that varies layout details (module spacing, hash seeds). */
  variant?: number;
  /** Camera travel speed multiplier. */
  speed?: number;
}

/** Look of the "white studio" shown behind the screens during transitions, per backdrop theme. */
export interface StudioPalette {
  /** Wall color at the bright centre. */
  center: string;
  /** Wall color at the edges (soft gray falloff). */
  edge: string;
  /** Floor color near the horizon / near the camera. */
  floorFar: string;
  floorNear: string;
  /** Color of the drifting mono text. */
  text: string;
  /** Tint mixed into the whole studio (accent hint). */
  tint: string;
  tintStrength: number;
  /** Navbar-like foreground to use while the studio is visible (hint for CSS). */
  isDarkText: boolean;
}

export interface EnvironmentConfig {
  /** Horizon position, 0 = bottom of the viewport, 1 = top. */
  horizon: number;
  /** World Y of the floor plane that reflects / receives shadows, as a fraction of the viewport height from centre. */
  floorY: number;
  reflection: { opacity: number; length: number };
  shadow: { opacity: number; width: number; height: number };
  /** Drifting code text on the floor and walls. */
  text: {
    lines: string[];
    fontSize: number;
    lineHeight: number;
    textureSize: number;
    floorScale: number;
    wallScale: number;
    floorOpacity: number;
    wallOpacity: number;
    /** Texture rows scrolled per viewport of page scroll. */
    scrollSpeed: number;
    idleSpeed: number;
  };
  palettes: Record<"ink" | "bone" | "signal", StudioPalette>;
  /** Render target of the procedural scenes. */
  target: { maxWidth: number; maxHeight: number };
  /** Scene look: exposure / fog per theme brightness. */
  scene: {
    darkExposure: number;
    lightExposure: number;
    /** Page scroll (in viewport heights) to world units of camera travel. */
    travelPerVh: number;
    idleTravel: number;
    /** Accent used by the cold corridor palette when `tint` is a hex. */
    dustCount: number;
  };
  /** Colors considered "cold blue" when a scene uses it as base. */
  coldBase: string;
}
