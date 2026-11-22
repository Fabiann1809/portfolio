"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { menuLabels, navigation } from "@/data/navigation";
import { useLocalized } from "@/components/locale/LocaleProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LocaleToggle } from "./LocaleToggle";
import { NavMascot } from "./NavMascot";

interface PillNavProps {
  activeId: string;
  hrefPrefix: string;
  onAnchor: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

interface Box {
  left: number;
  width: number;
}

/** Section links in a floating pill; a filled accent pill slides to the active one, a mascot rides on top. */
export function PillNav({ activeId, hrefPrefix, onAnchor }: PillNavProps) {
  const reduced = useReducedMotion();
  const items = useLocalized(navigation);
  const labels = useLocalized(menuLabels);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [box, setBox] = useState<Box | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[activeId];
      setBox(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [activeId]);

  // Enable the slide only after the first measurement so the pill does not fly in from 0.
  useLayoutEffect(() => {
    if (box && !ready) {
      const id = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(id);
    }
  }, [box, ready]);

  const move = ready && !reduced ? "transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]" : "";
  const style = (extra?: number): React.CSSProperties => ({
    width: box?.width ?? 0,
    transform: `translateX(${(box?.left ?? 0) + (extra ?? 0)}px)`,
    opacity: box ? 1 : 0,
  });

  return (
    <nav aria-label={labels.sections} className="relative rounded-full border border-line bg-surface/70 p-1 backdrop-blur-md">
      <ul ref={listRef} className="relative flex items-center">
        <span aria-hidden="true" className={`absolute top-0 bottom-0 left-0 rounded-full bg-emphasis ${move}`} style={style()} />
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
              className="relative"
            >
              <a
                href={hrefPrefix + "#" + item.id}
                onClick={(event) => onAnchor(event, item.id)}
                aria-current={active ? "true" : undefined}
                className={
                  "label block rounded-full px-3 py-1.5 text-[11px] whitespace-nowrap transition-colors duration-300 2xl:px-4 2xl:text-xs " +
                  (active ? "text-background" : "text-foreground/80 hover:text-emphasis")
                }
              >
                {item.label}
              </a>
            </li>
          );
        })}
        <li className="relative ml-1 flex items-center border-l border-line pl-1">
          <LocaleToggle variant="pill" />
        </li>
      </ul>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-[19px] left-1 flex justify-center ${move}`}
        style={style()}
      >
        <span key={activeId} className="nav-mascot block">
          <NavMascot />
        </span>
      </span>
    </nav>
  );
}
