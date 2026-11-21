"use client";

import { useSyncExternalStore } from "react";
import { prefersReducedMotion, subscribeReducedMotion } from "@/lib/motion";

/** True when motion should be reduced. Server and hydration assume false, then it re-reads. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
}
