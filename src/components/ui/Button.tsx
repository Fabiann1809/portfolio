import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded border border-current px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({ className, ...props }: ButtonProps) {
  return <button className={cn(base, className)} {...props} />;
}

export function LinkButton({ className, ...props }: LinkButtonProps) {
  return <a className={cn(base, className)} {...props} />;
}
