"use client";

import { theme } from "@/data/theme";
import { useBackdrop } from "@/hooks/useBackdrop";
import { applyBackdrop } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { BackdropId } from "@/types";

/** 9x9 dot-matrix pictograms ("#" = lit dot), drawn as SVG squares. */
const ICONS: Record<BackdropId, string[]> = {
  bone: [
    "....#....",
    ".#.....#.",
    "...###...",
    "..#####..",
    "#.#####.#",
    "..#####..",
    "...###...",
    ".#.....#.",
    "....#....",
  ],
  ink: [
    "...###...",
    "..###....",
    ".###.....",
    ".###.....",
    ".###.....",
    ".###.....",
    "..###..##",
    "...#####.",
    ".....###.",
  ],
};

function DotIcon({ id }: { id: BackdropId }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 9 9" className="size-[18px]" shapeRendering="crispEdges" fill="currentColor">
      {ICONS[id].flatMap((row, y) =>
        Array.from(row).map((cell, x) => (cell === "#" ? <rect key={x + "-" + y} x={x + 0.08} y={y + 0.08} width={0.84} height={0.84} rx={0.2} /> : null)),
      )}
    </svg>
  );
}

interface ThemeToggleProps {
  /** Show the mode label next to each icon (mobile menu). */
  withLabels?: boolean;
  className?: string;
}

/** Two-option light / dark switch: a group of toggle buttons (aria-pressed) with dot-matrix sun / moon. */
export function ThemeToggle({ withLabels = false, className }: ThemeToggleProps) {
  const current = useBackdrop();

  return (
    <div role="group" aria-label={theme.switchLabel} className={cn("inline-flex items-center gap-1 rounded-full border border-line p-0.5", className)}>
      {theme.options.map((option) => {
        const pressed = option.id === current;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={pressed}
            aria-label={option.label}
            title={option.label}
            onClick={() => applyBackdrop(option.id)}
            className={cn(
              "label inline-flex h-8 items-center justify-center gap-2 rounded-full text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emphasis",
              withLabels ? "px-3.5" : "w-8",
              pressed ? "bg-foreground text-background" : "text-muted hover:text-foreground",
            )}
          >
            <DotIcon id={option.id} />
            {withLabels && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
