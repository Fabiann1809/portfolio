"use client";

import { useEffect, useRef } from "react";
import { contourBackdrop as cfg } from "@/data/backdrop";
import { addIsoLine, fbm, gauss, parseColor } from "@/lib/contours";
import { prefersReducedMotion } from "@/lib/motion";

type Rgb = [number, number, number];
const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * Topographic contour lines (marching squares over drifting value noise) drawn on a canvas, with
 * an accent scan line and a pointer reaction (bump + decaying wake, lines under it turn accent). Colors come from the tone tokens
 * (--foreground, --emphasis, --contour-alpha). Pauses offscreen / on hidden tabs; draws a single
 * static frame under reduced motion.
 */
export function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return;

    const reduced = prefersReducedMotion();
    const pc = cfg.pointer;
    const trail: { x: number; y: number; age: number }[] = [];
    const mouse = { x: 0, y: 0, on: 0, target: 0, idle: 0, has: false };
    let hot = new Float32Array(0);
    const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let cell = cfg.cellSize.desktop;
    let cols = 0;
    let rows = 0;
    let values = new Float32Array(0);
    let ink: Rgb = [255, 255, 255];
    let accent: Rgb = [255, 255, 255];
    let tone = 0.2;
    let frame = 0;
    let visible = true;
    let lastDraw = 0;
    let clock = 0;
    let lastNow = 0;

    const readTokens = () => {
      const style = getComputedStyle(document.documentElement);
      ink = parseColor(style.getPropertyValue("--foreground"));
      accent = parseColor(style.getPropertyValue("--emphasis"));
      tone = parseFloat(style.getPropertyValue("--contour-alpha")) || 0.2;
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, cfg.maxPixelRatio);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cell = width < 768 ? cfg.cellSize.mobile : cfg.cellSize.desktop;
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      values = new Float32Array((cols + 1) * (rows + 1));
      hot = new Float32Array(values.length);
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const f = cfg.frequency / 1000;
      const stride = cols + 1;
      const active = !reduced && (mouse.on > 0.001 || trail.length > 0);
      const unit = 1 / height; // pointer / trail distances are in hero-height units
      for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
          const k = j * stride + i;
          let v = fbm(i * cell * f + t * cfg.driftSpeed, j * cell * f, t * cfg.warpSpeed, cfg.octaves);
          let h = 0;
          if (active) {
            const px = i * cell;
            const py = j * cell;
            let tr = 0;
            for (const p of trail) {
              const dx = (px - p.x) * unit;
              const dy = (py - p.y) * unit;
              tr += gauss(dx * dx + dy * dy, pc.trailK) * (1 - p.age / pc.trailLife);
            }
            tr = Math.min(1, tr);
            let g = 0;
            if (mouse.on > 0.001) {
              const dx = (px - mouse.x) * unit;
              const dy = (py - mouse.y) * unit;
              g = gauss(dx * dx + dy * dy, pc.bumpK) * mouse.on;
            }
            v += g * pc.bumpAmp + tr * pc.trailAmp;
            h = Math.min(1, tr + g);
          }
          values[k] = v;
          hot[k] = h;
        }
      }

      const [lo, hi] = cfg.levelRange;
      const steps = active ? pc.hotSteps : 0;
      // Bucket 0 = cold lines; buckets 1..steps = increasing heat (accent color + opacity).
      const minor: Path2D[] = [];
      const major: Path2D[] = [];
      for (let b = 0; b <= steps; b++) {
        minor.push(new Path2D());
        major.push(new Path2D());
      }
      const bucket = (i: number, j: number) => {
        const k = j * stride + i;
        const h = (hot[k] + hot[k + 1] + hot[k + stride] + hot[k + stride + 1]) / 4;
        return Math.min(steps, Math.round(h * steps));
      };
      for (let k = 0; k < cfg.levels; k++) {
        const level = lo + ((hi - lo) * k) / Math.max(1, cfg.levels - 1);
        const set = k % cfg.majorEvery === 0 ? major : minor;
        addIsoLine(steps ? (i, j) => set[bucket(i, j)] : set[0], values, cols, rows, cell, level);
      }

      const stroke = (style: string | CanvasGradient, b = 0) => {
        ctx.strokeStyle = style;
        ctx.lineWidth = cfg.lineWidth;
        ctx.stroke(minor[b]);
        ctx.lineWidth = cfg.majorLineWidth;
        ctx.stroke(major[b]);
      };

      // Base lines, then hotter buckets drawn in accent with more opacity.
      const baseAlpha = tone * cfg.baseAlpha;
      stroke(rgba(ink, baseAlpha), 0);
      for (let b = 1; b <= steps; b++) {
        const h = b / steps;
        stroke(rgba(mix(ink, accent, h), baseAlpha + (pc.hotAlpha - baseAlpha) * h), b);
      }

      // Scan line sweeping left to right; contours under it turn accent-colored.
      if (!reduced) {
        const progress = (t % cfg.scan.periodSeconds) / cfg.scan.periodSeconds;
        const x = -cfg.scan.bandWidth + progress * (width + cfg.scan.bandWidth * 2);
        const band = ctx.createLinearGradient(x - cfg.scan.bandWidth, 0, x, 0);
        band.addColorStop(0, rgba(accent, 0));
        band.addColorStop(1, rgba(accent, cfg.scan.contourAlpha));
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - cfg.scan.bandWidth, 0, cfg.scan.bandWidth, height);
        ctx.clip();
        stroke(band, 0);
        ctx.restore();
        ctx.fillStyle = rgba(accent, cfg.scan.lineAlpha);
        ctx.fillRect(x, 0, 1, height);
      }
    };

    const stepPointer = (dt: number) => {
      mouse.idle += dt;
      if (mouse.idle > pc.idleSeconds) mouse.target = 0;
      mouse.on += (mouse.target - mouse.on) * Math.min(1, dt * pc.easeRate);
      if (mouse.on < 0.001 && mouse.target === 0) mouse.on = 0;
      for (const p of trail) p.age += dt;
      while (trail.length && trail[0].age >= pc.trailLife) trail.shift();
    };

    const onPoint = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouse.target = 0;
        return;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.target = 1;
      mouse.idle = 0;
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(x - last.x, y - last.y) >= pc.trailSpacing) {
        trail.push({ x, y, age: 0 });
        if (trail.length > pc.trailMax) trail.shift();
      }
    };
    const onPointer = (e: PointerEvent) => onPoint(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPoint(t.clientX, t.clientY);
    };
    const onLeave = () => (mouse.target = 0);
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      window.addEventListener("touchstart", onTouch, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    const loop = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      frame = requestAnimationFrame(loop);
      if (now - lastDraw < 1000 / cfg.fps) return;
      const dt = Math.min(0.1, (now - (lastNow || now)) / 1000);
      clock += dt;
      lastNow = now;
      stepPointer(dt);
      lastDraw = now;
      draw(clock);
    };

    const start = () => {
      if (reduced || frame || !visible || document.hidden) return;
      lastNow = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    readTokens();
    draw(clock);
    start();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(clock);
    });
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
      draw(clock);
    });
    tokens.observe(document.documentElement, { attributes: true, attributeFilter: ["data-backdrop"] });

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      tokens.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
