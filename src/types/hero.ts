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

export interface HeroData {
  greeting: string;
  name: string;
  /** Giant name drawn across the hero. */
  displayName: string;
  role: string;
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
  status: HeroStatus;
}
