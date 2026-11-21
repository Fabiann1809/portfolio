"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useLoaderProgress } from "@/components/loader/LoaderProvider";
import { hasWebGL } from "@/lib/webgl";

const Scene = dynamic(() => import("./Scene").then((mod) => mod.Scene), { ssr: false });

const subscribeNoop = () => () => {};

/** Client-only mount point for the WebGL scene; reports its loading to the preloader. */
export function SceneLayer() {
  const [progress, setProgress] = useState(0);
  const supported = useSyncExternalStore(subscribeNoop, hasWebGL, () => true);
  useLoaderProgress("scene", supported ? progress : 1);

  if (!supported) return null;
  return <Scene onProgress={setProgress} />;
}
