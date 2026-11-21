"use client";

/* eslint-disable react-hooks/immutability -- three.js uniforms and objects are mutated per frame by design */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { damp } from "maath/easing";
import { CanvasTexture, Color, DoubleSide, MathUtils, ShaderMaterial, SRGBColorSpace, TextureLoader, VideoTexture } from "three";
import type { Mesh, Texture } from "three";
import { journeyConfig } from "@/data/chapters";
import { environment } from "@/data/environment";
import { hero } from "@/data/hero";
import { drawHeroTexture, whenPortraitReady } from "@/lib/heroTexture";
import type { ThemeColors } from "@/types";
import { getJourneyState, stepJourney } from "@/lib/journey";
import { live, poses, screenInView } from "@/lib/journeyModel";
import type { ScreenDef } from "@/lib/journeyModel";
import { ProceduralVisual } from "./environment/ProceduralVisual";
import { getShadowTexture } from "./environment/shadowTexture";
import { screenFragmentShader, screenVertexShader } from "./shaders/screen";

interface JourneyScreenProps {
  index: number;
  def: ScreenDef;
  theme: ThemeColors;
}

const { stream, screen, fx, smooth } = journeyConfig;
const { reflection, shadow } = environment;
const VIDEO_PATTERN = /\.(mp4|webm|ogv|mov)(\?.*)?$/i;

/**
 * One curved CRT screen of the journey. Its pose (stream position, fill, opacity) comes from
 * the shared journey model; every value is damped per frame before it reaches the mesh.
 * Its picture is, in priority order: an image / video URL (`def.visual`), a procedural 3D
 * scene rendered to a texture (`def.scene`), a generated hero texture or a generated gradient.
 * Over the studio environment it also draws a mirrored floor reflection and a contact shadow.
 */
export function JourneyScreen({ index, def, theme }: JourneyScreenProps) {
  const mesh = useRef<Mesh>(null);
  const reflectMesh = useRef<Mesh>(null);
  const shadowMesh = useRef<Mesh>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const videoPlaying = useRef(false);
  const texture = useRef<Texture | null>(null);
  const seen = useRef(false);
  const cur = useRef({ x: 0, y: 0, z: 0, w: 1, h: 1, sc: 1, rx: 0, ry: 0, rz: 0, fill: 0, opacity: 0 });

  const seed = (index * 0.37 + 0.11) % 1;
  const seedB = (seed * 7.31 + 0.3) % 1;
  const procedural = !def.visual && !def.generated && def.scene ? def.scene : null;
  const blurred = !def.generated;
  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as Texture | null },
      uHasTexture: { value: 0 },
      uTexAspect: { value: screen.aspect },
      uPlaneAspect: { value: screen.aspect },
      uCurve: { value: 0 },
      uSize: { value: 1 },
      uSmear: { value: 0 },
      uRgb: { value: fx.rgbBase },
      uScan: { value: fx.scan },
      uVignette: { value: fx.vignette },
      uFill: { value: 0 },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uBezel: { value: 1 },
      uBezelSize: { value: screen.bezel },
      uBlur: { value: 0 },
      uGlow: { value: fx.glow },
      uReflect: { value: 0 },
      uFloorY: { value: 0 },
      uReflectLen: { value: 1 },
      uDim: { value: 0 },
      uSeed: { value: seed },
      uDrift: { value: 0 },
      uColorA: { value: new Color() },
      uColorB: { value: new Color() },
      uBg: { value: new Color() },
      uFg: { value: new Color() },
    }),
    [seed],
  );

  // The floor reflection shares every uniform of the screen except its own opacity and flag.
  const reflectUniforms = useMemo(() => ({ ...uniforms, uOpacity: { value: 0 }, uReflect: { value: 1 } }), [uniforms]);

  // Materials are built here (not by JSX) so the uniform objects above are the live ones.
  const mainMaterial = useMemo(
    () => new ShaderMaterial({ vertexShader: screenVertexShader, fragmentShader: screenFragmentShader, uniforms, transparent: true, depthWrite: false }),
    [uniforms],
  );
  const reflectMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: screenVertexShader,
        fragmentShader: screenFragmentShader,
        uniforms: reflectUniforms,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    [reflectUniforms],
  );
  useEffect(
    () => () => {
      mainMaterial.dispose();
      reflectMaterial.dispose();
    },
    [mainMaterial, reflectMaterial],
  );

  // Theme changes update the uniforms in place (no re-mount).
  useEffect(() => {
    const even = index % 2 === 0;
    uniforms.uColorA.value.set(even ? theme.primary : theme.accent);
    uniforms.uColorB.value.set(even ? theme.accent : theme.primary);
    uniforms.uBg.value.set(theme.background);
    uniforms.uFg.value.set(theme.foreground);
  }, [uniforms, index, theme]);

  // Generated hero screen: backdrop + giant name drawn to a canvas, redrawn on theme / resize.
  useEffect(() => {
    if (def.generated !== "hero") return;
    const canvas = document.createElement("canvas");
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    let timer = 0;
    let cancelled = false;

    const apply = () => {
      if (cancelled) return;
      drawHeroTexture(canvas, {
        text: hero.displayName,
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-doto").trim() || "monospace",
        colors: theme,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      });
      tex.needsUpdate = true;
      uniforms.uTexture.value = tex;
      uniforms.uHasTexture.value = 1;
      uniforms.uTexAspect.value = canvas.width / canvas.height;
    };
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(apply, 250);
    };

    apply();
    // Draw again once the portrait (mosaic) and Doto is really loaded, so the canvas never uses the fallback.
    whenPortraitReady().then(apply);
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-doto").trim();
    if (family) document.fonts?.load(`900 100px ${family}`).then(apply, () => {});
    document.fonts?.ready.then(apply);
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      tex.dispose();
    };
  }, [def.generated, theme, uniforms]);

  // Image or video supplied for the chapter: replaces the procedural scene.
  useEffect(() => {
    const url = def.visual;
    if (!url) return;
    let cancelled = false;
    const apply = (loaded: Texture, width: number, height: number) => {
      loaded.colorSpace = SRGBColorSpace;
      texture.current = loaded;
      uniforms.uTexture.value = loaded;
      uniforms.uHasTexture.value = 1;
      uniforms.uTexAspect.value = width / height;
    };

    if (VIDEO_PATTERN.test(url)) {
      const element = document.createElement("video");
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.crossOrigin = "anonymous";
      element.preload = "auto";
      element.src = url;
      video.current = element;
      const onReady = () => {
        if (cancelled) return;
        apply(new VideoTexture(element), element.videoWidth || 16, element.videoHeight || 9);
      };
      element.addEventListener("loadeddata", onReady, { once: true });
      element.load();
      return () => {
        cancelled = true;
        element.removeEventListener("loadeddata", onReady);
        element.pause();
        element.removeAttribute("src");
        element.load();
        video.current = null;
        videoPlaying.current = false;
        texture.current?.dispose();
        texture.current = null;
      };
    }

    new TextureLoader().load(
      url,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        const img = loaded.image as { width: number; height: number };
        apply(loaded, img.width, img.height);
      },
      undefined,
      () => {},
    );
    return () => {
      cancelled = true;
      texture.current?.dispose();
      texture.current = null;
    };
  }, [def.visual, uniforms]);

  useFrame((state, delta) => {
    stepJourney(state.clock.elapsedTime, delta);
    const m = mesh.current;
    if (!m) return;

    const pose = poses[index];
    const visible = screenInView(index);
    m.visible = visible;
    if (!visible) {
      seen.current = false;
      live.cover[index] = 0;
      if (reflectMesh.current) reflectMesh.current.visible = false;
      if (shadowMesh.current) shadowMesh.current.visible = false;
      if (video.current && videoPlaying.current) {
        video.current.pause();
        videoPlaying.current = false;
      }
      return;
    }
    if (video.current && !videoPlaying.current) {
      videoPlaying.current = true;
      video.current.play().catch(() => {
        videoPlaying.current = false;
      });
    }

    const dt = Math.min(delta, journeyConfig.maxDelta);
    const vp = state.viewport;
    const c = cur.current;
    const k = 1 - pose.fill;
    const dist = Math.min(Math.abs(pose.r), 2);
    // Deterministic per-screen tilt: neighbours vary more than the one resting at the centre.
    const variance = k * (0.35 + 0.65 * Math.min(1, dist));

    const restW = Math.min(vp.width * screen.widthRatio, vp.height * screen.maxHeightRatio * screen.aspect);
    const restH = restW / screen.aspect;
    const target = {
      x: pose.r * stream.offsetX * vp.width * k,
      y: -pose.r * stream.offsetY * vp.height * k,
      z: -dist * stream.depth * k,
      w: MathUtils.lerp(restW, vp.width * screen.overscan, pose.fill),
      h: MathUtils.lerp(restH, vp.height * screen.overscan, pose.fill),
      sc: 1 - stream.scaleFalloff * dist * k,
      rx: -pose.r * stream.tiltX * k,
      ry: -pose.r * stream.tiltY * k + (seedB - 0.5) * 2 * screen.tiltVariance.y * variance,
      rz: pose.r * stream.tiltZ * k + (seed - 0.5) * 2 * screen.tiltVariance.z * variance,
      fill: pose.fill,
      opacity: pose.opacity,
    };

    if (!seen.current) {
      Object.assign(c, target);
      seen.current = true;
    } else {
      damp(c, "x", target.x, smooth.position, dt);
      damp(c, "y", target.y, smooth.position, dt);
      damp(c, "z", target.z, smooth.position, dt);
      damp(c, "rx", target.rx, smooth.position, dt);
      damp(c, "ry", target.ry, smooth.position, dt);
      damp(c, "rz", target.rz, smooth.position, dt);
      damp(c, "sc", target.sc, smooth.shape, dt);
      damp(c, "w", target.w, smooth.shape, dt);
      damp(c, "h", target.h, smooth.shape, dt);
      damp(c, "fill", target.fill, smooth.shape, dt);
      damp(c, "opacity", target.opacity, smooth.shape, dt);
    }

    m.position.set(c.x, c.y, c.z);
    m.rotation.set(c.rx, c.ry, c.rz);
    m.scale.set(c.w * c.sc, c.h * c.sc, 1);
    m.renderOrder = pose.layer;

    const journey = getJourneyState();
    const un = uniforms;
    un.uTime.value = state.clock.elapsedTime;
    un.uSize.value = c.w * c.sc;
    un.uPlaneAspect.value = c.w / c.h;
    un.uFill.value = c.fill;
    un.uOpacity.value = c.opacity;
    un.uCurve.value = screen.curve * Math.pow(Math.max(0, 1 - c.fill), 1.5);
    un.uBezel.value = 1 - MathUtils.smoothstep(c.fill, 0.35, 0.95);
    live.cover[index] = MathUtils.smoothstep(c.fill, 0.92, 1) * c.opacity;
    un.uDim.value = def.generated ? 0 : fx.dimFilled * c.fill;
    un.uBlur.value = blurred ? fx.blurFilled * c.fill : 0;
    un.uSmear.value = journey.smear;
    un.uRgb.value = fx.rgbBase + journey.smear * fx.rgbGain;
    un.uDrift.value = journey.drift + state.clock.elapsedTime * 0.05;

    // Floor reflection and contact shadow (only meaningful over the studio).
    const floorY = environment.floorY * vp.height;
    const studio = live.studio;
    const sh = c.h * c.sc;
    const reflect = reflectMesh.current;
    if (reflect) {
      const show = studio > 0.01 && c.fill < 0.9 && c.y + sh / 2 > floorY;
      reflect.visible = show;
      if (show) {
        reflect.position.set(c.x, 2 * floorY - c.y, c.z);
        reflect.rotation.set(-c.rx, c.ry, -c.rz);
        reflect.scale.set(c.w * c.sc, -sh, 1);
        reflect.renderOrder = -3;
        reflectUniforms.uFloorY.value = floorY;
        reflectUniforms.uReflectLen.value = vp.height * reflection.length;
        reflectUniforms.uOpacity.value = c.opacity * reflection.opacity * studio * (1 - c.fill);
      }
    }
    const blob = shadowMesh.current;
    if (blob) {
      const gap = (c.y - sh / 2 - floorY) / vp.height;
      const strength = MathUtils.smoothstep(gap, -0.1, 0) * (1 - MathUtils.smoothstep(gap, 0.12, 0.7)) * studio * (1 - c.fill) * c.opacity;
      blob.visible = strength > 0.005;
      if (blob.visible) {
        blob.position.set(c.x, floorY, c.z);
        blob.scale.set(c.w * c.sc * shadow.width, vp.height * shadow.height, 1);
        blob.renderOrder = -2;
        (blob.material as { opacity: number }).opacity = strength * shadow.opacity;
      }
    }
  });

  return (
    <>
      <mesh ref={mesh} visible={false} material={mainMaterial}>
        <planeGeometry args={[1, 1, 40, 40]} />
      </mesh>
      <mesh ref={reflectMesh} visible={false} material={reflectMaterial}>
        <planeGeometry args={[1, 1, 24, 24]} />
      </mesh>
      <mesh ref={shadowMesh} visible={false} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={getShadowTexture()} color="#000000" transparent depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
      {procedural && <ProceduralVisual index={index} spec={procedural} theme={theme} uniforms={uniforms} />}
    </>
  );
}
