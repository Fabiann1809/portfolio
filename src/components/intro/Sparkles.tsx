"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface PenTip {
  x: number;
  y: number;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const MAX_PARTICLES = 160;

/** Canvas of small fading particles emitted at the pen tip (client coordinates). */
export function Sparkles({ tipRef }: { tipRef: RefObject<PenTip> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const colors = ["--color-primary", "--color-accent"].map(
      (name) => styles.getPropertyValue(name).trim() || "#ffffff",
    );

    let dpr = 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const tip = tipRef.current;

      if (tip.active) {
        for (let i = 0; i < 2 && particles.length < MAX_PARTICLES; i++) {
          const maxLife = 400 + Math.random() * 400;
          particles.push({
            x: tip.x + (Math.random() - 0.5) * 6,
            y: tip.y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.06,
            vy: -0.02 - Math.random() * 0.05,
            life: maxLife,
            maxLife,
            size: 1 + Math.random() * 2.2,
            color: colors[Math.random() < 0.5 ? 0 : 1],
          });
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.4 + alpha * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [tipRef]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
