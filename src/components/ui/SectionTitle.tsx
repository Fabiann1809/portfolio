import { ScrollReveal } from "./ScrollReveal";

interface SectionTitleProps {
  children: React.ReactNode;
  /** Small "(NN)" readout above the title (counter, count of records...). */
  trailing?: string;
  className?: string;
}

/** Section heading in the condensed display face, with an optional small accent readout above it. */
export function SectionTitle({ children, trailing, className = "" }: SectionTitleProps) {
  return (
    <ScrollReveal className={className}>
      {trailing !== undefined && <p className="mb-2 font-sans text-sm font-medium text-emphasis tabular-nums">({trailing})</p>}
      <h2 className="giant-title text-[clamp(30px,4vw,56px)]">{children}</h2>
    </ScrollReveal>
  );
}
