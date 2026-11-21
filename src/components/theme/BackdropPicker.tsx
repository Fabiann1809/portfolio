"use client";

import { useRef } from "react";
import { theme } from "@/data/theme";
import { useBackdrop } from "@/hooks/useBackdrop";
import { applyBackdrop } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface BackdropPickerProps {
  /** "full": pill with caption and labels (hero). "compact": swatches only (navbar, menu). */
  variant?: "full" | "compact";
  className?: string;
}

/** Radio group that switches the site-wide backdrop tone (ink / bone / signal). */
export function BackdropPicker({ variant = "full", className }: BackdropPickerProps) {
  const current = useBackdrop();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const full = variant === "full";
  const { options } = theme;

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    applyBackdrop(options[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={theme.pickerLabel}
      className={cn(
        "inline-flex items-center",
        full
          ? "gap-3 rounded-full border border-line bg-surface/70 py-1.5 pr-2 pl-4 backdrop-blur"
          : "gap-1.5",
        className,
      )}
    >
      {full && <span className="label text-xs text-muted">{theme.pickerCaption}</span>}
      {options.map((option, index) => {
        const checked = option.id === current;
        return (
          <button
            key={option.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.label}
            title={option.label}
            tabIndex={checked ? 0 : -1}
            onClick={() => applyBackdrop(option.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emphasis",
              full ? "label py-1 pr-3 pl-1.5 text-xs" : "p-1",
              checked ? "bg-foreground/10 text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "block rounded-full border border-foreground/30",
                full ? "size-4" : "size-3.5",
                checked && "ring-2 ring-foreground/70 ring-offset-1 ring-offset-transparent",
              )}
              style={{ backgroundColor: option.swatch }}
            />
            {full && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
