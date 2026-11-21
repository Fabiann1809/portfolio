import { hero } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";

/** Giant heavy-grotesk name behind the portrait; its shadow follows the studio light. */
export function GiantName() {
  return (
    <Reveal
      rise="lg"
      delay={140}
      className="relative z-0 px-2 pt-24 md:absolute md:inset-x-0 md:bottom-[28%] md:pt-0"
    >
      <h1
        className="block text-center text-[clamp(4.5rem,27vw,34rem)] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-foreground uppercase select-none"
        style={{ textShadow: "var(--n-sx, 0px) var(--n-sy, 8px) var(--n-blur, 12px) var(--shadow-color)" }}
      >
        {hero.displayName}
      </h1>
    </Reveal>
  );
}
