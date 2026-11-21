let cached: boolean | null = null;

/** Cached WebGL support check (client only). */
export function hasWebGL(): boolean {
  if (cached === null) {
    try {
      const canvas = document.createElement("canvas");
      cached = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      cached = false;
    }
  }
  return cached;
}
