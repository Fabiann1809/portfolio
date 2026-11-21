"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 5000);
  return () => window.clearInterval(id);
}

const minute = () => Math.floor(Date.now() / 60000);

/** Current time as a Date, refreshed every minute. Null on the server / hydration. */
export function useNow(): Date | null {
  const stamp = useSyncExternalStore(subscribe, minute, () => 0);
  return stamp ? new Date(stamp * 60000) : null;
}
