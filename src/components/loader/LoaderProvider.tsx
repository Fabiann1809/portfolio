"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { LoaderContextValue } from "@/types/loader";

const LoaderContext = createContext<LoaderContextValue>({
  loaded: false,
  completeLoading: () => {},
  registerTask: () => () => {},
  setTaskProgress: () => {},
  getProgress: () => 0,
});

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Tracks loading progress as the average of named tasks. Built-in tasks cover the
 * document, fonts and img elements. Extra tasks can be added with registerTask or
 * useLoaderProgress, e.g. feed useProgress().progress / 100 from drei for 3D assets.
 */
export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const tasks = useRef(new Map<string, number>([["document", 0], ["fonts", 0], ["images", 0]]));

  const completeLoading = useCallback(() => setLoaded(true), []);
  const setTaskProgress = useCallback((id: string, progress: number) => {
    if (tasks.current.has(id)) tasks.current.set(id, clamp01(progress));
  }, []);
  const registerTask = useCallback((id: string) => {
    if (!tasks.current.has(id)) tasks.current.set(id, 0);
    return () => {
      tasks.current.delete(id);
    };
  }, []);
  const getProgress = useCallback(() => {
    let sum = 0;
    tasks.current.forEach((v) => (sum += v));
    return tasks.current.size ? sum / tasks.current.size : 1;
  }, []);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    if (document.readyState === "complete") {
      tasks.current.set("document", 1);
    } else {
      tasks.current.set("document", document.readyState === "interactive" ? 0.6 : 0.2);
      const onChange = () => {
        if (document.readyState === "complete") tasks.current.set("document", 1);
        else if (document.readyState === "interactive") tasks.current.set("document", 0.6);
      };
      document.addEventListener("readystatechange", onChange);
      cleanups.push(() => document.removeEventListener("readystatechange", onChange));
    }

    if (document.fonts) {
      document.fonts.ready.then(() => tasks.current.set("fonts", 1));
    } else {
      tasks.current.set("fonts", 1);
    }

    // Lazy images below the fold may never load on their own: do not wait for them.
    const images = Array.from(document.images).filter((img) => img.loading !== "lazy");
    if (images.length === 0) {
      tasks.current.set("images", 1);
    } else {
      let done = 0;
      const mark = () => tasks.current.set("images", ++done / images.length);
      images.forEach((img) => {
        if (img.complete) {
          mark();
          return;
        }
        img.addEventListener("load", mark, { once: true });
        img.addEventListener("error", mark, { once: true });
        cleanups.push(() => {
          img.removeEventListener("load", mark);
          img.removeEventListener("error", mark);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const value = useMemo(
    () => ({ loaded, completeLoading, registerTask, setTaskProgress, getProgress }),
    [loaded, completeLoading, registerTask, setTaskProgress, getProgress],
  );

  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
}

export function useLoader() {
  return useContext(LoaderContext);
}

/** Registers a task and keeps its progress (0..1) in sync with the given value. */
export function useLoaderProgress(id: string, progress: number) {
  const { registerTask, setTaskProgress } = useContext(LoaderContext);
  useEffect(() => registerTask(id), [id, registerTask]);
  useEffect(() => setTaskProgress(id, progress), [id, progress, setTaskProgress]);
}
