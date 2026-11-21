import type { RetroData } from "@/types";

/** Global CRT / film treatment (see components/layout/RetroOverlay.tsx). Tone colors live in globals.css. */
export const retro: RetroData = {
  grainOpacity: 0.08,
  grainSizePx: 160,
  grainFrequency: 0.8,
  scanlineOpacity: 0.05,
  scanlinePitchPx: 3,
  flicker: 0.008,
  flickerSeconds: 5,
};
