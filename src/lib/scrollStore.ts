import type Lenis from "lenis";

/**
 * Lightweight global scroll store. Values live in plain mutable fields so they can be
 * read every frame (e.g. inside R3F useFrame) without triggering React renders.
 * React code that needs to react to changes uses subscribe().
 */
interface SectionMetrics {
  /** Scroll distance past the section top, in viewport heights. Negative before it. */
  offset: number;
  /** 0..1 progress through the section's pinned range. */
  progress: number;
}

const state = {
  scroll: 0,
  limit: 0,
  progress: 0,
  velocity: 0,
  lastUpdate: 0,
};

const sections = new Map<string, HTMLElement>();
const metrics = new Map<string, SectionMetrics>();
const listeners = new Set<() => void>();

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function measureSections() {
  const vh = window.innerHeight || 1;
  sections.forEach((el, id) => {
    const rect = el.getBoundingClientRect();
    const range = rect.height - vh;
    const progress = range > 1 ? clamp01(-rect.top / range) : clamp01((vh - rect.top) / (vh + rect.height));
    metrics.set(id, { offset: -rect.top / vh, progress });
  });
}

function update(scroll: number, limit: number, velocity: number) {
  state.scroll = scroll;
  state.limit = limit;
  state.progress = limit > 0 ? clamp01(scroll / limit) : 0;
  state.velocity = velocity;
  state.lastUpdate = performance.now();
  measureSections();
  listeners.forEach((fn) => fn());
}

/** Raw state for per-frame reads. Do not mutate. */
export function getScrollState() {
  return state;
}

/** Scroll velocity in px/frame, forced to 0 shortly after the last scroll event. */
export function getVelocity(): number {
  return performance.now() - state.lastUpdate > 120 ? 0 : state.velocity;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function registerSection(id: string, el: HTMLElement): () => void {
  sections.set(id, el);
  measureSections();
  return () => {
    sections.delete(id);
    metrics.delete(id);
  };
}

/** 0..1 progress through a registered section, or null if it is not registered. */
export function getSectionProgress(id: string): number | null {
  return metrics.get(id)?.progress ?? null;
}

/** Scroll offset past a registered section's top in viewport heights (can be negative). */
export function getSectionOffset(id: string): number | null {
  return metrics.get(id)?.offset ?? null;
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
