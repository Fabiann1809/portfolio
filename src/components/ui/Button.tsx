import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded border border-current px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50";

const solid = "border-foreground bg-foreground text-background";

type Variant = "outline" | "solid";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };
type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant };

export function Button({ className, variant = "outline", ...props }: ButtonProps) {
  return <button className={cn(base, variant === "solid" && solid, className)} {...props} />;
}

export function LinkButton({ className, variant = "outline", ...props }: LinkButtonProps) {
  return <a className={cn(base, variant === "solid" && solid, className)} {...props} />;
}
