/** Ids of the site-wide backdrop tones (the user's light/dark theme). */
export type BackdropId = "ink" | "bone" | "signal";

export interface BackdropOption {
  id: BackdropId;
  /** UI label shown in the picker. */
  label: string;
  /** Swatch color of the picker (mirrors the tokens declared in globals.css). */
  swatch: string;
}

export interface ThemeData {
  /** localStorage key that persists the choice. */
  storageKey: string;
  options: BackdropOption[];
  /** Used when nothing is stored and the OS prefers a dark scheme. */
  defaultForDark: BackdropId;
  /** Used when nothing is stored and the OS prefers a light scheme. */
  defaultForLight: BackdropId;
  /** Accessible name of the radio group. */
  pickerLabel: string;
  /** Visible caption of the full picker. */
  pickerCaption: string;
  /** Hint pill of the hero. */
  hint: string;
}

/** CSS custom properties of the active theme, read for canvas / WebGL use. */
export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  accent: string;
  lightTint: string;
  vignette: string;
}
