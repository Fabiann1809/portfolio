export interface HeroPortrait {
  /** Path of the cut-out (transparent WebP/PNG). Leave undefined to show the placeholder silhouette. */
  src?: string;
  alt: string;
  width: number;
  height: number;
}

/** Tunables of the silhouette cast on the backdrop behind the portrait (px / deg / ratio). */
export interface HeroPortraitShadow {
  /** Offset at the resting light (negative = left / up). */
  baseX: number;
  baseY: number;
  /** Max extra offset (px) reached when the light moves across the whole stage. */
  travelX: number;
  travelY: number;
  /** Hard clamp of the total offset (px). */
  maxOffset: number;
  /** Blur (px) with the light on the subject, and with the light far away. */
  blurMin: number;
  blurMax: number;
  scale: number;
  /** Skew (deg) at the resting light, and extra degrees per 100px of horizontal offset. */
  skewBase: number;
  skewPer100: number;
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

/** Tunables of the studio scene: giant name layout, letter lighting, parallax and photo key light. */
export interface HeroStudio {
  /** Advance width of the display name in em (Doto 900, with tracking); fits the name to the stage width. */
  nameWidthEm: number;
  /** Name width as % of the stage width. */
  nameFit: number;
  /** Height (px) the intro block needs from its top edge, incl. a gap: the name never rises into it. */
  introClearancePx: number;
  /** Distance (em) from the name center up to the top of its capitals; used to keep the name clear of the intro. */
  nameRiseEm: number;
  /** Vertical center of the name as % of the stage height. */
  nameCenterY: number;
  /** Letter spacing of the name (em). */
  nameTracking: number;
  /** Delay between letters of the entrance (ms). */
  letterStaggerMs: number;
  /** Light radius that lights a letter, as a fraction of the stage width. */
  letterRadius: number;
  /** Letter proximity (0..1) without a fine pointer or with reduced motion. */
  letterRest: number;
  /** Max parallax shift (px) per layer. */
  parallax: { wall: number; name: number; person: number };
  /** Key light on the photo: radius as % of the portrait box and highlight strength (0..1). */
  keyLight: { radius: number; strength: number };
}

export interface HeroData {
  greeting: string;
  name: string;
  /** Giant name drawn across the hero. */
  displayName: string;
  /** Role title, shown in two lines. */
  roleLines: [string, string];
  tagline: string;
  /** Primary call to action: scrolls to the section `targetId`. */
  workLabel: string;
  workTargetId: string;
  cvLabel: string;
  cvPath: string;
  /** Label next to the light cursor while over the hero. */
  lightLabel: string;
  portrait: HeroPortrait;
  portraitShadow: HeroPortraitShadow;
  studio: HeroStudio;
  status: HeroStatus;
}
