import type { EnvironmentConfig } from "@/types";

/**
 * Draws the pseudo-code lines that drift across the studio floor onto a canvas. Only the
 * alpha channel matters (the shader tints it); the canvas tiles in both directions.
 */
export function drawStudioText(canvas: HTMLCanvasElement, config: EnvironmentConfig["text"], fontFamily: string) {
  const size = config.textureSize;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";
  ctx.font = `${config.fontSize}px ${fontFamily}`;

  const rows = Math.floor(size / config.lineHeight);
  let seed = 13;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let row = 0; row < rows; row++) {
    const line = config.lines[(row * 5 + 3) % config.lines.length];
    // Varied indent and a few blank rows give the text its ragged, code-like rhythm.
    if (rnd() < 0.18) continue;
    const indent = Math.floor(rnd() * 4) * config.fontSize * 1.2;
    const x = ((indent + rnd() * 40) % size) - 20;
    ctx.globalAlpha = 0.55 + rnd() * 0.45;
    ctx.fillText(line, x, row * config.lineHeight);
    // Wrap so the texture tiles horizontally.
    ctx.fillText(line, x - size, row * config.lineHeight);
    ctx.fillText(line, x + size, row * config.lineHeight);
  }
  ctx.globalAlpha = 1;
}
