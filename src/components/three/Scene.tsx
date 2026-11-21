"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { projects, projectsSectionId } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BackgroundField } from "./BackgroundField";
import { CrtScreen } from "./CrtScreen";

interface SceneProps {
  /** Loading progress 0..1 (canvas ready + assets). */
  onProgress: (value: number) => void;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const readCssColor = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/**
 * The single full-screen canvas fixed behind the whole page. It hosts the ambient
 * background and the project CRT screens (all in one world, no View/portal needed).
 */
export function Scene({ onProgress }: SceneProps) {
  const reduced = useReducedMotion();
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true,
  );
  const { progress, active } = useProgress();
  const [ready, setReady] = useState(false);
  // Scene only renders on the client (dynamic import, ssr: false), so reading CSS here is safe.
  const [colors] = useState(() => ({
    primary: readCssColor("--color-primary", "#3b82f6"),
    accent: readCssColor("--color-accent", "#f59e0b"),
  }));

  useEffect(() => {
    onProgress(ready ? (active ? progress / 100 : 1) : 0.2);
  }, [ready, active, progress, onProgress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        style={{ pointerEvents: "none" }}
        onCreated={() => setReady(true)}
      >
        <BackgroundField color={colors.primary} animated={!reduced} />
        {projects.map((project, index) => (
          <CrtScreen
            key={project.id}
            image={project.image}
            index={index}
            sectionId={projectsSectionId}
            tint={index % 2 === 0 ? colors.primary : colors.accent}
          />
        ))}
      </Canvas>
    </div>
  );
}
