export interface LoaderTimings {
  /** Displayed progress cannot reach 100% before this. */
  minDisplayMs: number;
  /** Safety: the loader finishes after this even if tasks are pending. */
  maxWaitMs: number;
  /** Pause at 100% before the exit starts. */
  holdMs: number;
  exitMs: number;
  /** Exit duration when prefers-reduced-motion is set. */
  reducedExitMs: number;
  /** Smoothing time constant for the displayed value. */
  smoothingMs: number;
}

export interface LoaderData {
  label: string;
  /** Accessible name of the progress bar. */
  ariaLabel: string;
  timings: LoaderTimings;
}

export interface LoaderContextValue {
  /** True once the preloader starts leaving; the site then animates in. */
  loaded: boolean;
  completeLoading: () => void;
  /** Register an extra task (e.g. a 3D asset). Returns an unregister function. */
  registerTask: (id: string) => () => void;
  /** Report progress (0..1) of a registered task. 1 marks it complete. */
  setTaskProgress: (id: string, progress: number) => void;
  /** Current combined progress target (0..1). Read inside animation frames. */
  getProgress: () => number;
}
