/** Ids of the site backdrop tones: "ink" = dark (Tinta), "bone" = light (Hueso), "signal" = orange (Se\u00f1al). */
export type BackdropId = "ink" | "bone" | "signal";

export interface BackdropOption {
  id: BackdropId;
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
}

/** Translatable UI text of the backdrop picker. */
export interface ThemeLabels {
  /** Label of each option, by id. */
  options: Record<BackdropId, string>;
  /** Accessible name of the radio group. */
  pickerLabel: string;
  /** Visible caption of the full picker. */
  pickerCaption: string;
}
