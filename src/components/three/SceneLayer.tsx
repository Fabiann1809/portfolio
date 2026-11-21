"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLoaderProgress } from "@/components/loader/LoaderProvider";
import { usePinnedLayout } from "@/hooks/usePinnedLayout";

const Scene = dynamic(() => import("./Scene").then((mod) => mod.Scene), { ssr: false });

/**
 * Client-only mount point for the WebGL journey; reports its loading to the preloader.
 * Renders nothing on mobile, with reduced motion, or without WebGL (sections flow normally).
 * Server/hydration assumes the journey is on so the loader waits for the scene.
 */
export function SceneLayer() {
  const [progress, setProgress] = useState(0);
  const journey = usePinnedLayout(true);
  useLoaderProgress("scene", journey ? progress : 1);

  if (!journey) return null;
  return <Scene onProgress={setProgress} />;
}
