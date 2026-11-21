"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Three lines that morph into an X when `open`. Decorative: the parent button carries the label. */
export function HamburgerIcon({ open }: { open: boolean }) {
  const reduced = useReducedMotion();
  const line =
    "absolute left-0 h-0.5 w-full rounded-full bg-current " +
    (reduced ? "" : "transition-[transform,opacity] duration-250 ease-out");

  return (
    <span aria-hidden="true" className="relative block h-4 w-6">
      <span className={`${line} top-0 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
      <span className={`${line} top-[7px] ${open ? "opacity-0" : ""}`} />
      <span className={`${line} top-[14px] ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
    </span>
  );
}
