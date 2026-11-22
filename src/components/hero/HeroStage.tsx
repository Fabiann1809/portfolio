"use client";

import { useRef } from "react";
import { cycleBackdrop } from "@/lib/theme";

const INTERACTIVE =
  "a, button, input, textarea, select, [role='radio'], [role='radiogroup']";

/**
 * Container of the hero scene. Owns the click-to-cycle-backdrop behaviour.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    cycleBackdrop();
  }

  // Pointer position as --px/--py (-0.5..0.5); name and portrait tilt from it at different depths.
  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Over the header / controls (e.g. the language switch in the top corner) the name rests flat.
    if ((event.target as HTMLElement).closest("header, nav, " + INTERACTIVE)) {
      onPointerLeave();
      return;
    }
    const rect = el.getBoundingClientRect();
    el.style.setProperty(
      "--px",
      ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3),
    );
    el.style.setProperty(
      "--py",
      ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3),
    );
  }

  function onPointerLeave() {
    ref.current?.style.removeProperty("--px");
    ref.current?.style.removeProperty("--py");
  }

  return (
    <div
      ref={ref}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="studio-hero relative isolate flex min-h-svh flex-col overflow-hidden bg-background pb-8 xl:block xl:pb-0"
    >
      {children}
    </div>
  );
}
