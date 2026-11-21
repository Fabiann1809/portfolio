import { theme } from "@/data/theme";

/** Tiny inline script (run before first paint) that applies the stored or system backdrop. */
export const themeInitScript = `(function(){try{var ids=${JSON.stringify(theme.options.map((o) => o.id))};var v=null;try{v=localStorage.getItem(${JSON.stringify(theme.storageKey)});}catch(e){}if(ids.indexOf(v)<0){v=window.matchMedia("(prefers-color-scheme: light)").matches?${JSON.stringify(theme.defaultForLight)}:${JSON.stringify(theme.defaultForDark)};}document.documentElement.setAttribute("data-backdrop",v);}catch(e){}})();`;
