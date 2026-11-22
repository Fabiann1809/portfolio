/** One card of the cloud. Positions are normalized; the scene scales them by the layout spread. */
export interface CloudCard {
  key: string;
  /** Index in the artworks array (artworks repeat to fill the cloud). */
  artIndex: number;
  /** Card size in units (see ArtCloudLayout). */
  width: number;
  height: number;
  /** Angle (rad) on the cloud ring and distance from the axis (0-1). */
  theta: number;
  radius: number;
  /** Vertical position (-1 to 1). */
  y: number;
  /** Fixed yaw and roll (deg) of the card. */
  yaw: number;
  roll: number;
}

/** Small deterministic PRNG (mulberry32): the same seed always yields the same sequence. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (v: number) => Math.round(v * 1000) / 1000;

/** Builds `count` cards from the artworks' aspects, repeating them as needed. Pure and deterministic. */
export function buildCloudCards(aspects: number[], count: number, seed: number): CloudCard[] {
  const rand = seeded(seed);
  const n = Math.max(1, aspects.length);
  return Array.from({ length: count }, (_, i) => {
    const artIndex = i % n;
    const aspect = aspects[artIndex] ?? 1;
    const size = 0.75 + rand() * 0.6;
    return {
      key: `card-${i}`,
      artIndex,
      width: round(size * Math.sqrt(aspect)),
      height: round(size / Math.sqrt(aspect)),
      theta: (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.8,
      radius: 0.3 + 0.7 * Math.sqrt(rand()),
      y: (rand() - 0.5) * 2,
      yaw: (rand() - 0.5) * 18,
      roll: (rand() - 0.5) * 6,
    };
  });
}
