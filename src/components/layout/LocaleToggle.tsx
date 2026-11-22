"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeOptions, localeToggleLabels } from "@/data/locale";
import { useLocale } from "@/components/locale/LocaleProvider";
import { localizePath, splitLocalePath } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface LocaleToggleProps {
  /** "pill": compact links inside the header pill. "menu": larger links in the mobile menu. */
  variant?: "pill" | "menu";
  className?: string;
}

/** ES / EN switch: each option links to the same page in that language. */
export function LocaleToggle({ variant = "pill", className }: LocaleToggleProps) {
  const current = useLocale();
  const pathname = usePathname();
  const labels = localeToggleLabels[current];
  const { path } = splitLocalePath(pathname);
  const menu = variant === "menu";

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
            scroll={!active}
            className={cn(
              "label block rounded-full transition-colors duration-300",
              menu ? "border border-line px-4 py-2 text-sm" : "px-2 py-1.5 text-[11px] 2xl:text-xs",
              active ? "text-emphasis" : "text-foreground/80 hover:text-emphasis",
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
