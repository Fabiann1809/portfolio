"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface IntroContextValue {
  /** True once the intro overlay starts leaving; the site then animates in. */
  introDone: boolean;
  completeIntro: () => void;
}

const IntroContext = createContext<IntroContextValue>({
  introDone: false,
  completeIntro: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const completeIntro = useCallback(() => setIntroDone(true), []);
  const value = useMemo(() => ({ introDone, completeIntro }), [introDone, completeIntro]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
