import { hero } from "@/data/hero";
import type { ThemeColors } from "@/types";

/** Layout of the giant name on the generated hero screen texture (approximates the DOM hero). */
const REST_LIGHT = { x: 0.3, y: 0.22 };

interface HeroTextureOptions {
  text: string;
  /** CSS font-family of the display face (Doto); the caller must have loaded it. */
  fontFamily: string;
  colors: ThemeColors;
  /** Viewport size, so the texture has the same aspect as the filled screen. */
  viewport: { width: number; height: number };
}

/** Draws backdrop + vignette + light + giant name into a canvas (texture of the hero screen). */
export function drawHeroTexture(canvas: HTMLCanvasElement, { text, fontFamily, colors, viewport }: HeroTextureOptions) {
  const w = 1600;
  const h = Math.max(400, Math.round((w * viewport.height) / Math.max(1, viewport.width)));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, w, h);

  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.38, w * 0.2, w * 0.5, h * 0.38, w * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, colors.vignette);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  const light = ctx.createRadialGradient(w * REST_LIGHT.x, h * REST_LIGHT.y, 0, w * REST_LIGHT.x, h * REST_LIGHT.y, Math.min(w, h) * 0.9);
  light.addColorStop(0, colors.lightTint);
  light.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);

  // Same layout as the DOM name: Doto 900, tracking, width fit, vertical center at nameCenterY.
  const { nameFit, nameCenterY, nameTracking, introClearancePx, nameRiseEm, letterRest } = hero.studio;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const setFont = (size: number) => {
    ctx.font = `900 ${size}px ${fontFamily}`;
    ctx.letterSpacing = nameTracking * size + "px";
  };
  setFont(200);
  const measured = ctx.measureText(text).width || 1;
  // Same cap as the DOM: capitals stay below the intro block (px scaled to the texture).
  const scale = w / Math.max(1, viewport.width);
  const introTop = Math.min(120, Math.max(88, 0.134 * viewport.height)) * scale;
  const maxSize = (h * (nameCenterY / 100) - introTop - introClearancePx * scale) / nameRiseEm;
  const size = Math.max(10, Math.min((200 * w * (nameFit / 100)) / measured, maxSize));
  setFont(size);
  const metrics = ctx.measureText(text);
  const baseline = h * (nameCenterY / 100) + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

  // Static mid proximity, like the DOM name without a pointer.
  ctx.fillStyle = colors.nameLit;
  ctx.fillStyle = `color-mix(in srgb, ${colors.nameLit} ${letterRest * 100}%, ${colors.nameDim})`;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = size * 0.08;
  ctx.fillText(text, w / 2, baseline);
}
