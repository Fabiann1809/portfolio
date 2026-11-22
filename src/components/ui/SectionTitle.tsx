import { ScrollReveal } from "./ScrollReveal";

interface SectionTitleProps {
  children: React.ReactNode;
  /** Small "(NN)" readout above the title (counter, count of records...). */
  trailing?: string;
  className?: string;
}

/** Large section heading with an optional small accent readout above it, so each section change is obvious. */
export function SectionTitle({ children, trailing, className = "" }: SectionTitleProps) {
  return (
    <ScrollReveal className={`font-sans ${className}`}>
      {trailing !== undefined && <p className="mb-2 text-sm font-medium text-emphasis tabular-nums">({trailing})</p>}
      <h2 className="text-[clamp(44px,7vw,104px)] leading-[0.95] font-bold tracking-tight">
        {children}
        <span className="text-emphasis">.</span>
      </h2>
    </ScrollReveal>
  );
}
