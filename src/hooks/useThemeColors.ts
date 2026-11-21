"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseThemeKey, readThemeKey, subscribeBackdrop } from "@/lib/theme";
import type { ThemeColors } from "@/types";

const SERVER_KEY = "#0a0c0a|#e6ede0|#ee5a22|#ffc233|rgba(210,255,220,0.14)|rgba(0,0,0,0.55)|#eaf5e4|#3d453b|rgba(170,255,190,0.32)";

/** Theme tokens as colors for canvas / WebGL, updated when the backdrop changes. */
export function useThemeColors(): ThemeColors {
  const key = useSyncExternalStore(subscribeBackdrop, readThemeKey, () => SERVER_KEY);
  return useMemo(() => parseThemeKey(key), [key]);
}
