import type { ThemeData } from "@/types";

// PLACEHOLDER Spanish UI labels. "ink" is the dark mode, "bone" the light one (see app/globals.css).
export const theme: ThemeData = {
  storageKey: "portfolio-backdrop",
  options: [
    { id: "bone", label: "Modo claro" },
    { id: "ink", label: "Modo oscuro" },
  ],
  defaultForDark: "ink",
  defaultForLight: "bone",
  migrate: { signal: "ink" },
  switchLabel: "Tema del sitio",
};
