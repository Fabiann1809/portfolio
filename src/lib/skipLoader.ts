/** Session flag set right before a language switch so the next page skips the preloader. */
export const SKIP_LOADER_KEY = "skip-preloader";
export const SKIP_LOADER_ATTR = "data-skip-loader";

export function markSkipLoader() {
  try {
    sessionStorage.setItem(SKIP_LOADER_KEY, "1");
  } catch {}
}

/** True once if the flag was set (the inline head script mirrors it to an html attribute before paint). */
export function consumeSkipLoader() {
  const root = document.documentElement;
  const skip = root.hasAttribute(SKIP_LOADER_ATTR);
  root.removeAttribute(SKIP_LOADER_ATTR);
  try {
    sessionStorage.removeItem(SKIP_LOADER_KEY);
  } catch {}
  return skip;
}

/** Inline, pre-paint: hides the preloader via CSS when the flag is set. */
export const skipLoaderInitScript = `(function(){try{if(sessionStorage.getItem(${JSON.stringify(SKIP_LOADER_KEY)}))document.documentElement.setAttribute(${JSON.stringify(SKIP_LOADER_ATTR)},"");}catch(e){}})();`;
