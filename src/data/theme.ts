import type { ThemeData } from "@/types";

// Swatches mirror the [data-backdrop] tokens in app/globals.css. PLACEHOLDER Spanish UI labels.
export const theme: ThemeData = {
  storageKey: "portfolio-backdrop",
  options: [
    { id: "ink", label: "Tinta", swatch: "#0a0c0a" },
    { id: "bone", label: "Hueso", swatch: "#e8dfca" },
    { id: "signal", label: "Señal", swatch: "#ee5a22" },
  ],
  defaultForDark: "ink",
  defaultForLight: "bone",
  pickerLabel: "Fondo del sitio",
  pickerCaption: "Fondo",
  hint: "Mueve la luz · clic para cambiar el fondo",
};
