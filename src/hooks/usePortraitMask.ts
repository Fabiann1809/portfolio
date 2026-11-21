"use client";

import { useEffect, useState } from "react";
import { TextureLoader } from "three";
import type { DataTexture } from "three";
import { hero } from "@/data/hero";
import { buildMaskTexture } from "@/lib/heroMask";

export interface PortraitMask {
  mask: DataTexture | null;
  /** Loading progress 0..1 for the preloader. */
  progress: number;
}

/** Loads the portrait and derives the silhouette mask the grid wall subdivides around. */
export function usePortraitMask(enabled: boolean): PortraitMask {
  const [state, setState] = useState<PortraitMask>({ mask: null, progress: 0 });

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let built: DataTexture | null = null;
    new TextureLoader().load(
      hero.portrait.src,
      (map) => {
        if (!disposed) {
          built = buildMaskTexture(map.image as HTMLImageElement, hero.scene.grid);
          setState({ mask: built, progress: 1 });
        }
        map.dispose();
      },
      (event) => {
        if (!disposed && event.total) setState((s) => (s.mask ? s : { ...s, progress: Math.min(0.95, event.loaded / event.total) }));
      },
      () => {
        // A missing photo must not hold the preloader: report done with nothing to draw.
        if (!disposed) setState({ mask: null, progress: 1 });
      },
    );
    return () => {
      disposed = true;
      built?.dispose();
    };
  }, [enabled]);

  return state;
}
