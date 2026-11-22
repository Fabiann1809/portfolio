"use client";

import { themeLabels } from "@/data/theme";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useBackdrop } from "@/hooks/useBackdrop";
import { applyBackdrop } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface BackdropPickerProps {
  /** "full": icon plus the target mode's label (menu). "compact": icon only (navbar). */
  variant?: "full" | "compact";
  className?: string;
}

/** Light / dark toggle: shows a sun on the dark backdrop and a moon on the light one. */
export function BackdropPicker({ variant = "full", className }: BackdropPickerProps) {
  const current = useBackdrop();
  const labels = useLocalized(themeLabels);
  const dark = current === "ink";
  const next = dark ? "bone" : "ink";
  const label = `${labels.pickerLabel}: ${labels.options[next]}`;

  return (
    <button
      type="button"
      aria-label={label}
      title={labels.options[next]}
      onClick={() => applyBackdrop(next)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emphasis",
        variant === "full" ? "border border-line py-1.5 pr-4 pl-2 text-xs" : "p-1.5",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
      {variant === "full" && <span>{labels.options[next]}</span>}
    </button>
  );
}
