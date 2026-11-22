"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Rgb = [number, number, number];

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uText;
uniform sampler2D uTrail;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform vec2 uMouse;
uniform float uMouseOn;

float trailAt(vec2 uv) { return texture2D(uTrail, uv).r; }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 tuv = vec2(uv.x, 1.0 - uv.y);
  vec2 px = 3.0 / uRes;
  float t = trailAt(tuv);
  float gx = trailAt(tuv + vec2(px.x, 0.0)) - trailAt(tuv - vec2(px.x, 0.0));
  float gy = trailAt(tuv + vec2(0.0, px.y)) - trailAt(tuv - vec2(0.0, px.y));
  vec2 grad = vec2(gx, gy);
  float wave = sin(t * 18.0 - uTime * 6.0) * t;
  vec2 off = grad * 0.9 + grad * wave * 0.6;

  float split = t * 0.012;
  float r = texture2D(uText, tuv + off + vec2(split, 0.0)).a;
  float g = texture2D(uText, tuv + off).a;
  float b = texture2D(uText, tuv + off - vec2(split, 0.0)).a;

  // faint dot grid that charges up near the pointer and under the trail
  vec2 local = fract(gl_FragCoord.xy / 18.0) - 0.5;
  float dotm = 1.0 - smoothstep(0.06, 0.1, length(local));
  vec2 m = uMouse / uRes;
  float near = exp(-length((uv - m) * vec2(uRes.x / uRes.y, 1.0)) * 6.0) * uMouseOn;
  vec3 col = uBg + (uInk - uBg) * dotm * (0.05 + near * 0.25 + t * 0.4);

  vec3 ink = mix(uInk, uAccent, smoothstep(0.05, 0.35, t));
  vec3 textCol = vec3(r, g, b);
  float a = max(max(r, g), b);
  col = mix(col, ink * textCol / max(a, 0.001), a);
  gl_FragColor = vec4(col, 1.0);
}
`;

const TRAIL_SCALE = 0.35;
const MAX_DPR = 1.75;
const IDLE_MS = 2500;

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

/** Resolve any CSS color (hex, rgb, color-mix, ...) to 0..1 RGB by painting one pixel. */
function toRgb(value: string, fallback: Rgb): Rgb {
  const v = value.trim();
  if (!v) return fallback;
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallback;
  ctx.canvas.width = 1;
  ctx.canvas.height = 1;
  ctx.fillStyle = "#000";
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}

/**
 * Giant footer name as a WebGL "liquid metal" headline. The name is drawn into a 2D canvas used as a
 * texture; a low-res canvas holds a decaying pointer trail that displaces it. Falls back to plain text
 * (visible until WebGL is confirmed working). The name is decorative, so everything is aria-hidden.
 */
export function LiquidName({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const textCanvas = document.createElement("canvas");
    const tx = textCanvas.getContext("2d");
    const trail = document.createElement("canvas");
    const tc = trail.getContext("2d");
    if (!tx || !tc) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("uRes"),
      time: u("uTime"),
      text: u("uText"),
      trail: u("uTrail"),
      bg: u("uBg"),
      ink: u("uInk"),
      accent: u("uAccent"),
      mouse: u("uMouse"),
      mouseOn: u("uMouseOn"),
    };
    const makeTex = (unit: number) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return tex;
    };
    const textTex = makeTex(0);
    const trailTex = makeTex(1);
    gl.uniform1i(U.text, 0);
    gl.uniform1i(U.trail, 1);

    // GL is up: hide the plain-text fallback and show the canvas
    if (fallback) fallback.style.visibility = "hidden";
    canvas.style.visibility = "visible";

    let width = 1;
    let height = 1;
    let dpr = 1;
    let disposed = false;

    const drawText = () => {
      if (disposed) return;
      textCanvas.width = Math.max(1, Math.round(width * dpr));
      textCanvas.height = Math.max(1, Math.round(height * dpr));
      tx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      const family = getComputedStyle(canvas).fontFamily || "sans-serif";
      const font = (size: number) => `900 ${size}px ${family}`;
      tx.font = font(400);
      const probe = tx.measureText(text);
      const widthAt400 = Math.max(1, probe.width);
      const capAt400 = Math.max(1, probe.actualBoundingBoxAscent);
      // Fill the width, but never taller than the band
      const maxW = width * dpr;
      const size = Math.min(400 * (maxW / widthAt400), (height * dpr * 1.0 * 400) / capAt400);
      tx.font = font(size);
      const m = tx.measureText(text);
      tx.fillStyle = "#fff";
      tx.textBaseline = "alphabetic";
      const x = (textCanvas.width - m.width) / 2;
      // baseline slightly below the band edge so the bottom of the letters is cut a little
      const baseline = textCanvas.height + m.actualBoundingBoxAscent * 0.03;
      tx.fillText(text, x, baseline);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      width = Math.max(1, r.width);
      height = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      trail.width = Math.max(1, Math.round(width * TRAIL_SCALE));
      trail.height = Math.max(1, Math.round(height * TRAIL_SCALE));
      tc.fillStyle = "#000";
      tc.fillRect(0, 0, trail.width, trail.height);
      drawText();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // redraw once the real face has loaded (and again if more fonts finish later)
    const family = getComputedStyle(canvas).fontFamily || "sans-serif";
    const loadFont = () => {
      document.fonts
        ?.load(`900 100px ${family}`)
        .then(() => drawText())
        .catch(() => {});
    };
    loadFont();
    document.fonts?.addEventListener?.("loadingdone", drawText);

    // colors come from the live CSS tokens and refresh when the backdrop tone changes
    const colors = { bg: [0, 0, 0] as Rgb, ink: [1, 1, 1] as Rgb, accent: [0.5, 0.8, 1] as Rgb };
    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      colors.bg = toRgb(s.getPropertyValue("--background"), colors.bg);
      colors.ink = toRgb(s.getPropertyValue("--foreground"), colors.ink);
      const accent = s.getPropertyValue("--emphasis") || s.getPropertyValue("--color-accent");
      colors.accent = toRgb(accent, colors.accent);
    };
    readColors();
    const tokens = new MutationObserver(readColors);
    tokens.observe(document.documentElement, { attributes: true, attributeFilter: ["data-backdrop"] });

    const target = { x: width * 0.5, y: height * 0.5 };
    const pos = { ...target };
    let last = { ...pos };
    let inside = false;
    let lastMove = -1e9;
    let mouseOn = 0;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (!inside) return;
      target.x = x;
      target.y = y;
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const stamp = (x: number, y: number, r: number, s: number) => {
      const g = tc.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${s})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      tc.fillStyle = g;
      tc.fillRect(x - r, y - r, r * 2, r * 2);
    };

    let inView = true;
    let raf = 0;
    const t0 = performance.now();
    let prev = t0;

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const time = reduced ? 0 : (now - t0) / 1000;
      const idle = now - lastMove > IDLE_MS;
      // reduced motion: the type only reacts to the pointer, it never drifts by itself
      if (idle && !reduced) {
        target.x = width * (0.5 + Math.sin(time * 0.5) * 0.32);
        target.y = height * (0.45 + Math.cos(time * 0.9) * 0.12);
      }
      const active = reduced ? inside && !idle : true;
      pos.x += (target.x - pos.x) * Math.min(1, dt * 9);
      pos.y += (target.y - pos.y) * Math.min(1, dt * 9);

      tc.globalCompositeOperation = "source-over";
      tc.fillStyle = `rgba(0,0,0,${1 - Math.pow(0.93, dt * 60)})`;
      tc.fillRect(0, 0, trail.width, trail.height);
      if (active) {
        tc.globalCompositeOperation = "lighter";
        const dx = pos.x - last.x;
        const dy = pos.y - last.y;
        const dist = Math.hypot(dx, dy);
        const r = Math.min(90, height * 0.45) * TRAIL_SCALE * (idle ? 0.8 : 1);
        const steps = Math.max(1, Math.ceil((dist * TRAIL_SCALE) / (r * 0.4)));
        for (let i = 1; i <= steps; i++) {
          const k = i / steps;
          stamp((last.x + dx * k) * TRAIL_SCALE, (last.y + dy * k) * TRAIL_SCALE, r, idle ? 0.06 : 0.14);
        }
      }
      last = { ...pos };
      mouseOn += ((inside && !idle ? 1 : 0) - mouseOn) * Math.min(1, dt * 4);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, trailTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, time);
      gl.uniform3fv(U.bg, colors.bg);
      gl.uniform3fv(U.ink, colors.ink);
      gl.uniform3fv(U.accent, colors.accent);
      gl.uniform2f(U.mouse, pos.x * dpr, (height - pos.y) * dpr);
      gl.uniform1f(U.mouseOn, mouseOn);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (inView && document.visibilityState === "visible") raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || disposed) return;
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      if (inView) start();
    });
    io.observe(wrap);
    const onVis = () => {
      if (document.visibilityState === "visible" && inView) start();
    };
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      tokens.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      document.fonts?.removeEventListener?.("loadingdone", drawText);
      gl.deleteTexture(textTex);
      gl.deleteTexture(trailTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [text, reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative mt-6 h-[clamp(120px,34vw,420px)] w-full overflow-hidden font-sans select-none"
    >
      <p
        ref={fallbackRef}
        className="absolute inset-0 flex items-end justify-center overflow-hidden text-[clamp(80px,22vw,360px)] leading-[0.78] font-black tracking-[-0.05em] text-foreground/10"
      >
        {text}
      </p>
      <canvas ref={canvasRef} className="invisible absolute inset-0 size-full" />
    </div>
  );
}
