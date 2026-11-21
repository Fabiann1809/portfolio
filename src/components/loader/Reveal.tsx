"use client";

import { createElement } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLoader } from "./LoaderProvider";

interface RevealProps {
  children: React.ReactNode;
  as?: "div" | "header" | "p" | "h1";
  /** Stagger delay in ms, applied once loading is done. */
  delay?: number;
  className?: string;
}

/** Fades in and rises slightly when the preloader leaves. */
export function Reveal({ children, as = "div", delay = 0, className = "" }: RevealProps) {
  const { loaded } = useLoader();
  const reduced = useReducedMotion();
  const state = loaded ? "translate-y-0 opacity-100" : reduced ? "opacity-0" : "translate-y-3 opacity-0";

  return createElement(
    as,
    {
      className: `transition-[opacity,transform] ease-out motion-reduce:transition-none ${reduced ? "transition-none" : "duration-700"} ${state} ${className}`,
      style: { transitionDelay: loaded ? delay + "ms" : "0ms" },
    },
    children,
  );
}
