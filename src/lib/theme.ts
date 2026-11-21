import { theme } from "@/data/theme";
import type { BackdropId } from "@/types";

/** Client-side theme store: the source of truth is `data-backdrop` on <html>. */
const ids = theme.options.map((option) => option.id);

export function isBackdropId(value: unknown): value is BackdropId {
  return typeof value === "string" && (ids as string[]).includes(value);
}

export function readBackdrop(): BackdropId {
  const value = document.documentElement.dataset.backdrop;
  return isBackdropId(value) ? value : theme.defaultForDark;
}

export function applyBackdrop(id: BackdropId) {
  document.documentElement.dataset.backdrop = id;
  try {
    localStorage.setItem(theme.storageKey, id);
  } catch {
    // Storage can be blocked (private mode); the choice then lasts for the session only.
  }
}

export function cycleBackdrop() {
  const next = ids[(ids.indexOf(readBackdrop()) + 1) % ids.length];
  applyBackdrop(next);
}

/** Calls `onChange` whenever `data-backdrop` changes (any source). */
export function subscribeBackdrop(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-backdrop"] });
  return () => observer.disconnect();
}
