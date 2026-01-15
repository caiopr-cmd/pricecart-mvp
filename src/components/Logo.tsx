import * as React from "react";

type LogoProps = {
  variant?: "full" | "mark";
  className?: string;
  markClassName?: string;
  wordClassName?: string;
};

export function Logo({
  variant = "full",
  className,
  markClassName,
  wordClassName,
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className={markClassName} />
      {variant === "full" && (
        <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${wordClassName ?? ""}`}>
          <span className="text-slate-800">Price</span>
          <span className="text-[color:var(--pc-blue)]">Cart</span>
        </span>
      )}
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  // Friendly “Tag-P” with a subtle Canadian hint (tiny leaf inside the hole).
  return (
    <svg viewBox="0 0 64 64" aria-label="PriceCart" role="img" className={`h-10 w-10 ${className ?? ""}`}>
      <rect
        x="14"
        y="6"
        width="36"
        height="52"
        rx="11"
        transform="rotate(-22 32 32)"
        fill="var(--pc-green)"
      />
      <circle cx="41.5" cy="14.5" r="5.2" fill="#ffffff" opacity="0.98" />
      <path
        d="M41.5 12.0
           C42.2 13.0 43.7 13.4 44.6 14.2
           C43.6 14.4 42.9 15.1 42.6 16.1
           C42.1 15.4 41.6 15.2 41.0 15.9
           C41.0 14.9 40.4 14.4 39.4 14.2
           C40.4 13.4 40.9 12.8 41.5 12.0 Z"
        fill="var(--pc-green)"
        opacity="0.95"
      />
      <g transform="rotate(-22 32 32)">
        <rect x="26.2" y="22" width="9.8" height="26" rx="4.9" fill="#ffffff" />
        <rect x="26.2" y="18" width="22" height="20" rx="10" fill="#ffffff" />
        <rect x="34.3" y="24.2" width="9.6" height="9.6" rx="4.8" fill="var(--pc-green)" />
      </g>
    </svg>
  );
}