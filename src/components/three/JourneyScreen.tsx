"use client";

/* eslint-disable react-hooks/immutability -- three.js uniforms and objects are mutated per frame by design */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { damp } from "maath/easing";
import { CanvasTexture, Color, DoubleSide, Euler, MathUtils, Quaternion, ShaderMaterial, SRGBColorSpace, TextureLoader, VideoTexture, Vector3 } from "three";
import type { Mesh, Texture } from "three";
import { journeyConfig } from "@/data/chapters";
import { hero } from "@/data/hero";
import { drawHeroTexture, whenPortraitReady } from "@/lib/heroTexture";
import type { ThemeColors } from "@/types";
import { getJourneyState, stepJourney } from "@/lib/journey";
import { live, poses, screenInView } from "@/lib/journeyModel";
import type { ScreenDef } from "@/lib/journeyModel";
import { ProceduralVisual } from "./environment/ProceduralVisual";
import { screenFragmentShader, screenVertexShader } from "./shaders/screen";

interface JourneyScreenProps {
  index: number;
  def: ScreenDef;
  theme: ThemeColors;
}

const { stream, screen, fx, smooth } = journeyConfig;
const { glitch, expand } = stream;
const PATH = (stream.pathAngle * Math.PI) / 180;
const PATH_SIN = Math.sin(PATH);
const PATH_COS = Math.cos(PATH);
/** Rotation axis of the sphere (in the screen plane, perpendicular to the path) and the path direction at the front (towards the bottom, slightly right). */
const AXIS = new Vector3(PATH_COS, PATH_SIN, 0);
const TANGENT_X = PATH_SIN;
const TANGENT_Y = -PATH_COS;
const sphereQuat = new Quaternion();
const localQuat = new Quaternion();
const localEuler = new Euler();
const VIDEO_PATTERN = /\.(mp4|webm|ogv|mov)(\?.*)?$/i;

/**
 * One frameless warped panel mounted on the big rotating sphere of the journey. The shared journey
 * model gives its angular distance `r` from the front, its fill (shrunk panel .. full-bleed) and
 * opacity; the damped angle is rotated around the sphere centre, so the panel travels along an
 * arc and stays tangent to the sphere surface (it faces the camera at the front and turns away
 * towards the edges). Every value is damped per frame before it reaches the mesh. Its picture is, in priority order: an image / video URL
 * (`def.visual`), a procedural 3D scene rendered to a texture (`def.scene`), a generated
 * hero texture or a generated gradient.
 */
export function JourneyScreen({ index, def, theme }: JourneyScreenProps) {
  const mesh = useRef<Mesh>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const videoPlaying = useRef(false);
  const texture = useRef<Texture | null>(null);
  const seen = useRef(false);
  const cur = useRef({ arc: 0, w: 1, h: 1, fill: 0, opacity: 0 });

  const seed = (index * 0.37 + 0.11) % 1;
  const seedB = (seed * 7.31 + 0.3) % 1;
  const seedC = (seedB * 5.77 + 0.17) % 1;
  const procedural = !def.visual && !def.generated && def.scene ? def.scene : null;
  const blurred = !def.generated;
  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as Texture | null },
      uHasTexture: { value: 0 },
      uTexAspect: { value: screen.aspect },
      uPlaneAspect: { value: screen.aspect },
      uBulge: { value: 0 },
      uCorner: { value: 0 },
      uSmear: { value: 0 },
      uRgb: { value: fx.rgbBase },
      uScan: { value: fx.scan },
      uVignette: { value: fx.vignette },
      uFill: { value: 0 },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uBlur: { value: 0 },
      uTear: { value: fx.tear },
      uGlitch: { value: 0 },
      uGlitchShift: { value: glitch.shift },
      uGlitchRgb: { value: glitch.rgb },
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

  // The material is built here (not by JSX) so the uniform objects above are the live ones.
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: screenVertexShader,
        fragmentShader: screenFragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);

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
    // Deterministic per-panel variation: neighbours vary more than the one resting at the front.
    const variance = k * Math.min(1, dist);
    const vary = stream.variation;

    // Panels are spaced along the great circle so neighbours almost touch at the front.
    const shiftX = state.size.width < stream.narrowPx ? stream.shiftXNarrow : stream.shiftX;
    const pxToWorld = vp.width / state.size.width;
    const colFree = 2 * (vp.width * (0.5 + shiftX) - stream.columnPx * pxToWorld);
    const restW = Math.min(vp.width * screen.widthRatio, vp.height * screen.maxHeightRatio * screen.aspect, colFree) * stream.scale;
    const restH = restW / screen.aspect;
    const fullW = vp.width * screen.overscan;
    const fullH = vp.height * screen.overscan;
    const reach = Math.min(restW / Math.max(PATH_SIN, 1e-3), restH / Math.max(PATH_COS, 1e-3)) * stream.spacing;
    const radius = stream.radius * vp.height;

    // Last stretch of the expansion: the bent corners are pushed past the viewport corners.
    const over = 1 + expand.overshoot * MathUtils.smoothstep(pose.fill, expand.bulgeHold, 1);
    const target = {
      arc: (pose.r * reach) / radius,
      w: MathUtils.lerp(restW, fullW, pose.fill) * over,
      h: MathUtils.lerp(restH, fullH, pose.fill) * over,
      fill: pose.fill,
      opacity: pose.opacity,
    };

    if (!seen.current) {
      Object.assign(c, target);
      seen.current = true;
    } else {
      // The arc angle (not x / y / z) is damped, so the motion always follows the sphere.
      damp(c, "arc", target.arc, smooth.position, dt);
      damp(c, "w", target.w, smooth.shape, dt);
      damp(c, "h", target.h, smooth.shape, dt);
      damp(c, "fill", target.fill, smooth.shape, dt);
      damp(c, "opacity", target.opacity, smooth.shape, dt);
    }

    // Sphere rotation applied to the anchor (surface point + outward normal). A filled panel
    // sits at the front with no rotation.
    const kk = 1 - c.fill;
    const angle = c.arc;
    const sinA = Math.sin(angle);
    // Pass-and-expand: the panel keeps rising a little while it grows (bump: 0 at both ends of the fill).
    const rise = expand.rise * vp.height * 4 * c.fill * (1 - c.fill);
    m.position.set(
      TANGENT_X * radius * sinA + shiftX * vp.width * kk,
      TANGENT_Y * radius * sinA + rise,
      radius * (Math.cos(angle) - 1),
    );
    // Tilted the same way on both sides of the front: seen from below (top edge farther), straight at the centre.
    sphereQuat.setFromAxisAngle(AXIS, -Math.abs(angle) * stream.tilt);
    localEuler.set(
      (seedC - 0.5) * 2 * vary.pitch * variance,
      MathUtils.degToRad(stream.yaw) * k + (seedB - 0.5) * 2 * vary.yaw * variance,
      (seed - 0.5) * 2 * vary.roll * variance,
    );
    localQuat.setFromEuler(localEuler);
    m.quaternion.copy(sphereQuat).multiply(localQuat);
    m.scale.set(c.w, c.h, 1);
    // Farther panels draw first; the filled one draws on top.
    m.renderOrder = 50 - Math.round(dist * 10) + Math.round(c.fill * 100);

    const journey = getJourneyState();
    const un = uniforms;
    // Convex barrel: 0 once the panel fills the viewport.
    // Held while the panel grows, relaxes only once it nearly covers the viewport.
    const bendK = 1 - MathUtils.smoothstep(c.fill, expand.bulgeHold, 1);
    un.uTime.value = state.clock.elapsedTime;
    un.uPlaneAspect.value = c.w / c.h;
    un.uFill.value = c.fill;
    un.uOpacity.value = c.opacity;
    un.uBulge.value = stream.bend.bulge * bendK;
    un.uCorner.value = stream.bend.corner * bendK;
    live.cover[index] = MathUtils.smoothstep(c.fill, 0.92, 1) * c.opacity;
    const baseDim = def.generated ? 0 : fx.dimFilled * c.fill;
    un.uDim.value = Math.min(0.9, baseDim);
    un.uBlur.value = blurred ? fx.blurFilled * c.fill : 0;
    un.uSmear.value = journey.smear;
    // Glitch from the path position: strong when entering from the bottom, mild when leaving over the top.
    const pos = (c.arc * radius) / Math.max(reach, 1e-3);
    const gIn = MathUtils.smoothstep(pos, glitch.inStart, glitch.inEnd);
    const gOut = glitch.exit * MathUtils.smoothstep(-pos, glitch.inStart, glitch.inEnd);
    un.uGlitch.value = Math.max(gIn, gOut) * glitch.strength * (1 - c.fill);
    un.uTear.value = fx.tear + journey.smear * fx.tearGain;
    un.uRgb.value = fx.rgbBase + journey.smear * fx.rgbGain;
    un.uDrift.value = journey.drift + state.clock.elapsedTime * 0.05;
  });

  return (
    <>
      <mesh ref={mesh} visible={false} material={material} frustumCulled={false}>
        <planeGeometry args={[1, 1, 64, 40]} />
      </mesh>
      {procedural && <ProceduralVisual index={index} spec={procedural} theme={theme} uniforms={uniforms} />}
    </>
  );
}
