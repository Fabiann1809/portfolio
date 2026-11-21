import type { HeroTint } from "@/types";

const VARS = ["--crt-bg", "--crt-glow", "--crt-line", "--crt-hot", "--crt-shadow", "--crt-mid", "--crt-high", "--crt-streak"] as const;
const SEP = "|";

/** Fallback (ink tone) used by the server render and hydration. */
export const SERVER_TINT_KEY = "#05070b|#0d1c30|#cfe8ff|#ffffff|#0b1a2c|#5aa6d4|#e8f7ff|#bfe6ff";

/** Serialised snapshot of the --crt-* tokens (stable string, cheap to compare). */
export function readTintKey(): string {
  const style = getComputedStyle(document.documentElement);
  return VARS.map((name) => style.getPropertyValue(name).trim()).join(SEP);
}

export function parseTintKey(key: string): HeroTint {
  const [bg, glow, line, hot, shadow, mid, high, streak] = key.split(SEP);
  return { bg, glow, line, hot, shadow, mid, high, streak };
}
