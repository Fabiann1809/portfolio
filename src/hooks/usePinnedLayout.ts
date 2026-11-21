"use client";

import { useSyncExternalStore } from "react";
import { hasWebGL } from "@/lib/webgl";

const query = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(query).matches && hasWebGL();

/**
 * True when the WebGL scroll journey applies: md+, motion allowed and WebGL available.
 * `serverValue` is what server rendering / hydration assumes (default: no journey).
 */
export function usePinnedLayout(serverValue = false): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}
