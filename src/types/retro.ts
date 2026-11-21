export interface RetroData {
  /** Film grain opacity (0..1) and tile size (px); frequency is the feTurbulence baseFrequency. */
  grainOpacity: number;
  grainSizePx: number;
  grainFrequency: number;
  /** Scanline opacity (0..1) and line pitch (px). */
  scanlineOpacity: number;
  scanlinePitchPx: number;
  /** Flicker depth as an opacity drop (0.005..0.01); 0 disables it. */
  flicker: number;
  /** Duration of one flicker cycle (s). */
  flickerSeconds: number;
}
