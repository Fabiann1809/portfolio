import type { Localized, ThemeData, ThemeLabels } from "@/types";

// Swatches mirror the [data-backdrop] tokens in app/globals.css.
// ink = dark, bone = light.
export const theme: ThemeData = {
  storageKey: "portfolio-backdrop",
  options: [
    { id: "ink", swatch: "#0b0b0c" },
    { id: "bone", swatch: "#ece7dd" },
  ],
  defaultForDark: "ink",
  defaultForLight: "bone",
};

export const themeLabels: Localized<ThemeLabels> = {
  es: {
    options: { ink: "Tinta", bone: "Hueso" },
    pickerLabel: "Fondo del sitio",
    pickerCaption: "Fondo",
  },
  en: {
    options: { ink: "Ink", bone: "Bone" },
    pickerLabel: "Site background",
    pickerCaption: "Background",
  },
};
