"use client";

import { useEffect, useState } from "react";

/**
 * Keeps the previous item around for `durationMs` after `item` changes, so both can be
 * rendered while one fades out and the other fades in.
 */
export function useCrossfade<T extends { id: string }>(item: T, durationMs: number) {
  const [current, setCurrent] = useState(item);
  const [leaving, setLeaving] = useState<T | null>(null);

  if (item.id !== current.id) {
    setLeaving(current);
    setCurrent(item);
  }

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), durationMs);
    return () => window.clearTimeout(id);
  }, [leaving, durationMs]);

  return { current, leaving };
}
