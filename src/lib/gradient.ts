/** Numbers that define a placeholder gradient, derived deterministically from a seed. */
function gradientParams(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  return { angle: h % 360, x: (h >>> 8) % 100, y: (h >>> 16) % 100, mix: 30 + ((h >>> 4) % 40) };
}

/** Deterministic gradient (from a seed) built on the accent CSS variables. Used as image placeholder. */
export function placeholderGradient(seed: string): string {
  const { angle, x, y, mix } = gradientParams(seed);
  return (
    `radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, var(--color-accent) ${mix}%, transparent), transparent 60%), ` +
    `linear-gradient(${angle}deg, color-mix(in srgb, var(--color-primary) 70%, var(--surface)), color-mix(in srgb, var(--color-accent) ${mix}%, var(--surface)))`
  );
}

/** Resolves any CSS color (including color-mix) to rgba by painting one pixel. Client only. */
function resolveRgba(ctx: CanvasRenderingContext2D, css: string): [number, number, number, number] {
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2], d[3] / 255];
}

/** Paints the same gradient as `placeholderGradient` onto a 2D canvas (client only). Used as a WebGL texture. */
export function paintPlaceholder(canvas: HTMLCanvasElement, seed: string): void {
  const ctx = canvas.getContext("2d");
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx || !pctx) return;
  const root = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback;
  const primary = v("--color-primary", "#ee5a22");
  const accent = v("--color-accent", "#ffc233");
  const surface = v("--surface", "#0b111a");
  const { angle, x, y, mix } = gradientParams(seed);
  const { width: w, height: h } = canvas;
  const rgba = ([r, g, b, a]: number[]) => `rgba(${r},${g},${b},${a})`;

  // linear layer (CSS angle: 0deg points up, clockwise)
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2;
  const lin = ctx.createLinearGradient(w / 2 - dx * half, h / 2 - dy * half, w / 2 + dx * half, h / 2 + dy * half);
  lin.addColorStop(0, rgba(resolveRgba(pctx, `color-mix(in srgb, ${primary} 70%, ${surface})`)));
  lin.addColorStop(1, rgba(resolveRgba(pctx, `color-mix(in srgb, ${accent} ${mix}%, ${surface})`)));
  ctx.fillStyle = lin;
  ctx.fillRect(0, 0, w, h);

  // radial layer: accent fading to transparent at 60% of the farthest corner
  const cx = (x / 100) * w;
  const cy = (y / 100) * h;
  const far = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy));
  const [r, g, b, a] = resolveRgba(pctx, `color-mix(in srgb, ${accent} ${mix}%, transparent)`);
  const rad2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, far);
  rad2.addColorStop(0, rgba([r, g, b, a]));
  rad2.addColorStop(0.6, rgba([r, g, b, 0]));
  ctx.fillStyle = rad2;
  ctx.fillRect(0, 0, w, h);
}
