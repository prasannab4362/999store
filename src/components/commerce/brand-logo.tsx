import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface BrandLogoProps {
  className?: string;
  variant?: "horizontal" | "stacked" | "icon";
  background?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({
  className,
  variant = "horizontal",
  background = "light",
  size = "md",
}: BrandLogoProps) {
  const isDark = background === "dark";

  // Sleek, high-precision 999 Store Emblem Badge
  const ComboLogoBadge = () => (
    <svg
      className={cn("shrink-0 transition-transform group-hover:scale-105 duration-300", {
        "h-7 w-7": size === "sm",
        "h-9 w-9": size === "md",
        "h-12 w-12": size === "lg",
      })}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1D1D1F" />
          <stop offset="1" stopColor="#0B0B0C" />
        </linearGradient>
        <linearGradient id="goldAccGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3E5AB" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#AA7C11" />
        </linearGradient>
      </defs>

      {/* Rounded Container Badge */}
      <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#logoBgGrad)" stroke="url(#goldAccGrad)" strokeWidth="4" />

      {/* Shopping Bag Handles Motif */}
      <path d="M 44 42 C 44 26, 76 26, 76 42" stroke="url(#goldAccGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Center 999 Vector Monogram Loop */}
      <circle cx="42" cy="68" r="14" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M 56 68 V 86" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

      <circle cx="68" cy="68" r="14" stroke="url(#goldAccGrad)" strokeWidth="6" />
      <path d="M 82 68 V 86" stroke="url(#goldAccGrad)" strokeWidth="6" strokeLinecap="round" />

      <circle cx="94" cy="68" r="14" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M 108 68 V 86" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

      {/* Sparkle Star accent */}
      <path d="M 60 48 L 62 54 L 68 56 L 62 58 L 60 64 L 58 58 L 52 56 L 58 54 Z" fill="url(#goldAccGrad)" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={cn(
          "group inline-flex items-center justify-center active:scale-95 duration-150",
          className
        )}
      >
        <ComboLogoBadge />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 active:scale-98 duration-150 leading-none select-none",
        variant === "stacked" ? "flex-col text-center" : "flex-row",
        className
      )}
    >
      <ComboLogoBadge />
      <div className={cn("flex flex-col justify-center", variant === "stacked" ? "items-center" : "items-start")}>
        {/* Brand Name "999" */}
        <div className="flex items-baseline font-heading font-black tracking-tight">
          <span className={cn(isDark ? "text-white" : "text-[#1D1D1F]", {
            "text-lg": size === "sm",
            "text-2xl": size === "md",
            "text-4xl": size === "lg",
          })}>
            999
          </span>
          <span className="text-[#D4AF37] ml-1 font-bold text-[10px] tracking-wider uppercase">
            STORE
          </span>
        </div>
        
        {/* Sub-label */}
        <span
          className={cn(
            "font-heading font-bold uppercase tracking-[0.18em] leading-none",
            isDark ? "text-amber-400/90" : "text-[#D4AF37]",
            {
              "text-[8px] mt-0.5": size === "sm",
              "text-[9px] mt-1": size === "md",
              "text-[11px] mt-1": size === "lg",
            }
          )}
        >
          COMBO STORE
        </span>
      </div>
    </Link>
  );
}

