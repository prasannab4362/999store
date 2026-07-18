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

  // Interlocking Loops Motif: Black, blue (#315CFF), and sand (#D4C3A3) matching the brand logo artwork.
  const ComboLoop = () => (
    <svg
      className={cn("shrink-0 transition-transform group-hover:rotate-12 duration-300", {
        "h-6 w-6": size === "sm",
        "h-8 w-8": size === "md",
        "h-12 w-12": size === "lg",
      })}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Circle: Black/Ink */}
      <circle cx="50" cy="35" r="22" stroke="#111318" strokeWidth="6" strokeLinecap="round" />
      {/* Left Bottom Circle: Electric Blue */}
      <circle cx="36" cy="60" r="22" stroke="#315CFF" strokeWidth="6" strokeLinecap="round" />
      {/* Right Bottom Circle: Sand/Beige */}
      <circle cx="64" cy="60" r="22" stroke="#D4C3A3" strokeWidth="6" strokeLinecap="round" />
      
      {/* Interlocking Link overlap highlights */}
      <path d="M 44 48 A 22 22 0 0 1 56 48" stroke="#111318" strokeWidth="6" strokeLinecap="round" />
      <path d="M 50 48 A 22 22 0 0 1 50 64" stroke="#315CFF" strokeWidth="6" strokeLinecap="round" />
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
          <span className="text-brand-primary transition-transform group-hover:translate-x-0.5 duration-200" style={{
            fontSize: size === "sm" ? "1.25rem" : size === "md" ? "1.875rem" : "3rem"
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
