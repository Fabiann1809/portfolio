import type { ThemeColors } from "@/types";

/** Layout of the giant name on the generated hero screen texture (approximates the DOM hero). */
const NAME_WIDTH = 0.92;
const NAME_BASELINE = 0.7;
const REST_LIGHT = { x: 0.3, y: 0.22 };

interface HeroTextureOptions {
  text: string;
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

  ctx.font = `900 200px ${fontFamily}`;
  const measured = ctx.measureText(text).width || 1;
  const size = (200 * w * NAME_WIDTH) / measured;
  ctx.font = `900 ${size}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = colors.foreground;
  ctx.fillText(text, w / 2, h * NAME_BASELINE);
}
