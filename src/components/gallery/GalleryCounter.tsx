import { cn } from "@/lib/utils";

interface GalleryCounterProps {
  index: number;
  count: number;
  separator: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "01 / 16". Visual only: screen readers get the live status of the gallery instead. */
export function GalleryCounter({ index, count, separator, className }: GalleryCounterProps) {
  return (
    <p aria-hidden="true" className={cn("font-mono text-sm tracking-[0.25em] tabular-nums", className)}>
      <span className="text-2xl text-foreground">{pad(index + 1)}</span>
      <span className="opacity-50">
        {" "}
        {separator} {pad(count)}
      </span>
    </p>
  );
}
