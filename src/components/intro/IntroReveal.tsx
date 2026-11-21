"use client";

import { createElement } from "react";
import { useIntro } from "./IntroProvider";

interface IntroRevealProps {
  children: React.ReactNode;
  as?: "div" | "header" | "p" | "h1";
  /** Stagger delay in ms, applied once the intro is done. */
  delay?: number;
  className?: string;
}

/** Fades in and rises slightly when the intro finishes. */
export function IntroReveal({ children, as = "div", delay = 0, className = "" }: IntroRevealProps) {
  const { introDone } = useIntro();
  const state = introDone ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0";

  return createElement(
    as,
    {
      className: `transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${state} ${className}`,
      style: { transitionDelay: introDone ? delay + "ms" : "0ms" },
    },
    children,
  );
}
