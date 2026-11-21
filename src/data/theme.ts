import type { ThemeData } from "@/types";

// Swatches mirror the [data-backdrop] tokens in app/globals.css. PLACEHOLDER Spanish UI labels.
export const theme: ThemeData = {
  storageKey: "portfolio-backdrop",
  options: [
    { id: "ink", label: "Tinta", swatch: "#0b0b0c" },
    { id: "bone", label: "Hueso", swatch: "#ece7dd" },
    { id: "signal", label: "Señal", swatch: "#ff5a1f" },
  ],
  defaultForDark: "ink",
  defaultForLight: "bone",
  pickerLabel: "Fondo del sitio",
  pickerCaption: "Fondo",
  hint: "Mueve la luz · clic para cambiar el fondo",
};
