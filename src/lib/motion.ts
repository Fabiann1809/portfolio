/**
 * Single source of truth for "reduced motion" (client only). Honors the OS setting and, outside
 * production, the `?reducedMotion=1` query param so it can be tested without OS emulation.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function forcedByParam(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return new URLSearchParams(window.location.search).get("reducedMotion") === "1";
}

export function prefersReducedMotion(): boolean {
  return forcedByParam() || window.matchMedia(QUERY).matches;
}

/** Calls `onChange` when the OS setting changes. The query param is fixed for the page life. */
export function subscribeReducedMotion(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
