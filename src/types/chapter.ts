import type { BackdropId } from "./theme";

/** How a chapter is shown while it is current. */
export type ChapterLayout = "backdrop" | "stream";

/**
 * Transition zone placed BEFORE a chapter, between it and the previous one. Every transition is a
 * "pass and expand": the leaving section shrinks into a panel on the rotating sphere, the sphere
 * turns it away (top-left) and brings the next panel around (from bottom-right) before it expands.
 */
export interface ChapterTransition {
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
    /** A full-bleed screen bends into a panel on the sphere. */
    shrink: PhaseRange;
    /** Sphere rotation across a transition zone. */
    stream: PhaseRange;
    /** The entering panel scales up and flattens to fill the viewport. */
    expand: PhaseRange;
    /** Sphere rotation between two screens of the same stream chapter. */
    streamInner: PhaseRange;
    /** 0 = eased steps between screens, 1 = constant-speed carousel rotation. */
    carousel: number;
  };
  stream: {
    /** Direction of the great-circle path, in degrees from vertical (bottom, slightly right, to top, slightly left). */
    pathAngle: number;
    /** Tilt of a panel away from the front, as a share of its angle on the sphere. The entering panel is seen from below (top edge farther) and straightens at the centre; the leaving one tilts the same way going over the top. */
    tilt: number;
    /** 0 = convex outside, >0 = off-centre panels come closer (inside of the sphere). */
    concaveDepth: number;
    /** Sphere radius, as a multiple of the viewport height at the screen plane. */
    radius: number;
    /** Angular distance between neighbours as a share of the touching distance (below 1: they overlap slightly). */
    spacing: number;
    /** Panel size multiplier. */
    scale: number;
    /** Rightward shift of the whole sphere, as a fraction of the viewport width (room for the left text column). */
    shiftX: number;
    /** Same as shiftX for viewports narrower than `narrowPx` (the column is a larger share of the width). */
    shiftXNarrow: number;
    narrowPx: number;
    /** Width in CSS px of the left text column: the panel at rest is narrowed so its left edge stays right of it. */
    columnPx: number;
    /** Panels further than this many panels from the centre are not drawn. */
    viewRange: number;
    /** CRT-like convex barrel of a panel at rest: `bulge` = share of the panel width the edge midpoints bow outward, `corner` = corner radius as a share of the panel height. */
    bend: { bulge: number; corner: number };
    /** Constant yaw of every panel at rest, in degrees (perspective feel: the left edge is closer). */
    yaw: number;
    /** Deterministic per-panel variation of the neighbours (radians). */
    variation: { yaw: number; pitch: number; roll: number };
    /**
     * Glitch as a function of the path position `r` (panels from the centre). `inStart`..`inEnd`: the entering panel
     * (r > 0) is torn at full `strength` beyond `inEnd` and clean at `inStart`. `exit`: share of strength kept by the
     * leaving panel (r < 0) near the top. `shift`: max row displacement (share of the width).
     */
    glitch: { inStart: number; inEnd: number; exit: number; strength: number; shift: number; rgb: number };
    /**
     * Pass-and-expand of a backdrop: it keeps rising by `rise` (viewport heights) while it grows, the barrel / corner
     * bend is held until fill reaches `bulgeHold` and relaxes after, and the final size overshoots by `overshoot`
     * so the bent corners are covered.
     */
    expand: { rise: number; bulgeHold: number; overshoot: number };
  };
  screen: {
    widthRatio: number;
    maxHeightRatio: number;
    aspect: number;
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
    /** Texture blur (mip bias) applied to filled procedural / image backdrops behind text. */
    blurFilled: number;
    /** Edge tearing: base and per unit of scroll speed (share of the panel width). */
    tear: number;
    tearGain: number;
  };
  /** Section overlay text (bottom-left on backdrops): per-line stagger in ms and rise in px. */
  overlay: { stagger: number; rise: number };
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

/** Look of the "white studio" shown behind the panels during transitions, per backdrop theme. */
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
  palettes: Record<BackdropId, StudioPalette>;
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
