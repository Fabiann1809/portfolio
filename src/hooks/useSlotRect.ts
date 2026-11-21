"use client";

import { useEffect, useRef, useState } from "react";
import type { SlotRect } from "@/types";

/**
 * Tracks the portrait slot ([data-portrait-slot]) inside the stage, in CSS px relative to the
 * stage. The rect lives in a ref (read per frame by the scene); `version` changes on every
 * measurement so a demand-mode canvas can redraw.
 */
export function useSlotRect(stage: HTMLElement | null) {
  const rect = useRef<SlotRect>({ x: 0, y: 0, w: 1, h: 1 });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const slot = stage?.querySelector<HTMLElement>("[data-portrait-slot]");
    if (!stage || !slot) return;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      rect.current = { x: r.left - s.left, y: r.top - s.top, w: r.width || 1, h: r.height || 1 };
      setVersion((v) => v + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(slot);
    return () => observer.disconnect();
  }, [stage]);

  return { rect, version };
}
