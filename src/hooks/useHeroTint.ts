"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseTintKey, readTintKey, SERVER_TINT_KEY } from "@/lib/heroTint";
import { subscribeBackdrop } from "@/lib/theme";
import type { HeroTint } from "@/types";

/** CRT colors of the active tone for the hero WebGL scene; updates when the backdrop changes. */
export function useHeroTint(): HeroTint {
  const key = useSyncExternalStore(subscribeBackdrop, readTintKey, () => SERVER_TINT_KEY);
  return useMemo(() => parseTintKey(key), [key]);
}
