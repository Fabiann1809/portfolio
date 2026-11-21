import { contourBackdrop } from "@/data/backdrop";

const corners = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

/** Four thin corner brackets framing the hero (decorative). */
export function FrameBrackets() {
  const { size, inset } = contourBackdrop.brackets;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ top: inset.top, bottom: inset.bottom, left: inset.side, right: inset.side }}
    >
      {corners.map((c) => (
        <span key={c} className={`absolute border-foreground/45 ${c}`} style={{ width: size, height: size }} />
      ))}
    </div>
  );
}
