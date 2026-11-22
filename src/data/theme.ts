import type { Localized, ThemeData, ThemeLabels } from "@/types";

// Swatches mirror the [data-backdrop] tokens in app/globals.css.
// ink = dark, bone = light, signal = orange (light-style tokens).
export const theme: ThemeData = {
  storageKey: "portfolio-backdrop",
  options: [
    { id: "ink", swatch: "#0b0b0c" },
    { id: "bone", swatch: "#ece7dd" },
    { id: "signal", swatch: "#ff5a1f" },
  ],
  defaultForDark: "ink",
  defaultForLight: "bone",
};

export const themeLabels: Localized<ThemeLabels> = {
  es: {
    options: { ink: "Tinta", bone: "Hueso", signal: "Señal" },
    pickerLabel: "Fondo del sitio",
    pickerCaption: "Fondo",
  },
  en: {
    options: { ink: "Ink", bone: "Bone", signal: "Signal" },
    pickerLabel: "Site background",
    pickerCaption: "Background",
  },
};
