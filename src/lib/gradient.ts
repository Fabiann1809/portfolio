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
