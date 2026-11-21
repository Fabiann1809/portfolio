"use client";

import { createContext, useContext } from "react";

/** The hero stage element (null until mounted), shared with the WebGL scene. */
export const HeroStageContext = createContext<HTMLElement | null>(null);

export function useHeroStage(): HTMLElement | null {
  return useContext(HeroStageContext);
}
