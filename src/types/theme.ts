/** Ids of the two site modes: "ink" = dark (Tinta), "bone" = light (Hueso). */
export type BackdropId = "ink" | "bone";

export interface BackdropOption {
  id: BackdropId;
  /** Accessible / visible label of the mode switch option. */
  label: string;
}

export interface ThemeData {
  /** localStorage key that persists the choice. */
  storageKey: string;
  options: BackdropOption[];
  /** Used when nothing is stored and the OS prefers a dark scheme. */
  defaultForDark: BackdropId;
  /** Used when nothing is stored and the OS prefers a light scheme. */
  defaultForLight: BackdropId;
  /** Stored values of removed tones mapped to the mode they become. */
  migrate: Record<string, BackdropId>;
  /** Accessible name of the mode switch group. */
  switchLabel: string;
}

/** CSS custom properties of the active theme, read for canvas / WebGL use. */
export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  accent: string;
  vignette: string;
  /** Giant name color and the phosphor glow color. */
  nameLit: string;
  glow: string;
}
