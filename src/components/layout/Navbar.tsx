"use client";

import { useState } from "react";
import { navigation } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollTo } from "@/hooks/useScrollTo";
import { Reveal } from "@/components/loader/Reveal";
import { MobileMenu } from "./MobileMenu";

const ids = navigation.map((item) => item.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection(ids);
  const scrollTo = useScrollTo();

  function handleAnchor(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    scrollTo(id);
    history.replaceState(null, "", "#" + id);
  }

  return (
    <Reveal as="header" className="bg-background/90 fixed inset-x-0 top-0 z-50 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="#hero" onClick={(e) => handleAnchor(e, "hero")} className="font-bold">Portfolio</a>
        <nav className="hidden md:block">
          <ul className="flex gap-6">
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={"#" + item.id}
                  onClick={(e) => handleAnchor(e, item.id)}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className={activeId === item.id ? "text-primary" : ""}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <MobileMenu
        open={open}
        activeId={activeId}
        onNavigate={(id, event) => {
          handleAnchor(event, id);
          setOpen(false);
        }}
      />
    </Reveal>
  );
}
