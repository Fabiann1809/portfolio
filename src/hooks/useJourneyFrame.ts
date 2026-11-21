"use client";

import { useEffect, useRef } from "react";
import { subscribeJourneyFrame } from "@/lib/journey";

/** Runs `callback` once per rendered journey frame (after the damped state was stepped). */
export function useJourneyFrame(callback: () => void) {
  const ref = useRef(callback);
  useEffect(() => {
    ref.current = callback;
  });
  useEffect(() => subscribeJourneyFrame(() => ref.current()), []);
}
