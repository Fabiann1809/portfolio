import { CanvasTexture } from "three";

let texture: CanvasTexture | null = null;

/** Shared soft radial blob used as the contact shadow under screens (created once, never disposed). */
export function getShadowTexture(): CanvasTexture {
  if (texture) return texture;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.45, "rgba(0,0,0,0.55)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  texture = new CanvasTexture(canvas);
  return texture;
}
