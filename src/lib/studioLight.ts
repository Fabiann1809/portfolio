/** Shared state of the hero light cursor, read by the WebGL scene and the lettering every frame. */

export interface LightPoint {
  /** 0..1 across the stage (y grows downward). */
  x: number;
  y: number;
}

/** Where the light rests without a pointer (top-left, as on touch devices). */
export const restingLight: LightPoint = { x: 0.3, y: 0.22 };

export interface LightState extends LightPoint {
  /** True once a mouse / pen moved over the hero: the light then follows it and the head looks at it. */
  active: boolean;
}

/** Damped light position (mutated by useStudioLight, no React state: the scene reads it per frame). */
export const lightState: LightState = { ...restingLight, active: false };

export interface Offset {
  x: number;
  y: number;
}

/** Proximity (0..1) of the light to a point: 1 on top of it, 0 beyond `radius` (px). Smoothstep falloff. */
export function proximity(light: Offset, point: Offset, radius: number): number {
  const t = 1 - Math.min(1, Math.hypot(light.x - point.x, light.y - point.y) / Math.max(1, radius));
  return t * t * (3 - 2 * t);
}
