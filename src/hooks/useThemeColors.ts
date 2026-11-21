"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseThemeKey, readThemeKey, subscribeBackdrop } from "@/lib/theme";
import type { ThemeColors } from "@/types";

const SERVER_KEY = "#05070b|#dcecff|#ee5a22|#ffc233|rgba(0,0,0,0.6)|#ffffff|rgba(150,215,255,0.55)";

/** Theme tokens as colors for canvas / WebGL, updated when the backdrop changes. */
export function useThemeColors(): ThemeColors {
  const key = useSyncExternalStore(subscribeBackdrop, readThemeKey, () => SERVER_KEY);
  return useMemo(() => parseThemeKey(key), [key]);
}
