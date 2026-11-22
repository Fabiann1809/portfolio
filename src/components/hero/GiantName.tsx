import { heroShared } from "@/data/hero";
import { Reveal } from "@/components/loader/Reveal";

/** Giant heavy-grotesk name behind the portrait. */
export function GiantName() {
  return (
    <Reveal
      rise="lg"
      delay={140}
      className="relative z-0 px-2 pt-10 xl:absolute xl:inset-x-0 xl:bottom-[57%] xl:pt-0"
    >
      <h1
        className="block text-center text-[clamp(4.5rem,27vw,34rem)] xl:text-[clamp(4.5rem,min(24vw,32svh),34rem)] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-foreground uppercase select-none"
        style={{
          textShadow: "0px 8px 12px var(--shadow-color)",
          transform:
            "perspective(1200px) translate3d(calc(var(--px, 0) * -40px), calc(var(--py, 0) * -24px), 0) rotateX(calc(var(--py, 0) * -16deg)) rotateY(calc(var(--px, 0) * 22deg))",
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {heroShared.displayName}
      </h1>
    </Reveal>
  );
}
