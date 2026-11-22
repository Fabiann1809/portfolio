"use client";

import { createContext, useContext } from "react";
import type { Locale, Localized } from "@/types";
import { defaultLocale } from "@/data/locale";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Provides the language of the current route (set by the root layout of each language). */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Picks the content of the current language from a per-language data object. */
export function useLocalized<T>(content: Localized<T>): T {
  return content[useLocale()];
}
