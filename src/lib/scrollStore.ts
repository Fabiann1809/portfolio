import type Lenis from "lenis";

/**
 * Lightweight global scroll store. Values live in plain mutable fields so they can be
 * read every frame (e.g. inside R3F useFrame) without triggering React renders.
 * React code that needs to react to changes uses subscribe().
 */
const state = {
  scroll: 0,
  limit: 0,
  progress: 0,
  velocity: 0,
};

const listeners = new Set<() => void>();

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function update(scroll: number, limit: number, velocity: number) {
  state.scroll = scroll;
  state.limit = limit;
  state.progress = limit > 0 ? clamp01(scroll / limit) : 0;
  state.velocity = velocity;
  listeners.forEach((fn) => fn());
}

/** Raw state for per-frame reads. Do not mutate. */
export function getScrollState() {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Feeds the store from Lenis 'scroll' events, or from native scroll events when
 * no Lenis instance exists (reduced motion). Returns a disconnect function.
 */
export function connectScroll(lenis: Lenis | null): () => void {
  const onResize = () => {
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    update(window.scrollY, limit, 0);
  };
  window.addEventListener("resize", onResize);

  let off: () => void;
  if (lenis) {
    off = lenis.on("scroll", (l: Lenis) => update(l.scroll, l.limit, l.velocity));
    update(lenis.scroll, lenis.limit, 0);
  } else {
    let last = window.scrollY;
    const onScroll = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      update(window.scrollY, limit, window.scrollY - last);
      last = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    off = () => window.removeEventListener("scroll", onScroll);
    onScroll();
  }

  return () => {
    off();
    window.removeEventListener("resize", onResize);
  };
}
