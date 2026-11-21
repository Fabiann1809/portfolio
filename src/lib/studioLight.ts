/** Pure math of the hero "studio light": where shadows fall for a given light position. */

import { hero } from "@/data/hero";

export interface LightPoint {
  /** 0..1 across the stage. */
  x: number;
  y: number;
}

/** Where the light rests without a pointer (top-left, as on touch devices). */
export const restingLight: LightPoint = { x: 0.3, y: 0.22 };

/** Centre of the portrait on the stage (0..1). */
const subject: LightPoint = { x: 0.5, y: 0.62 };

const shadowRange = {
  portrait: { offset: 64, blurBase: 16, blurGain: 44 },
  name: { offset: 34, blurBase: 8, blurGain: 26 },
};

/** CSS variables for the stage: light position (%) plus offset / blur of both shadows (px). */
export function lightVars(light: LightPoint, width: number, height: number): Record<string, string> {
  const dx = (subject.x - light.x) * width;
  const dy = (subject.y - light.y) * height;
  const length = Math.hypot(dx, dy) || 1;
  // 0 when the light sits on the subject, 1 when it is far away (diagonal-ish).
  const strength = Math.min(1, length / (Math.hypot(width, height) * 0.6));
  const ux = dx / length;
  const uy = dy / length;

  const vars: Record<string, string> = {
    "--light-x": light.x * 100 + "%",
    "--light-y": light.y * 100 + "%",
  };
  // Cast silhouette: static at the resting light, slides opposite to the light's movement.
  const cfg = hero.portraitShadow;
  const clamp = (v: number) => Math.max(-cfg.maxOffset, Math.min(cfg.maxOffset, v));
  const sx = clamp(cfg.baseX - (light.x - restingLight.x) * 2 * cfg.travelX);
  const sy = clamp(cfg.baseY - (light.y - restingLight.y) * 2 * cfg.travelY);
  vars["--shadow-x"] = sx.toFixed(1) + "px";
  vars["--shadow-y"] = sy.toFixed(1) + "px";
  vars["--shadow-skew"] = (cfg.skewBase + (sx / 100) * cfg.skewPer100).toFixed(2) + "deg";
  vars["--shadow-blur"] = (cfg.blurMin + (cfg.blurMax - cfg.blurMin) * strength).toFixed(1) + "px";
  for (const [key, range] of [["p", shadowRange.portrait], ["n", shadowRange.name]] as const) {
    vars[`--${key}-sx`] = (ux * range.offset * strength).toFixed(1) + "px";
    vars[`--${key}-sy`] = (uy * range.offset * strength).toFixed(1) + "px";
    vars[`--${key}-blur`] = (range.blurBase + range.blurGain * strength).toFixed(1) + "px";
  }
  return vars;
}
