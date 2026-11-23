import type { MotionData } from "@/types";

export const motion: MotionData = {
  lenis: { lerp: 0.08, wheelMultiplier: 0.9 },
  originScrollVh: 260,
  missionScreensPerProject: 1,
  tunnel: {
    perspective: 900,
    spacing: 900,
    rings: 16,
    ringStep: 0.5,
    hotEvery: 4,
    damping: 4.5,
    panelWidth: 0.46,
    panelMaxPx: 640,
  },
  gallery: {
    x: [0, 0.64, 1.02, 1.24],
    scale: [1, 0.82, 0.68, 0.56],
    rotate: [0, 34, 42, 46],
    depth: [0, -140, -240, -320],
    opacity: [1, 0.6, 0.32, 0.12],
    xCompact: [0, 0.6, 0.9, 1.1],
    visible: 3,
    visibleCompact: 1,
    perspective: 1400,
    transitionMs: 520,
    scrollVh: 70,
    scrollVhCompact: 42,
  },
  reveal: { stagger: 70, rise: 24 },
};
