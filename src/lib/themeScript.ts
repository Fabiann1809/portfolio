import { theme } from "@/data/theme";

/** Tiny inline script (run before first paint): applies the stored mode (migrating removed tones) or the system one. */
export const themeInitScript = `(function(){try{var ids=${JSON.stringify(theme.options.map((o) => o.id))};var mig=${JSON.stringify(theme.migrate)};var k=${JSON.stringify(theme.storageKey)};var v=null;try{v=localStorage.getItem(k);}catch(e){}if(v&&mig[v]){v=mig[v];try{localStorage.setItem(k,v);}catch(e){}}if(ids.indexOf(v)<0){v=window.matchMedia("(prefers-color-scheme: light)").matches?${JSON.stringify(theme.defaultForLight)}:${JSON.stringify(theme.defaultForDark)};}document.documentElement.setAttribute("data-backdrop",v);}catch(e){}})();`;
