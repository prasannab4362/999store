import Link from "next/link";
import Image from "next/image";
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

  // Iconic 999 Store Nano Brand Emblem
  const ComboLogoBadge = () => (
    <div
      className={cn("relative shrink-0 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 border border-[#D4AF37]/30", {
        "h-7 w-7": size === "sm",
        "h-9 w-9": size === "md",
        "h-12 w-12": size === "lg",
      })}
    >
      <Image
        src="/brand/999-store-logo.png"
        alt="999 Store Iconic Emblem"
        fill
        sizes="48px"
        className="object-cover"
        priority
      />
    </div>
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

