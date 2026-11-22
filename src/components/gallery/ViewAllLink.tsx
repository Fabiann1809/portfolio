"use client";

import Link from "next/link";
import { galleryLabels, galleryRoute } from "@/data/gallery";
import { useLocale, useLocalized } from "@/components/locale/LocaleProvider";
import { localizePath } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function ViewAllLink({ className }: { className?: string }) {
  const locale = useLocale();
  const labels = useLocalized(galleryLabels);
  return (
    <Link
      href={localizePath(locale, galleryRoute)}
      className={cn("inline-flex items-center gap-2 label text-sm underline-offset-4 hover:underline", className)}
    >
      {labels.viewAll}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
