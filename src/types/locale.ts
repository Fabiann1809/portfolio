/** Supported site languages. Spanish is the default (served at "/"), English lives under "/en". */
export type Locale = "es" | "en";

/** Content of one data module in every language. */
export type Localized<T> = Record<Locale, T>;

export interface LocaleOption {
  id: Locale;
  /** Short label shown in the toggle (e.g. "ES"). */
  label: string;
  /** Value of `<html lang>` and `hreflang`. */
  htmlLang: string;
}

export interface LocaleToggleLabels {
  /** Accessible name of the language switch group. */
  groupLabel: string;
  /** Accessible name of the link to switch to a language, keyed by target language. */
  switchTo: Record<Locale, string>;
}

export interface SiteMetadata {
  title: string;
  description: string;
}
