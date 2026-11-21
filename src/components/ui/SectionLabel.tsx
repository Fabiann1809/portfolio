interface SectionLabelProps {
  children: React.ReactNode;
  /** Right-hand readout (counter, count of records...). */
  trailing?: React.ReactNode;
  className?: string;
}

/** `// LABEL  trailing` line in small spaced monospace; the slashes carry the accent. */
export function SectionLabel({ children, trailing, className = "" }: SectionLabelProps) {
  return (
    <p className={`mono-label flex items-center gap-4 ${className}`}>
      <span aria-hidden="true" className="text-emphasis">{"//"}</span>
      <span>{children}</span>
      {trailing !== undefined && <span className="text-muted">{trailing}</span>}
    </p>
  );
}
