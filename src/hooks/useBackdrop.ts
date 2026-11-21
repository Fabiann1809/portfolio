"use client";

import { useSyncExternalStore } from "react";
import { theme } from "@/data/theme";
import { readBackdrop, subscribeBackdrop } from "@/lib/theme";
import type { BackdropId } from "@/types";

/** Current backdrop id. Server and hydration assume the default dark one, then it re-reads. */
export function useBackdrop(): BackdropId {
  return useSyncExternalStore(subscribeBackdrop, readBackdrop, () => theme.defaultForDark);
}
