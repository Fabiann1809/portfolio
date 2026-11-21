"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useThemeColors } from "@/hooks/useThemeColors";
import { screens } from "@/lib/journeyModel";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { StudioEnvironment } from "./environment/StudioEnvironment";
import { JourneyScreen } from "./JourneyScreen";

interface SceneProps {
  /** Loading progress 0..1 (canvas ready + assets). */
  onProgress: (value: number) => void;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * The single fixed canvas behind the whole page. It hosts the ambient backdrop, the studio environment and every
 * screen of the scroll journey (all in one world, driven by the shared journey state).
 */
export function Scene({ onProgress }: SceneProps) {
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true,
  );
  const { progress, active } = useProgress();
  const [ready, setReady] = useState(false);
  const theme = useThemeColors();

  useEffect(() => {
    onProgress(ready ? (active ? progress / 100 : 1) : 0.2);
  }, [ready, active, progress, onProgress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        frameloop={visible ? "always" : "never"}
        style={{ pointerEvents: "none" }}
        onCreated={() => setReady(true)}
      >
        <AmbientBackdrop theme={theme} />
        {screens.map((def, index) => (
          <JourneyScreen key={def.id} index={index} def={def} theme={theme} />
        ))}
        <StudioEnvironment />
      </Canvas>
    </div>
  );
}
