"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { menuLabels, navigation } from "@/data/navigation";
import { useLenisInstance } from "@/components/layout/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BackdropPicker } from "@/components/theme/BackdropPicker";

interface MobileMenuProps {
  open: boolean;
  activeId: string;
  /** Prepended to each section href (e.g. "/" on pages other than home). */
  hrefPrefix?: string;
  onNavigate: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  onClose: () => void;
}

/**
 * Full-screen menu panel. Rendered in a portal because the navbar has transform/backdrop-filter,
 * which would make `fixed` relative to the header instead of the viewport.
 */
export function MobileMenu({ open, activeId, hrefPrefix = "", onNavigate, onClose }: MobileMenuProps) {
  const lenis = useLenisInstance();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);

  // Scroll lock + Escape + focus into the menu while open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    // Leaving the mobile layout (rotate / resize) closes the menu.
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (mq.matches) onClose();
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);

    return () => {
      root.style.overflow = prevOverflow;
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, lenis, onClose]);

  if (!open) return null;
  return createPortal(
    <nav
      ref={panelRef}
      id="mobile-menu"
      aria-label={menuLabels.panel}
      data-menu
      data-reduced={reduced}
      className="fixed inset-0 z-40 overflow-y-auto bg-background px-6 pt-24 pb-10 text-foreground md:hidden"
    >
      <ul className="flex min-h-full flex-col justify-center gap-2">
        {navigation.map((item, index) => (
          <li key={item.id}>
            <a
              href={hrefPrefix + "#" + item.id}
              onClick={(event) => onNavigate(item.id, event)}
              aria-current={activeId === item.id ? "true" : undefined}
              data-menu-link
              style={{ "--i": index } as React.CSSProperties}
              className={
                "block py-3 font-display text-4xl font-extrabold tracking-[0.06em] uppercase " +
                (activeId === item.id ? "text-emphasis" : "")
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <BackdropPicker variant="full" className="mt-6" />
    </nav>,
    document.body,
  );
}
