"use client";

/* eslint-disable react-hooks/immutability -- three.js uniforms and objects are mutated per frame by design */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, Color, LinearMipmapLinearFilter, RepeatWrapping, ShaderMaterial } from "three";
import type { Mesh } from "three";
import { environment } from "@/data/environment";
import { useBackdrop } from "@/hooks/useBackdrop";
import { stepJourney } from "@/lib/journey";
import { live, updateStudio } from "@/lib/journeyModel";
import { getScrollState } from "@/lib/scrollStore";
import { drawStudioText } from "@/lib/studioText";
import { studioFragmentShader, studioVertexShader } from "../shaders/studio";

const { text } = environment;

/**
 * Bright "white studio" behind the screens while they are shrunk (transition zones and stream
 * chapters). Its opacity is the share of the viewport not covered by a full-bleed backdrop,
 * so it fades in as a screen shrinks and out as the next one expands. Sets
 * `data-environment="studio"` on <html> while visible so the navbar can switch to dark text.
 */
export function StudioEnvironment() {
  const backdrop = useBackdrop();
  const palette = environment.palettes[backdrop];
  const mesh = useRef<Mesh>(null);
  const flag = useRef(false);

  const textTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.anisotropy = 8;
    return texture;
  }, []);

  const uniforms = useMemo(
    () => ({
      uText: { value: textTexture },
      uHasText: { value: 0 },
      uAmount: { value: 0 },
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uHorizon: { value: environment.horizon },
      uFloorScale: { value: text.floorScale },
      uWallScale: { value: text.wallScale },
      uFloorOpacity: { value: text.floorOpacity },
      uWallOpacity: { value: text.wallOpacity },
      uTintStrength: { value: 0 },
      uCenter: { value: new Color() },
      uEdge: { value: new Color() },
      uFloorFar: { value: new Color() },
      uFloorNear: { value: new Color() },
      uTextColor: { value: new Color() },
      uTint: { value: new Color() },
    }),
    [textTexture],
  );

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: studioVertexShader,
        fragmentShader: studioFragmentShader,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    uniforms.uCenter.value.set(palette.center);
    uniforms.uEdge.value.set(palette.edge);
    uniforms.uFloorFar.value.set(palette.floorFar);
    uniforms.uFloorNear.value.set(palette.floorNear);
    uniforms.uTextColor.value.set(palette.text);
    uniforms.uTint.value.set(palette.tint);
    uniforms.uTintStrength.value = palette.tintStrength;
  }, [uniforms, palette]);

  // Code text canvas, redrawn once the monospace font is really available.
  useEffect(() => {
    let cancelled = false;
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
    const draw = () => {
      if (cancelled) return;
      drawStudioText(textTexture.image as HTMLCanvasElement, text, family || "monospace");
      textTexture.needsUpdate = true;
      uniforms.uHasText.value = 1;
    };
    draw();
    if (family) document.fonts?.load(`${text.fontSize}px ${family}`).then(draw, () => {});
    document.fonts?.ready.then(draw);
    return () => {
      cancelled = true;
      textTexture.dispose();
    };
  }, [textTexture, uniforms]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.environment;
    },
    [],
  );

  useFrame((state, delta) => {
    stepJourney(state.clock.elapsedTime, delta);
    updateStudio();
    const m = mesh.current;
    if (!m) return;
    const amount = live.studio;
    const visible = amount > 0.003;
    m.visible = visible;

    const wantFlag = amount > 0.5 && palette.isDarkText;
    if (wantFlag !== flag.current) {
      flag.current = wantFlag;
      if (wantFlag) document.documentElement.dataset.environment = "studio";
      else delete document.documentElement.dataset.environment;
    }
    if (!visible) return;

    const vh = window.innerHeight || 1;
    uniforms.uAmount.value = amount;
    uniforms.uAspect.value = state.viewport.aspect;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = (getScrollState().scroll / vh) * text.scrollSpeed + state.clock.elapsedTime * text.idleSpeed;
  });

  return (
    <>
    <mesh ref={mesh} renderOrder={-5} frustumCulled={false} visible={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
    </>
  );
}
