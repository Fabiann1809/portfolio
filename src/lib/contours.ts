/** Pure math for the topographic backdrop: animated value noise and marching squares. */

function hash(x: number, y: number, z: number): number {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth 3D value noise in 0..1. */
export function valueNoise(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const w = fade(z - zi);
  const layer = (zz: number) =>
    lerp(
      lerp(hash(xi, yi, zz), hash(xi + 1, yi, zz), u),
      lerp(hash(xi, yi + 1, zz), hash(xi + 1, yi + 1, zz), u),
      v,
    );
  return lerp(layer(zi), layer(zi + 1), w);
}

/** Fractal noise, normalised to roughly 0..1. */
export function fbm(x: number, y: number, z: number, octaves: number): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise(x * f + i * 17.3, y * f - i * 9.1, z * f) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

/**
 * Appends the iso-line segments of `level` to `path` (marching squares over a cols x rows
 * sample grid; `values` has (cols + 1) * (rows + 1) entries; cell size in px).
 */
export function addIsoLine(
  path: Path2D,
  values: Float32Array,
  cols: number,
  rows: number,
  cell: number,
  level: number,
) {
  const stride = cols + 1;
  const cross = (a: number, b: number) => (level - a) / (b - a);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = values[j * stride + i]; // top-left
      const b = values[j * stride + i + 1]; // top-right
      const c = values[(j + 1) * stride + i + 1]; // bottom-right
      const d = values[(j + 1) * stride + i]; // bottom-left
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * cell;
      const y = j * cell;
      const top = [x + cross(a, b) * cell, y] as const;
      const right = [x + cell, y + cross(b, c) * cell] as const;
      const bottom = [x + cross(d, c) * cell, y + cell] as const;
      const left = [x, y + cross(a, d) * cell] as const;
      const seg = (p: readonly [number, number], q: readonly [number, number]) => {
        path.moveTo(p[0], p[1]);
        path.lineTo(q[0], q[1]);
      };
      switch (idx) {
        case 1: case 14: seg(left, bottom); break;
        case 2: case 13: seg(bottom, right); break;
        case 3: case 12: seg(left, right); break;
        case 4: case 11: seg(top, right); break;
        case 5: seg(top, right); seg(left, bottom); break;
        case 6: case 9: seg(top, bottom); break;
        case 7: case 8: seg(top, left); break;
        case 10: seg(top, left); seg(bottom, right); break;
      }
    }
  }
}

/** Parses "#rgb", "#rrggbb" or "rgb(a)(...)" to [r, g, b]. Falls back to white. */
export function parseColor(value: string): [number, number, number] {
  const v = value.trim();
  if (v.startsWith("#")) {
    const h = v.length === 4 ? v.slice(1).replace(/./g, "$&$&") : v.slice(1, 7);
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = v.match(/[\d.]+/g);
  return m && m.length >= 3 ? [Number(m[0]), Number(m[1]), Number(m[2])] : [255, 255, 255];
}
