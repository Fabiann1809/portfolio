import type { Locale, LocaleOption, LocaleToggleLabels, Localized, SiteMetadata } from "@/types";

export const defaultLocale: Locale = "es";

/** Path prefix of each language ("" = served at the site root). */
export const localePrefix: Record<Locale, string> = { es: "", en: "/en" };

export const localeOptions: LocaleOption[] = [
  { id: "es", label: "ES", htmlLang: "es" },
  { id: "en", label: "EN", htmlLang: "en" },
];

export const localeToggleLabels: Localized<LocaleToggleLabels> = {
  es: {
    groupLabel: "Idioma",
    switchTo: { es: "Español", en: "Cambiar a inglés" },
  },
  en: {
    groupLabel: "Language",
    switchTo: { es: "Switch to Spanish", en: "English" },
  },
};

export const siteMetadata: Localized<SiteMetadata> = {
  es: {
    title: "Fabian — Software Engineer Full Stack & AI",
    description: "Diseño y desarrollo productos digitales que piensan, aprenden y resuelven problemas reales.",
  },
  en: {
    title: "Fabian — Full Stack & AI Software Engineer",
    description: "I design and build digital products that think, learn and solve real problems.",
  },
};
