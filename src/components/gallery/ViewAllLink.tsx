import Link from "next/link";
import { galleryLabels, galleryRoute } from "@/data/gallery";
import { cn } from "@/lib/utils";

export function ViewAllLink({ className }: { className?: string }) {
  return (
    <Link
      href={galleryRoute}
      className={cn("inline-flex items-center gap-2 text-sm tracking-wide underline-offset-4 hover:underline", className)}
    >
      {galleryLabels.viewAll}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
