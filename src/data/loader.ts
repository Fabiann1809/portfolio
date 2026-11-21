import type { LoaderData } from "@/types/loader";

export const loader: LoaderData = {
  label: "LOADING",
  ariaLabel: "Loading",
  timings: {
    minDisplayMs: 1200,
    maxWaitMs: 5000,
    holdMs: 250,
    exitMs: 600,
    reducedExitMs: 150,
    smoothingMs: 180,
  },
};
