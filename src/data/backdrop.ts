import type { ContourBackdropData } from "@/types";

export const contourBackdrop: ContourBackdropData = {
  cellSize: { desktop: 14, mobile: 20 },
  maxPixelRatio: 1.5,
  fps: 30,
  levels: 18,
  levelRange: [0.3, 0.7],
  majorEvery: 4,
  lineWidth: 0.8,
  majorLineWidth: 1.3,
  frequency: 1.6,
  octaves: 3,
  driftSpeed: 0.035,
  warpSpeed: 0.05,
  baseAlpha: 1,
  scan: {
    periodSeconds: 12,
    bandWidth: 140,
    lineAlpha: 0.5,
    contourAlpha: 0.9,
  },
  light: {
    radius: 0.34,
    boost: 0.55,
  },
  brackets: {
    size: 28,
    inset: { top: 76, side: 20, bottom: 20 },
  },
};
