"use client";

import { useEffect, useRef } from "react";
import { extra } from "@/data/extra";
import { stack } from "@/data/stack";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Ability } from "@/types";

const SIZE = { w: 400, h: 340 };
const CENTER = { x: SIZE.w / 2, y: SIZE.h / 2 };
const RADIUS = 104;
const RINGS = 4;

const angleOf = (i: number, n: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
const pointAt = (i: number, n: number, r: number) =>
  `${(CENTER.x + Math.cos(angleOf(i, n)) * r).toFixed(1)},${(CENTER.y + Math.sin(angleOf(i, n)) * r).toFixed(1)}`;
const ringPoints = (n: number, k: number) => Array.from({ length: n }, (_, i) => pointAt(i, n, RADIUS * k)).join(" ");

/** Scan panel: animated SVG radar, tick-up readouts, description and the ability's framework icons. */
export function PowerScan({ ability }: { ability: Ability }) {
  const reduced = useReducedMotion();
  const axes = extra.axes;
  const n = axes.length;
  const shapeRef = useRef<SVGPolygonElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const readoutRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Eased values live across ability changes, so the shape morphs from the previous profile.
  const current = useRef<number[]>(axes.map(() => 0));

  useEffect(() => {
    const target = axes.map((_, i) => (ability.stats[i] ?? 50) / 100);
    let raf = 0;
    let prev = performance.now();
    const write = () => {
      const cur = current.current;
      shapeRef.current?.setAttribute(
        "points",
        cur.map((v, i) => pointAt(i, n, RADIUS * v)).join(" "),
      );
      cur.forEach((v, i) => {
        const dot = dotRefs.current[i];
        if (dot) {
          const [x, y] = pointAt(i, n, RADIUS * v).split(",");
          dot.setAttribute("cx", x);
          dot.setAttribute("cy", y);
        }
        const out = readoutRefs.current[i];
        if (out) out.textContent = String(Math.round(v * 100)).padStart(3, "0");
      });
    };
    if (reduced) {
      current.current = target.slice();
      write();
      return;
    }
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const cur = current.current;
      let settled = true;
      for (let i = 0; i < cur.length; i++) {
        cur[i] += (target[i] - cur[i]) * Math.min(1, dt * 5);
        if (Math.abs(target[i] - cur[i]) > 0.002) settled = false;
        else cur[i] = target[i];
      }
      write();
      if (!settled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ability, axes, n, reduced]);

  const technologies = ability.technologies
    .map((name) => stack.find((item) => item.name === name))
    .filter((item) => item !== undefined);

  return (
    <div className="flex flex-col gap-6">
      <svg
        viewBox={`0 0 ${SIZE.w} ${SIZE.h}`}
        role="img"
        aria-label={`${extra.radarAria}: ${ability.name}`}
        className="mx-auto w-full max-w-md text-foreground"
      >
        {Array.from({ length: RINGS }, (_, r) => (
          <polygon
            key={r}
            points={ringPoints(n, (r + 1) / RINGS)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={r === RINGS - 1 ? 0.28 : 0.1}
          />
        ))}
        {axes.map((axis, i) => {
          const [x, y] = pointAt(i, n, RADIUS).split(",");
          const [lx, ly] = pointAt(i, n, RADIUS + 28).split(",");
          return (
            <g key={axis}>
              <line x1={CENTER.x} y1={CENTER.y} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.1} />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fillOpacity={0.6}
                fontSize={10}
                letterSpacing={1.4}
                style={{ fontFamily: "var(--font-mono), monospace", textTransform: "uppercase" }}
              >
                {axis}
              </text>
            </g>
          );
        })}
        <g className="radar-sweep" aria-hidden="true">
          <path
            d={`M${CENTER.x},${CENTER.y} L${CENTER.x},${CENTER.y - RADIUS} A${RADIUS},${RADIUS} 0 0 1 ${CENTER.x + Math.sin(0.55) * RADIUS},${CENTER.y - Math.cos(0.55) * RADIUS} Z`}
            fill="var(--emphasis)"
            fillOpacity={0.16}
          />
          <line x1={CENTER.x} y1={CENTER.y} x2={CENTER.x} y2={CENTER.y - RADIUS} stroke="var(--emphasis)" strokeOpacity={0.6} />
        </g>
        <polygon
          ref={shapeRef}
          points={ringPoints(n, 0)}
          fill="var(--emphasis)"
          fillOpacity={0.15}
          stroke="var(--emphasis)"
          strokeWidth={1.5}
        />
        {axes.map((axis, i) => (
          <circle
            key={axis}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            cx={CENTER.x}
            cy={CENTER.y}
            r={2.5}
            fill="var(--foreground)"
          />
        ))}
      </svg>

      <dl className="mono-label grid grid-cols-3 gap-x-6 gap-y-2 sm:grid-cols-5">
        {axes.map((axis, i) => (
          <div key={axis} className="flex gap-2">
            <dt className="text-muted">{axis.slice(0, 3)}</dt>
            <dd
              ref={(el) => {
                readoutRefs.current[i] = el;
              }}
              className="tabular-nums"
            >
              000
            </dd>
          </div>
        ))}
      </dl>

      <p className="max-w-lg text-sm text-muted">{ability.description}</p>

      <div>
        <p className="mono-label text-muted">{extra.technologiesLabel}</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {technologies.map((tech) => (
            <li key={tech.name} className="mono-label flex items-center gap-2 border border-line px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tech.icon} alt="" width={20} height={20} />
              <span>{tech.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
