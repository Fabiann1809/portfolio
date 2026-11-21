import type { BackdropId } from "./theme";

/** How a chapter is shown while it is current. */
export type ChapterLayout = "backdrop" | "stream";

/**
 * How the journey moves from the previous chapter into this one.
 * "conveyor": frameless bent panels ride one diagonal conveyor (bottom-right to top-left).
 * "conveyor-fill": same conveyor, but the entering panel rises to the centre, then scales up and flattens to fill the viewport.
 * "vertical-pan": full-bleed to full-bleed; a continuous vertical camera move with a glitch seam and a slight roll.
 * "fly-in": the entering scene flies in from depth as a small panel and grows to fill the viewport.
 */
export type TransitionMode = "conveyor" | "conveyor-fill" | "vertical-pan" | "fly-in";

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
    /** Fast follow-up used by transitions that must keep two screens glued together (pan, fly-in). */
    transition: number;
  };
  phases: {
    /** A full-bleed screen bends into a panel (conveyor entry). */
    shrink: PhaseRange;
    /** Conveyor movement across a transition zone. */
    stream: PhaseRange;
    /** "conveyor-fill": the entering panel scales up and flattens. */
    expand: PhaseRange;
    /** Conveyor movement between two screens of the same stream chapter. */
    streamInner: PhaseRange;
    /** "vertical-pan" progress. */
    pan: PhaseRange;
    /** "fly-in" progress. */
    flyIn: PhaseRange;
  };
  stream: {
    /** Direction of the conveyor, in degrees from vertical (bottom-right to top-left). */
    pathAngle: number;
    /** Distance between neighbours as a share of the touching distance (below 1: they overlap slightly). */
    spacing: number;
    /** Panel size multiplier. */
    scale: number;
    /** Rightward shift of the whole stream, as a fraction of the viewport width (room for the left text column). */
    shiftX: number;
    /** Same as shiftX for viewports narrower than `narrowPx` (the column is a larger share of the width). */
    shiftXNarrow: number;
    narrowPx: number;
    /** World units pushed back per unit of distance from the centre. */
    depth: number;
    /** Scale lost per unit of distance from the centre. */
    scaleFalloff: number;
    /** Radians of rotation per unit of distance (panels face the centre). */
    tiltX: number;
    tiltY: number;
    tiltZ: number;
    /** Bend of a panel at rest: share of the panel width pulled back at the edges (cylinder x / y, plus corner curl). */
    bend: { x: number; y: number; corner: number };
    /** Deterministic per-panel variation (radians for angles, share for bend). */
    variation: { yaw: number; pitch: number; roll: number; bend: number };
  };
  screen: {
    widthRatio: number;
    maxHeightRatio: number;
    aspect: number;
    /** Filled screens overscan the viewport by this factor. */
    overscan: number;
  };
  transitions: {
    pan: {
      /** Peak roll (radians) of the camera in the middle of the pan. */
      roll: number;
      /** Extra zoom at the middle of the pan (keeps the rotated screens covering the viewport). */
      zoom: number;
      /** Share of a screen height the two screens overlap at the seam. */
      overlap: number;
    };
    flyIn: {
      /** Scale of the entering panel at the start. */
      startScale: number;
      /** Starting yaw / roll (radians) of the entering panel. */
      yaw: number;
      roll: number;
      /** World units the entering panel starts behind the plane. */
      depth: number;
      /** Scale lost by the leaving scene, its roll (radians) and the share it fades to the background. */
      outZoom: number;
      outRoll: number;
      outDim: number;
    };
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
