const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_";

/** Text partially decoded: `k` runs 0..1, characters resolve left to right through random glyphs. */
export function scrambleFrame(target: string, k: number): string {
  if (k >= 1) return target;
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const local = Math.min(1, Math.max(0, k * 1.5 - (i / target.length) * 0.5));
    out += local >= 1 || target[i] === " " ? target[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}
