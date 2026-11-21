import type { ContourBackdropData } from "@/types";

export const contourBackdrop: ContourBackdropData = {
  maxPixelRatio: 2,
  frequency: 1.2,
  levels: 7,
  drift: [0.01, 0.016],
  lineSoftness: 1.2,
  idleAlpha: 0.5,
  hotAlpha: 0.85,
  pointer: {
    bumpK: 12,
    bumpAmp: 0.32,
    trailAmp: 0.28,
    brushSize: 150,
    trailScale: 0.5,
    trailDecay: 0.94,
    idleSeconds: 2.2,
    easeRate: 4,
  },
  brackets: {
    size: 28,
    inset: { top: 76, side: 20, bottom: 20 },
  },
};
