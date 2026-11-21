"use client";

import { useEffect, useRef } from "react";
import { contourBackdrop as cfg } from "@/data/backdrop";
import { addIsoLine, fbm, parseColor } from "@/lib/contours";
import { prefersReducedMotion } from "@/lib/motion";

type Rgb = [number, number, number];
const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * Topographic contour lines (marching squares over drifting value noise) drawn on a canvas, with
 * an accent scan line and a light-following highlight. Colors come from the tone tokens
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
    const stage = canvas.closest<HTMLElement>("[data-light-zone]");
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
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const f = cfg.frequency / 1000;
      const stride = cols + 1;
      for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
          values[j * stride + i] = fbm(i * cell * f + t * cfg.driftSpeed, j * cell * f, t * cfg.warpSpeed, cfg.octaves);
        }
      }

      const [lo, hi] = cfg.levelRange;
      const minor = new Path2D();
      const major = new Path2D();
      for (let k = 0; k < cfg.levels; k++) {
        const level = lo + ((hi - lo) * k) / Math.max(1, cfg.levels - 1);
        addIsoLine(k % cfg.majorEvery === 0 ? major : minor, values, cols, rows, cell, level);
      }

      const stroke = (style: string | CanvasGradient) => {
        ctx.strokeStyle = style;
        ctx.lineWidth = cfg.lineWidth;
        ctx.stroke(minor);
        ctx.lineWidth = cfg.majorLineWidth;
        ctx.stroke(major);
      };

      // Base lines.
      stroke(rgba(ink, tone * cfg.baseAlpha));

      // Light: lines brighten around the pointer light.
      const lx = (parseFloat(stage?.style.getPropertyValue("--light-x") || "30") / 100) * width;
      const ly = (parseFloat(stage?.style.getPropertyValue("--light-y") || "22") / 100) * height;
      const radius = cfg.light.radius * Math.max(width, height);
      const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius);
      glow.addColorStop(0, rgba(ink, Math.min(1, tone * (1 + cfg.light.boost * 4))));
      glow.addColorStop(1, rgba(ink, 0));
      stroke(glow);

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
        stroke(band);
        ctx.restore();
        ctx.fillStyle = rgba(accent, cfg.scan.lineAlpha);
        ctx.fillRect(x, 0, 1, height);
      }
    };

    const loop = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      frame = requestAnimationFrame(loop);
      if (now - lastDraw < 1000 / cfg.fps) return;
      clock += Math.min(0.1, (now - (lastNow || now)) / 1000);
      lastNow = now;
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
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
