import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";
import { HeroStatus } from "./HeroStatus";

/** Right block: justified uppercase dot-matrix description (4 lines) and the status lines. */
export function HeroAside() {
  return (
    <div data-side="right" className="hero-side contents lg:block">
      <Reveal delay={500} className="order-4 px-[var(--edge-x)] pt-6 lg:p-0">
        <p className="hero-description">{hero.description}</p>
        <HeroStatus />
      </Reveal>
    </div>
  );
}
