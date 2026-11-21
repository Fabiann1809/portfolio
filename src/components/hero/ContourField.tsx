"use client";

import { useEffect, useRef } from "react";
import { contourBackdrop as cfg } from "@/data/backdrop";
import { prefersReducedMotion } from "@/lib/motion";

type Rgb = [number, number, number];

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uTrail;
uniform vec3 uLine;
uniform vec3 uAccent;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform float uIdleA;
uniform float uHotA;
uniform float uFreq;
uniform float uLevels;
uniform vec2 uDrift;
uniform float uSoft;
uniform float uBumpK;
uniform float uBumpAmp;
uniform float uTrailAmp;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * snoise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 p = frag / uRes.y;
  vec2 m = uMouse / uRes.y;
  float md = length(p - m);

  // Gooey pointer blob: trail texture + animated noise through a soft threshold
  float t = texture2D(uTrail, vec2(frag.x / uRes.x, 1.0 - frag.y / uRes.y)).r;
  float n = snoise(p * 2.4 + vec2(uTime * 0.28, -uTime * 0.2)) * 0.6
          + snoise(p * 5.2 - vec2(uTime * 0.42, uTime * 0.24)) * 0.4;
  float blob = smoothstep(0.30, 0.345, t + n * 0.16);

  float bump = exp(-md * md * uBumpK) * uBumpAmp * uMouseOn + t * uTrailAmp;
  float f = fbm(p * uFreq + uDrift * uTime) + bump;
  float lv = f * uLevels;
  float ld = abs(fract(lv + 0.5) - 0.5);
  float w = fwidth(lv);
  float line = 1.0 - smoothstep(0.0, w * uSoft, ld);
  float la = line * mix(uIdleA, uHotA, blob);
  gl_FragColor = vec4(mix(uLine, uAccent, blob) * la, la);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Topographic contour backdrop: a raw WebGL per-pixel fragment shader (simplex fbm iso-lines with
 * derivative anti-aliasing) plus a gooey pointer blob driven by a low-res decaying trail canvas.
 * Colors come from the tone tokens (--foreground, --emphasis, --contour-alpha) and are re-read when
 * data-backdrop changes. Pauses offscreen / on hidden tabs; one static frame under reduced motion.
 * Renders nothing if WebGL is unavailable.
 */
export function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true, alpha: true });
    if (!gl) return;
    if (!gl.getExtension("OES_standard_derivatives")) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const loc = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: loc("uRes"), time: loc("uTime"), trail: loc("uTrail"), line: loc("uLine"), accent: loc("uAccent"),
      mouse: loc("uMouse"), mouseOn: loc("uMouseOn"), idleA: loc("uIdleA"), hotA: loc("uHotA"),
      freq: loc("uFreq"), levels: loc("uLevels"), drift: loc("uDrift"), soft: loc("uSoft"),
      bumpK: loc("uBumpK"), bumpAmp: loc("uBumpAmp"), trailAmp: loc("uTrailAmp"),
    };
    const pc = cfg.pointer;

    const trailTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, trailTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.uniform1i(U.trail, 0);
    gl.uniform1f(U.hotA, cfg.hotAlpha);
    gl.uniform1f(U.freq, cfg.frequency);
    gl.uniform1f(U.levels, cfg.levels);
    gl.uniform2f(U.drift, cfg.drift[0], cfg.drift[1]);
    gl.uniform1f(U.soft, cfg.lineSoftness);
    gl.uniform1f(U.bumpK, pc.bumpK);
    gl.uniform1f(U.bumpAmp, pc.bumpAmp);
    gl.uniform1f(U.trailAmp, pc.trailAmp);

    const reduced = prefersReducedMotion();
    const trail = document.createElement("canvas");
    const tctx = trail.getContext("2d");
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const pctx = probe.getContext("2d", { willReadFrequently: true });
    if (!tctx || !pctx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let visible = true;
    let raf = 0;
    let prev = 0;
    let clock = 0;
    let drawReady = false;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let last = { x: 0, y: 0 };
    let inside = false;
    let lastPointerTime = -1e9;
    let wasActive = false;
    let mouseOn = 0;

    // Resolve a CSS color (any syntax the browser accepts) to 0..1 rgb by painting one pixel.
    const toRgb = (value: string, fallback: Rgb): Rgb => {
      const v = value.trim();
      if (!v) return fallback;
      pctx.clearRect(0, 0, 1, 1);
      pctx.fillStyle = "#000";
      pctx.fillStyle = v;
      pctx.fillRect(0, 0, 1, 1);
      const d = pctx.getImageData(0, 0, 1, 1).data;
      return [d[0] / 255, d[1] / 255, d[2] / 255];
    };
    const readTokens = () => {
      const style = getComputedStyle(document.documentElement);
      const line = toRgb(style.getPropertyValue("--foreground"), [0.93, 0.93, 0.94]);
      const accent = toRgb(style.getPropertyValue("--emphasis"), [1, 0.35, 0.12]);
      const tone = parseFloat(style.getPropertyValue("--contour-alpha")) || 0.2;
      gl.uniform3fv(U.line, line);
      gl.uniform3fv(U.accent, accent);
      gl.uniform1f(U.idleA, tone * cfg.idleAlpha);
    };

    const draw = () => {
      gl.bindTexture(gl.TEXTURE_2D, trailTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, reduced ? 0 : clock);
      gl.uniform2f(U.mouse, pos.x * dpr, (height - pos.y) * dpr);
      gl.uniform1f(U.mouseOn, mouseOn);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, cfg.maxPixelRatio);
      const cw = Math.max(1, Math.round(width * dpr));
      const ch = Math.max(1, Math.round(height * dpr));
      if (canvas.width === cw && canvas.height === ch) return;
      canvas.width = cw;
      canvas.height = ch;
      trail.width = Math.max(1, Math.round(width * pc.trailScale));
      trail.height = Math.max(1, Math.round(height * pc.trailScale));
      tctx.fillStyle = "#000";
      tctx.fillRect(0, 0, trail.width, trail.height);
      if (drawReady) draw(); // resizing clears the canvas; redraw before paint
    };

    const stamp = (x: number, y: number, r: number, strength: number) => {
      const g = tctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${strength})`);
      g.addColorStop(0.55, `rgba(255,255,255,${strength * 0.55})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      tctx.fillStyle = g;
      tctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!inside) return;
      target.x = x;
      target.y = y;
      lastPointerTime = performance.now();
    };
    const onLeave = () => {
      inside = false;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (prev || now)) / 1000);
      prev = now;
      clock += dt;

      const active = inside && now - lastPointerTime < pc.idleSeconds * 1000;
      const follow = 1 - Math.pow(0.82, dt * 60);
      pos.x += (target.x - pos.x) * follow;
      pos.y += (target.y - pos.y) * follow;
      if (active && !wasActive) {
        pos.x = target.x;
        pos.y = target.y;
        last = { x: pos.x, y: pos.y };
      }
      wasActive = active;

      tctx.globalCompositeOperation = "source-over";
      tctx.fillStyle = `rgba(0,0,0,${1 - Math.pow(pc.trailDecay, dt * 60)})`;
      tctx.fillRect(0, 0, trail.width, trail.height);
      if (active) {
        tctx.globalCompositeOperation = "lighter";
        const dx = pos.x - last.x;
        const dy = pos.y - last.y;
        const dist = Math.hypot(dx, dy);
        const speed = dist / Math.max(dt, 0.001);
        const r = pc.brushSize * pc.trailScale * (0.75 + Math.min(speed / 1400, 0.45));
        const steps = Math.max(1, Math.ceil(dist / (r * 0.25)));
        const strength = 0.16 + Math.min(speed / 2600, 0.14);
        for (let i = 1; i <= steps; i++) {
          const k = i / steps;
          stamp((last.x + dx * k) * pc.trailScale, (last.y + dy * k) * pc.trailScale, r, strength);
        }
      }
      last = { x: pos.x, y: pos.y };
      mouseOn += ((active ? 1 : 0) - mouseOn) * Math.min(1, dt * pc.easeRate);
      draw();
    };

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      prev = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    readTokens();
    drawReady = true;
    draw();
    start();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    visibility.observe(host);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const tokens = new MutationObserver(() => {
      readTokens();
      if (!raf) draw();
    });
    tokens.observe(document.documentElement, { attributes: true, attributeFilter: ["data-backdrop"] });
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      tokens.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteTexture(trailTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
