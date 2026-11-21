import type { ThemeData } from "@/types";

// Swatches show the key color of each [data-backdrop] tone in app/globals.css (cyan phosphor / white studio / amber phosphor). PLACEHOLDER Spanish UI labels.
export const theme: ThemeData = {
  storageKey: "portfolio-backdrop",
  options: [
    { id: "ink", label: "Tinta", swatch: "#7ddcff" },
    { id: "bone", label: "Hueso", swatch: "#e9ecf0" },
    { id: "signal", label: "Señal", swatch: "#ffb347" },
  ],
  defaultForDark: "ink",
  defaultForLight: "bone",
  pickerLabel: "Fondo del sitio",
  pickerCaption: "Fondo",
  hint: "Mueve la luz · clic para cambiar el fondo",
};
