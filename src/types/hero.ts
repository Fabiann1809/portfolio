export interface HeroPortrait {
  /** Path of the cut-out (transparent WebP/PNG): shown as is on the hero, mosaic-ed on the screen texture. */
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Tunables of the static silhouette cast on the backdrop behind the portrait (px / deg / ratio). */
export interface HeroPortraitShadow {
  /** Offset (negative = left / up). */
  baseX: number;
  baseY: number;
  blur: number;
  scale: number;
  skew: number;
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

/** Desktop layout (>= lg) of the hero, in % of the stage, plus the light CRT treatment of the photo. */
export interface HeroStudio {
  /** Portrait height as % of the stage height (bottom-anchored; width follows the photo aspect). */
  portraitHeight: number;
  /** Vertical center of the left / right text blocks as % of the stage height. */
  blockCenterY: number;
  /** Share of the portrait height (from the bottom) that fades into the background. */
  photoBottomFade: number;
  /** Opacity (0..1) of the scanline overlay on the photo (keep it at 0.05 or less). */
  photoScanAlpha: number;
  /** Strength (0..1) of the tiny vignette on the photo. */
  photoVignette: number;
}

export interface HeroData {
  greeting: string;
  /** Giant name drawn across the hero. */
  displayName: string;
  role: string;
  portraitShadow: HeroPortraitShadow;
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
  portrait: HeroPortrait;
  studio: HeroStudio;
  status: HeroStatus;
}
