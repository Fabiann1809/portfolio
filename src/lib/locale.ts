import { defaultLocale, localePrefix } from "@/data/locale";
import type { Locale } from "@/types";

/** Pathname of `path` ("/", "/projects") in the given language. */
export function localizePath(locale: Locale, path: string): string {
  const prefix = localePrefix[locale];
  if (!prefix) return path;
  return path === "/" ? prefix : prefix + path;
}

/** Language-neutral path ("/en/projects" gives "/projects") and the language it was in. */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  for (const locale of Object.keys(localePrefix) as Locale[]) {
    const prefix = localePrefix[locale];
    if (!prefix) continue;
    if (pathname === prefix) return { locale, path: "/" };
    if (pathname.startsWith(prefix + "/")) return { locale, path: pathname.slice(prefix.length) };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
