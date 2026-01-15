import Link from "next/link";
import * as React from "react";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles: Record<string, string> = {
    primary:
      "bg-[color:var(--pc-green)] text-white hover:opacity-95 focus:ring-[color:var(--pc-green)]",
    secondary:
      "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className ?? ""}`}>
      {children}
    </Link>
  );
}