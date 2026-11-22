"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Locale, Localized } from "@/types";
import { defaultLocale, localeOptions, siteMetadata } from "@/data/locale";
import { splitLocalePath } from "@/lib/locale";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Provides the language of the current route, read from the URL ("/en/..." is English). */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { locale } = splitLocalePath(usePathname() ?? "/");

  useEffect(() => {
    document.documentElement.lang = localeOptions.find((option) => option.id === locale)?.htmlLang ?? locale;
    // In-place language switches skip the route's metadata, so keep the tab title in sync here.
    document.title = String(siteMetadata[locale].title);
  }, [locale]);

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Picks the content of the current language from a per-language data object. */
export function useLocalized<T>(content: Localized<T>): T {
  return content[useLocale()];
}
