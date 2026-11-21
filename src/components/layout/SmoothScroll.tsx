"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";
import { useLenis } from "@/hooks/useLenis";

const LenisContext = createContext<Lenis | null>(null);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** The Lenis instance, or null before mount / when reduced motion disables smooth scroll. */
export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}
