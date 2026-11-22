"use client";

import { useEffect, useRef } from "react";
import { paintPlaceholder } from "@/lib/gradient";

interface LensCanvasProps {
  /** Identity of the artwork: a change starts a crossfade to the new texture. */
  artId: string;
  image?: string;
  alt: string;
  distortion: number;
  chromatic: number;
  glow: number;
  tilt: number;
  fadeMs: number;
  /** WebGL unavailable or failed: the parent should render its CSS fallback. */
  onFail: () => void;
}

/** Textures are POT so mipmaps (used for the defocused rim) work on plain WebGL 1. */
const TEX_SIZE = 1024;
const MAX_DPR = 1.5;
const PERSPECTIVE = 1100;
/** Aspect ratio the placeholder gradient is stretched to. */
const PLACEHOLDER_ASPECT = 1.6;
/** Tilt spring constants. */
const SPRING_K = 90;
const SPRING_DAMP = 14;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Works in CSS pixels from the centre of the canvas (y down). The box is warped like a
// pillow lens, each colour channel gets its own warp (chromatic aberration), the image
// softens toward its rim and a blurred copy of the edge colours bleeds outside as glow.
// Output is premultiplied alpha.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uBoxHalf;
uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform vec2 uUv0;
uniform vec2 uUv1;
uniform float uA0;
uniform float uA1;
uniform float uDist;
uniform float uChrom;
uniform float uGlow;
uniform float uRadius;
uniform vec2 uTilt;

float sdRound(vec2 p, vec2 b, float r) {
  r = min(r, min(b.x, b.y));
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// One colour channel of one layer: x = premultiplied colour, y = alpha.
vec2 channel(sampler2D tex, vec2 uvs, vec2 q, int c) {
  vec2 px = q * uBoxHalf;
  float d = sdRound(px, uBoxHalf, uRadius);
  vec2 uv = 0.5 + 0.5 * (px / uBoxHalf) * uvs;
  vec2 lo = 0.5 - 0.5 * uvs;
  vec2 hi = 0.5 + 0.5 * uvs;
  vec2 st = clamp(uv, lo, hi);
  vec4 sharp = texture2D(tex, st);
  vec4 soft = texture2D(tex, st, 5.5);
  float sv = c == 0 ? sharp.r : (c == 1 ? sharp.g : sharp.b);
  float bv = c == 0 ? soft.r : (c == 1 ? soft.g : soft.b);
  float aa = 2.5;
  float mask = smoothstep(aa, -aa, d);
  float rim = smoothstep(-uGlow * 1.4, 0.0, d);
  float inner = mix(sv, bv, rim * 0.8);
  float glow = 0.75 * exp(-max(d, 0.0) / max(uGlow * 0.45, 0.5));
  float ga = glow * (1.0 - mask);
  return vec2(inner * mask + bv * 1.15 * ga, mask + ga);
}

vec4 layer(sampler2D tex, vec2 uvs, vec2 qR, vec2 qG, vec2 qB) {
  vec2 r = channel(tex, uvs, qR, 0);
  vec2 g = channel(tex, uvs, qG, 1);
  vec2 b = channel(tex, uvs, qB, 2);
  float a = mix(max(r.y, max(g.y, b.y)), (r.y + g.y + b.y) / 3.0, 0.35);
  return vec4(min(r.x, a), min(g.x, a), min(b.x, a), a);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr - uRes * 0.5;
  vec2 p = px / uBoxHalf;
  float r2 = dot(p, p);
  // Pillow: the centre is magnified, edge middles bow outward, corners stay near the box.
  vec2 q = p * (1.0 - 0.8 * uDist * (1.0 - p.yx * p.yx)) * (1.0 + 0.15 * uDist * r2);
  float c = uChrom * 0.02;
  vec2 t = uTilt * c * 0.6;
  vec2 qR = q * (1.0 + c * r2) + t;
  vec2 qB = q * (1.0 - c * r2) - t;
  vec4 col = vec4(0.0);
  if (uA0 > 0.001) col += uA0 * layer(uTex0, uUv0, qR, q, qB);
  if (uA1 > 0.001) col += uA1 * layer(uTex1, uUv1, qR, q, qB);
  float sheen = clamp(dot(p, uTilt) * 0.5, 0.0, 1.0) * 0.07;
  col.rgb += sheen * col.a;
  gl_FragColor = col;
}
`;

type Layer = { tex: WebGLTexture; aspect: number; ready: boolean };
type GLState = {
  gl: WebGLRenderingContext;
  u: Record<string, WebGLUniformLocation | null>;
  layers: [Layer, Layer];
  front: 0 | 1;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

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

/** Artwork rendered through a WebGL convex lens with a pointer-following spring tilt. */
export function LensCanvas({ artId, image, alt, distortion, chromatic, glow, tilt, fadeMs, onFail }: LensCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<GLState | null>(null);
  const kickRef = useRef<() => void>(() => {});
  const params = useRef({ distortion, chromatic, glow, tilt, fadeMs });
  const anim = useRef({
    raf: 0,
    last: 0,
    w: 0,
    h: 0,
    m: 0,
    tx: 0,
    ty: 0,
    vx: 0,
    vy: 0,
    gx: 0,
    gy: 0,
    px: 0,
    py: 0,
    aim: false,
    fading: false,
    fadeStart: 0,
    visible: true,
  });

  useEffect(() => {
    params.current = { distortion, chromatic, glow, tilt, fadeMs };
    kickRef.current();
  }, [distortion, chromatic, glow, tilt, fadeMs]);

  // WebGL context, render loop, sizing and pointer tracking.
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const tiltEl = tiltRef.current;
    if (!root || !canvas || !tiltEl) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl?.createProgram();
    if (!gl || !vs || !fs || !prog) {
      onFail();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onFail();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u: GLState["u"] = {};
    for (const name of [
      "uRes", "uDpr", "uBoxHalf", "uTex0", "uTex1", "uUv0", "uUv1", "uA0", "uA1",
      "uDist", "uChrom", "uGlow", "uRadius", "uTilt",
    ]) {
      u[name] = gl.getUniformLocation(prog, name);
    }
    gl.uniform1i(u.uTex0, 0);
    gl.uniform1i(u.uTex1, 1);
    const makeLayer = (): Layer => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      return { tex, aspect: 1, ready: false };
    };
    const state: GLState = { gl, u, layers: [makeLayer(), makeLayer()], front: 0 };
    glRef.current = state;
    const a = anim.current;

    const draw = (now: number) => {
      const { w, h, m } = a;
      if (w < 1 || h < 1) return;
      const p = params.current;
      const dpr = canvas.width / (w + 2 * m);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const front = state.layers[state.front];
      const back = state.layers[1 - state.front];
      const fading = a.fading && back.ready;
      const t = fading ? clamp((now - a.fadeStart) / p.fadeMs, 0, 1) : 0;
      const e = smooth(t);
      const boxA = w / h;
      const bind = (slot: 0 | 1, layer: Layer, alpha: number) => {
        const imgA = layer.aspect;
        const uv = imgA > boxA ? [boxA / imgA, 1] : [1, imgA / boxA];
        gl.activeTexture(slot === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, layer.tex);
        gl.uniform2f(slot === 0 ? u.uUv0 : u.uUv1, uv[0], uv[1]);
        gl.uniform1f(slot === 0 ? u.uA0 : u.uA1, layer.ready ? alpha : 0);
      };
      bind(0, front, fading ? 1 - e : 1);
      bind(1, back, fading ? e : 0);
      gl.uniform2f(u.uRes, w + 2 * m, h + 2 * m);
      gl.uniform1f(u.uDpr, dpr);
      gl.uniform2f(u.uBoxHalf, w / 2, h / 2);
      gl.uniform1f(u.uDist, p.distortion);
      gl.uniform1f(u.uChrom, p.chromatic);
      gl.uniform1f(u.uGlow, p.glow);
      gl.uniform1f(u.uRadius, Math.min(w, h) * 0.12);
      gl.uniform2f(u.uTilt, a.tx, a.ty);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (fading && t >= 1) {
        front.ready = false;
        state.front = (1 - state.front) as 0 | 1;
        a.fading = false;
      }
    };

    const frame = (now: number) => {
      a.raf = 0;
      const dt = Math.min((now - (a.last || now)) / 1000, 0.05);
      a.last = now;
      let moving = false;
      if (a.aim) {
        // pointer position relative to the window, measured from the lens centre
        const r = root.getBoundingClientRect();
        a.gx = clamp((a.px - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
        a.gy = clamp((a.py - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
        a.aim = false;
      }
      a.vx += ((a.gx - a.tx) * SPRING_K - a.vx * SPRING_DAMP) * dt;
      a.vy += ((a.gy - a.ty) * SPRING_K - a.vy * SPRING_DAMP) * dt;
      a.tx += a.vx * dt;
      a.ty += a.vy * dt;
      if (Math.abs(a.gx - a.tx) + Math.abs(a.gy - a.ty) < 0.0008 && Math.abs(a.vx) + Math.abs(a.vy) < 0.002) {
        a.tx = a.gx;
        a.ty = a.gy;
        a.vx = a.vy = 0;
      } else moving = true;
      if (a.fading) moving = true;
      const max = params.current.tilt;
      tiltEl.style.transform =
        a.tx || a.ty ? `rotateX(${(a.ty * max).toFixed(3)}deg) rotateY(${(-a.tx * max).toFixed(3)}deg)` : "none";
      draw(now);
      if (moving && a.visible) a.raf = requestAnimationFrame(frame);
      else a.last = 0;
    };
    const kick = () => {
      if (!a.raf && a.visible) a.raf = requestAnimationFrame(frame);
    };
    kickRef.current = kick;

    const apply = () => {
      const w = root.offsetWidth;
      const h = root.offsetHeight;
      const p = params.current;
      const m = Math.ceil(p.glow * 2.2 + p.distortion * Math.max(w, h) * 0.35 + 8);
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      a.w = w;
      a.h = h;
      a.m = m;
      canvas.style.left = canvas.style.top = `${-m}px`;
      canvas.style.width = `${w + 2 * m}px`;
      canvas.style.height = `${h + 2 * m}px`;
      const cw = Math.max(1, Math.round((w + 2 * m) * dpr));
      const ch = Math.max(1, Math.round((h + 2 * m) * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        draw(performance.now());
      }
      kick();
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(root);

    // The loop sleeps while off screen.
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[entries.length - 1].isIntersecting;
        if (vis === a.visible) return;
        a.visible = vis;
        if (vis) kick();
        else {
          cancelAnimationFrame(a.raf);
          a.raf = 0;
          a.last = 0;
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(root);

    const aim = (event?: PointerEvent) => {
      if (event) {
        if (event.pointerType === "touch") return;
        a.px = event.clientX;
        a.py = event.clientY;
      }
      a.aim = true;
      kick();
    };
    const rest = () => {
      a.aim = false;
      a.gx = a.gy = 0;
      kick();
    };
    const onScroll = () => {
      if (a.px || a.py) aim();
    };
    window.addEventListener("pointermove", aim, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", rest);
    document.documentElement.addEventListener("mouseleave", rest);
    const onLost = (event: Event) => {
      event.preventDefault();
      onFail();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", rest);
      document.documentElement.removeEventListener("mouseleave", rest);
      canvas.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(a.raf);
      a.raf = 0;
      a.last = 0;
      kickRef.current = () => {};
      glRef.current = null;
      state.layers.forEach((l) => gl.deleteTexture(l.tex));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [onFail]);

  // Texture for the current artwork: uploaded into the idle layer, then crossfaded in.
  useEffect(() => {
    let cancelled = false;
    const upload = (source: HTMLCanvasElement, aspect: number) => {
      const st = glRef.current;
      if (!st || cancelled) return;
      const { gl, layers } = st;
      const a = anim.current;
      if (a.fading) {
        // a fade is still running: finish it instantly before starting the next
        layers[st.front].ready = false;
        st.front = (1 - st.front) as 0 | 1;
        a.fading = false;
      }
      const front = layers[st.front];
      const target = front.ready ? layers[1 - st.front] : front;
      gl.bindTexture(gl.TEXTURE_2D, target.tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      target.aspect = aspect;
      target.ready = true;
      if (target !== front) {
        a.fading = true;
        a.fadeStart = performance.now();
      }
      kickRef.current();
    };
    const scratch = document.createElement("canvas");
    scratch.width = scratch.height = TEX_SIZE;
    let img: HTMLImageElement | null = null;
    if (image) {
      img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled || !img) return;
        scratch.getContext("2d")?.drawImage(img, 0, 0, TEX_SIZE, TEX_SIZE);
        upload(scratch, img.naturalWidth / Math.max(1, img.naturalHeight));
      };
      img.onerror = () => {
        if (!cancelled) onFail();
      };
      img.src = image;
    } else {
      paintPlaceholder(scratch, artId);
      upload(scratch, PLACEHOLDER_ASPECT);
    }
    return () => {
      cancelled = true;
      if (img) img.onload = img.onerror = null;
    };
  }, [artId, image, onFail]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={alt}
      className="relative size-full"
      style={{ perspective: PERSPECTIVE }}
    >
      <div
        ref={tiltRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <canvas ref={canvasRef} className="pointer-events-none absolute top-0 left-0 block" />
      </div>
    </div>
  );
}
