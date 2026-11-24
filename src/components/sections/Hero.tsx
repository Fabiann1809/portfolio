import { HeroStage } from "@/components/hero/HeroStage";
import { StudioBackdrop } from "@/components/hero/StudioBackdrop";
import { GiantName } from "@/components/hero/GiantName";
import { Portrait } from "@/components/hero/Portrait";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { HeroStatus } from "@/components/hero/HeroStatus";
import { HeroExit } from "@/components/hero/HeroExit";

/**
 * First section: a photo-studio scene.
 */
export function Hero() {
  return (
    <section id="hero" className="relative">
      <HeroExit>
      <HeroStage>
        <StudioBackdrop />
        <HeroIntro />
        <GiantName />
        <Portrait />
        <HeroStatus />
      </HeroStage>
      </HeroExit>
    </section>
  );
}
