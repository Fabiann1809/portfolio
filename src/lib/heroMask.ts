import { DataTexture, LinearFilter, RGBAFormat, UnsignedByteType } from "three";
import type { HeroGrid } from "@/types";

/**
 * Domain of the silhouette mask in portrait coordinates (0..1 over the photo, y up): it extends
 * beyond the photo so the quadtree subdivision can fade out smoothly around the figure.
 */
export const MASK_DOMAIN = { x: -0.5, y: -0.3, w: 2.0, h: 1.6 } as const;

type Grid = { data: Float32Array; w: number; h: number };

/** Separable box max (dilate) or mean (blur) over a float grid, radius in cells. */
function boxPass(src: Grid, radius: number, mode: "max" | "mean"): Grid {
  const { w, h } = src;
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const run = (from: Float32Array, to: Float32Array, horizontal: boolean) => {
    const lines = horizontal ? h : w;
    const len = horizontal ? w : h;
    for (let l = 0; l < lines; l++) {
      for (let i = 0; i < len; i++) {
        let acc = 0;
        let count = 0;
        for (let k = -radius; k <= radius; k++) {
          const j = i + k;
          if (j < 0 || j >= len) continue;
          const v = from[horizontal ? l * w + j : j * w + l];
          acc = mode === "max" ? Math.max(acc, v) : acc + v;
          count++;
        }
        to[horizontal ? l * w + i : i * w + l] = mode === "max" ? acc : acc / Math.max(1, count);
      }
    }
  };
  run(src.data, tmp, true);
  run(tmp, out, false);
  return { data: out, w, h };
}

/**
 * Builds the low-res silhouette mask (alpha of the portrait, dilated then blurred, placed in
 * MASK_DOMAIN) as a texture. Row 0 is the bottom of the domain (uv y up).
 */
export function buildMaskTexture(image: HTMLImageElement | ImageBitmap, grid: HeroGrid): DataTexture {
  const cols = grid.maskCols;
  const rows = Math.round((cols * (MASK_DOMAIN.h * image.height)) / (MASK_DOMAIN.w * image.width));
  const photoCols = Math.round(cols / MASK_DOMAIN.w);
  const photoRows = Math.round((rows / MASK_DOMAIN.h));
  const canvas = document.createElement("canvas");
  canvas.width = photoCols;
  canvas.height = photoRows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const alpha = new Float32Array(cols * rows);
  if (ctx) {
    ctx.drawImage(image, 0, 0, photoCols, photoRows);
    const px = ctx.getImageData(0, 0, photoCols, photoRows).data;
    const offX = Math.round(-MASK_DOMAIN.x * photoCols);
    const offYBottom = Math.round(-MASK_DOMAIN.y * photoRows);
    for (let y = 0; y < photoRows; y++) {
      for (let x = 0; x < photoCols; x++) {
        const a = px[(y * photoCols + x) * 4 + 3] / 255;
        const row = offYBottom + (photoRows - 1 - y); // flip: canvas row 0 is the top
        const col = offX + x;
        if (row >= 0 && row < rows && col >= 0 && col < cols) alpha[row * cols + col] = a;
      }
    }
  }

  let grid2: Grid = { data: alpha, w: cols, h: rows };
  if (grid.maskDilate > 0) grid2 = boxPass(grid2, grid.maskDilate, "max");
  for (let i = 0; i < 3; i++) grid2 = boxPass(grid2, grid.maskBlur, "mean");

  // The blur lowers the peak; stretch so the figure itself reads ~1.
  let peak = 0;
  for (const v of grid2.data) peak = Math.max(peak, v);
  const gain = peak > 0 ? 1 / peak : 1;
  const bytes = new Uint8Array(cols * rows * 4);
  for (let i = 0; i < cols * rows; i++) {
    const v = Math.round(Math.min(1, grid2.data[i] * gain) * 255);
    bytes[i * 4] = v;
    bytes[i * 4 + 1] = v;
    bytes[i * 4 + 2] = v;
    bytes[i * 4 + 3] = 255;
  }
  const texture = new DataTexture(bytes, cols, rows, RGBAFormat, UnsignedByteType);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}
