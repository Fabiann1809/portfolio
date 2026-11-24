import { HeroStage } from "@/components/hero/HeroStage";
import { StudioBackdrop } from "@/components/hero/StudioBackdrop";
import { GiantName } from "@/components/hero/GiantName";
import { Portrait } from "@/components/hero/Portrait";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { HeroStatus } from "@/components/hero/HeroStatus";

/**
 * First section: a photo-studio scene.
 */
export function Hero() {
  return (
    <section id="hero" className="relative">
      <HeroStage>
        <StudioBackdrop />
        <HeroIntro />
        <GiantName />
        <Portrait />
        <HeroStatus />
      </HeroStage>
    </section>
  );
}
