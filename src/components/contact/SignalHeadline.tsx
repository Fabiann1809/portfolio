"use client";

import { useRef } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HIDDEN = "-9999px";

/**
 * Closing call: giant stacked type that decodes through glyphs when it enters the viewport and
 * lights up in the accent color around the pointer. Lines alternate left / right alignment.
 */
export function SignalHeadline({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  function move(event: React.PointerEvent<HTMLHeadingElement>) {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", event.clientX - r.left + "px");
    el.style.setProperty("--my", event.clientY - r.top + "px");
  }

  function leave() {
    ref.current?.style.setProperty("--mx", HIDDEN);
  }

  return (
    <h2
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      aria-label={lines.join(" ")}
      className="giant-title flex flex-col text-[clamp(72px,18vw,320px)] leading-[0.84]"
      style={{
        backgroundImage:
          "radial-gradient(circle 220px at var(--mx, -9999px) var(--my, -9999px), var(--emphasis), var(--foreground) 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
    >
      {lines.map((line, i) => (
        <span key={line} aria-hidden="true" className={"block " + (i % 2 === 1 ? "self-end text-right" : "self-start")}>
          <ScrambleText text={line.toUpperCase()} delay={i * 160} duration={900} />
        </span>
      ))}
    </h2>
  );
}
