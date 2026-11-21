"use client";

import { useSyncExternalStore } from "react";
import { hasWebGL } from "@/lib/webgl";
import { prefersReducedMotion, subscribeReducedMotion } from "@/lib/motion";

const query = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  const offMotion = subscribeReducedMotion(onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    offMotion();
  };
}

const getSnapshot = () => window.matchMedia(query).matches && !prefersReducedMotion() && hasWebGL();

/**
 * True when the WebGL scroll journey applies: md+, motion allowed and WebGL available.
 * `serverValue` is what server rendering / hydration assumes (default: no journey).
 */
export function usePinnedLayout(serverValue = false): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}
