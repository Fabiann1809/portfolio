"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeOptions, localeToggleLabels } from "@/data/locale";
import { useLocale } from "@/components/locale/LocaleProvider";
import { localizePath, splitLocalePath } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface LocaleToggleProps {
  /** "pill": compact links inside the header pill. "menu": larger links in the mobile menu. "chip": mobile header, active option filled. */
  variant?: "pill" | "menu" | "chip";
  className?: string;
}

/** ES / EN switch: each option links to the same page in that language. */
export function LocaleToggle({ variant = "pill", className }: LocaleToggleProps) {
  const current = useLocale();
  const pathname = usePathname();
  const labels = localeToggleLabels[current];
  const { path } = splitLocalePath(pathname);
  const menu = variant === "menu";
  const chip = variant === "chip";

  return (
    <div role="group" aria-label={labels.groupLabel} className={cn("flex items-center", menu ? "gap-2" : "gap-0.5", className)}>
      {localeOptions.map((option) => {
        const active = option.id === current;
        return (
          <Link
            key={option.id}
            href={localizePath(option.id, path)}
            lang={option.htmlLang}
            hrefLang={option.htmlLang}
            aria-label={labels.switchTo[option.id]}
            aria-current={active ? "true" : undefined}
            scroll={false}
            onClick={(event) => {
              if (active) return;
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
              // Same page in both languages: swap the URL in place (Next syncs usePathname with
              // history.pushState) instead of navigating, so the page is not remounted or duplicated.
              event.preventDefault();
              window.history.pushState(null, "", localizePath(option.id, path) + window.location.hash);
            }}
            className={cn(
              "label block rounded-full transition-colors duration-300",
              menu ? "border border-line px-4 py-2 text-sm" : chip ? "flex size-8 items-center justify-center text-[11px]" : "px-2 py-1.5 text-[11px] 2xl:text-xs",
              chip && active
                ? "bg-emphasis text-background"
                : active
                  ? "text-emphasis"
                  : "text-foreground/80 hover:text-emphasis",
              menu && active && "border-emphasis",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
