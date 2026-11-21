import { hero } from "@/data/hero";
import type { ThemeColors } from "@/types";

/** Barrel strength and line setup used by the 2D approximation of the hero wall. */
const { grid, mosaic } = hero.scene;
const { studio, screen, portrait } = hero;

interface HeroTextureOptions {
  text: string;
  /** CSS font-family of the display face (Doto); the caller must have loaded it. */
  fontFamily: string;
  colors: ThemeColors;
  /** Viewport size, so the texture has the same aspect as the filled screen. */
  viewport: { width: number; height: number };
}

/** Portrait decoded once, shared by every redraw (the hero scene loads the same file). */
let portraitImage: HTMLImageElement | null = null;
function getPortrait(): HTMLImageElement | null {
  if (!portraitImage) {
    portraitImage = new Image();
    portraitImage.src = portrait.src;
  }
  return portraitImage.complete && portraitImage.naturalWidth > 0 ? portraitImage : null;
}

/** Resolves once the portrait used by the mosaic is decoded (the caller then redraws the texture). */
export function whenPortraitReady(): Promise<void> {
  if (getPortrait()) return Promise.resolve();
  return (portraitImage as HTMLImageElement).decode().catch(() => {});
}

function token(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** Barrel-distorted wireframe wall: curved polylines on a regular grid (screen = wall / (1 + k r2)). */
function drawWall(ctx: CanvasRenderingContext2D, w: number, h: number, line: string) {
  const aspect = w / h;
  const k = grid.curve;
  const half = { x: (aspect / 2) * (1 + k), y: 0.5 * (1 + k) };
  // Two subdivision levels of the base cell, so the wall reads as dense as the scene.
  const cellW = aspect / (grid.baseCols * 2);
  const cols = Math.round((2 * half.x) / cellW);
  const rows = Math.round((2 * half.y) / (cellW * grid.cellAspect));
  const diag = 0.25 * (aspect * aspect + 1);
  const project = (wx: number, wy: number): [number, number] => {
    let sx = wx;
    let sy = wy;
    for (let i = 0; i < 3; i++) {
      const r2 = (sx * sx + sy * sy) / diag;
      sx = wx / (1 + k * r2);
      sy = wy / (1 + k * r2);
    }
    return [(sx / aspect + 0.5) * w, (0.5 - sy) * h];
  };
  ctx.strokeStyle = line;
  ctx.globalAlpha = grid.lineAlpha * 0.6;
  ctx.lineWidth = Math.max(1, w / 1400);
  const steps = 40;
  for (let c = 0; c <= cols; c++) {
    const wx = -half.x + (2 * half.x * c) / cols;
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const [x, y] = project(wx, -half.y + (2 * half.y * s) / steps);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    const wy = -half.y + (2 * half.y * r) / rows;
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const [x, y] = project(-half.x + (2 * half.x * s) / steps, wy);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** Portrait as a mosaic of square tiles (luminance mapped between the shadow / mid / high tones). */
function drawMosaic(ctx: CanvasRenderingContext2D, box: { x: number; y: number; w: number; h: number }, tones: [string, string, string]) {
  const image = getPortrait();
  if (!image) return;
  const cell = Math.max(4, Math.round(box.w / 70));
  const cols = Math.round(box.w / cell);
  const rows = Math.round(box.h / cell);
  const sample = document.createElement("canvas");
  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext("2d", { willReadFrequently: true });
  if (!sctx) return;
  sctx.drawImage(image, 0, 0, cols, rows);
  const data = sctx.getImageData(0, 0, cols, rows).data;
  const pad = cell * mosaic.gap * 0.5;
  for (let y = 0; y < rows; y++) {
    const fade = Math.min(1, (1 - y / rows) / mosaic.bottomFade);
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      if (data[i + 3] < 115) continue;
      if (fade < 1 && ((x * 7919 + y * 104729) % 100) / 100 > fade * 1.2) continue;
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      const l = Math.min(1, Math.max(0, (lum - 0.5) * mosaic.contrast + 0.5)) ** mosaic.gamma;
      ctx.fillStyle = l < 0.55 ? tones[0] : l < 0.8 ? tones[1] : tones[2];
      ctx.globalAlpha = (0.35 + 0.65 * l) * (0.4 + 0.6 * fade);
      ctx.fillRect(box.x + x * cell + pad, box.y + y * cell + pad, cell - pad * 2, cell - pad * 2);
    }
  }
  ctx.globalAlpha = 1;
}

/** Draws wall + portrait mosaic + giant name into a canvas (texture of the hero screen, desktop layout). */
export function drawHeroTexture(canvas: HTMLCanvasElement, { text, fontFamily, colors, viewport }: HeroTextureOptions) {
  const w = 1600;
  const h = Math.max(400, Math.round((w * viewport.height) / Math.max(1, viewport.width)));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = token("--crt-bg", colors.background);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
  glow.addColorStop(0, token("--crt-glow", bg));
  glow.addColorStop(0.7, bg);
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;

  drawWall(ctx, w, h, token("--crt-line", colors.foreground));

  // Portrait slot: same % layout as the DOM hero (centered, bottom-anchored), so the photo dissolves into the mosaic in place.
  const slotH = (studio.portraitHeight / 100) * h;
  const slotW = (slotH * portrait.width) / portrait.height;
  drawMosaic(ctx, { x: (w - slotW) / 2, y: h - slotH, w: slotW, h: slotH }, [
    token("--crt-shadow", bg),
    token("--crt-mid", colors.foreground),
    token("--crt-high", colors.foreground),
  ]);

  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.hypot(w, h) / 2);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, colors.vignette);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // Name: Doto 900 with tracking, width fit and vertical center, in front of the mosaic.
  const { nameFit, nameCenterY, nameTracking } = screen;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const setFont = (size: number) => {
    ctx.font = `900 ${size}px ${fontFamily}`;
    ctx.letterSpacing = nameTracking * size + "px";
  };
  setFont(200);
  const measured = ctx.measureText(text).width || 1;
  const size = Math.max(10, (200 * w * (nameFit / 100)) / measured);
  setFont(size);
  const metrics = ctx.measureText(text);
  const baseline = h * (nameCenterY / 100) + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

  const lit = token("--name-lit", colors.nameLit);
  ctx.fillStyle = lit;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = size * 0.1;
  ctx.fillText(text, w / 2, baseline);
  ctx.shadowBlur = 0;
}
