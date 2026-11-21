export interface IntroLetter {
  char: string;
  d: string;
}

export interface IntroTimings {
  /** Pen time per letter. */
  letterMs: number;
  /** Next letter starts this long before the previous one ends. */
  letterOverlapMs: number;
  fillMs: number;
  flourishMs: number;
  exitMs: number;
  reducedExitMs: number;
  /** Safety: overlay leaves after this even if the page is not ready. */
  maxWaitMs: number;
}

export interface IntroData {
  greeting: string;
  name: string;
  viewBox: string;
  letters: IntroLetter[];
  flourish: string;
  timings: IntroTimings;
}
