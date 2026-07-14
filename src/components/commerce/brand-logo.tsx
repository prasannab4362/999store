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

  // Combo Loop Motif: Three interlocking loops representing MIX, MATCH, COMBO
  const ComboLoop = () => (
    <svg
      className={cn("shrink-0 transition-transform group-hover:rotate-12 duration-300", {
        "h-6 w-8": size === "sm",
        "h-8 w-11": size === "md",
        "h-12 w-16": size === "lg",
      })}
      viewBox="0 0 80 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Loop 1: Mix */}
      <circle cx="28" cy="25" r="18" stroke="#6D28D9" strokeWidth="4.5" strokeOpacity="0.85" />
      {/* Loop 2: Match */}
      <circle cx="52" cy="25" r="18" stroke="#FF5A5F" strokeWidth="4.5" strokeOpacity="0.85" />
      {/* Interlocking Link Highlight */}
      <path
        d="M40 13C42 16 43 20 43 25C43 30 42 34 40 37"
        stroke="#4C1D95"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={cn(
          "group inline-flex items-center justify-center active:scale-95 duration-100",
          className
        )}
      >
        <ComboLoop />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 active:scale-98 duration-100 leading-none select-none",
        variant === "stacked" ? "flex-col text-center" : "flex-row",
        className
      )}
    >
      <ComboLoop />
      <div className={cn("flex flex-col", variant === "stacked" ? "items-center" : "items-start")}>
        {/* Brand Name "999" with custom offset styling */}
        <div className="flex items-baseline font-heading font-extrabold tracking-tighter">
          <span className={cn(isDark ? "text-white" : "text-text-primary", {
            "text-xl": size === "sm",
            "text-3xl": size === "md",
            "text-5xl": size === "lg",
          })}>
            99
          </span>
          <span className="text-brand-primary transition-transform group-hover:translate-x-1 duration-200" style={{
            fontSize: size === "sm" ? "1.45rem" : size === "md" ? "2.15rem" : "3.45rem",
            marginLeft: "-1px"
          }}>
            9
          </span>
        </div>
        
        {/* Sub-label */}
        <span
          className={cn(
            "font-heading font-bold uppercase tracking-widest",
            isDark ? "text-gray-300" : "text-text-secondary",
            {
              "text-[8px] mt-0.5": size === "sm",
              "text-[10px] mt-1": size === "md",
              "text-[13px] mt-1.5": size === "lg",
            }
          )}
        >
          Combo Store
        </span>
      </div>
    </Link>
  );
}
