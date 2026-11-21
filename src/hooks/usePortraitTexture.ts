"use client";

import { useEffect, useState } from "react";
import { SRGBColorSpace, TextureLoader } from "three";
import type { DataTexture, Texture } from "three";
import { hero } from "@/data/hero";
import { buildMaskTexture } from "@/lib/heroMask";

export interface PortraitTextures {
  map: Texture | null;
  mask: DataTexture | null;
  /** Loading progress 0..1 for the preloader. */
  progress: number;
}

/** Loads the portrait and derives the silhouette mask used by the grid wall. */
export function usePortraitTexture(enabled: boolean): PortraitTextures {
  const [state, setState] = useState<PortraitTextures>({ map: null, mask: null, progress: 0 });

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let loaded: { map: Texture; mask: DataTexture } | null = null;
    new TextureLoader().load(
      hero.portrait.src,
      (map) => {
        if (disposed) {
          map.dispose();
          return;
        }
        map.colorSpace = SRGBColorSpace;
        map.anisotropy = 4;
        const mask = buildMaskTexture(map.image as HTMLImageElement, hero.scene.grid);
        loaded = { map, mask };
        setState({ map, mask, progress: 1 });
      },
      (event) => {
        if (!disposed && event.total) setState((s) => (s.map ? s : { ...s, progress: Math.min(0.95, event.loaded / event.total) }));
      },
      () => {
        // A missing photo must not hold the preloader: report done with nothing to draw.
        if (!disposed) setState({ map: null, mask: null, progress: 1 });
      },
    );
    return () => {
      disposed = true;
      loaded?.map.dispose();
      loaded?.mask.dispose();
    };
  }, [enabled]);

  return state;
}
