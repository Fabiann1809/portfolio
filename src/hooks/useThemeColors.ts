"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseThemeKey, readThemeKey, subscribeBackdrop } from "@/lib/theme";
import type { ThemeColors } from "@/types";

const SERVER_KEY = "#0b0b0c|#f2efe9|#ff5a1f|#ffc233|rgba(255,244,220,0.16)|rgba(0,0,0,0.55)";

/** Theme tokens as colors for canvas / WebGL, updated when the backdrop changes. */
export function useThemeColors(): ThemeColors {
  const key = useSyncExternalStore(subscribeBackdrop, readThemeKey, () => SERVER_KEY);
  return useMemo(() => parseThemeKey(key), [key]);
}
