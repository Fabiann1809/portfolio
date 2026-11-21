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
  reveal: { stagger: 70, rise: 24 },
};
