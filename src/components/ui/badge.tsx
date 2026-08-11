import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "accent" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] uppercase tracking-[0.08em] font-semibold font-ui transition-premium focus:outline-none focus:shadow-focus antialiased",
        {
          "border-transparent bg-brand-primary text-brand-primary-foreground": variant === "default",
          "border-transparent bg-brand-accent text-white": variant === "accent",
          "border-transparent bg-bg-secondary text-text-primary": variant === "secondary",
          "border-transparent bg-red-600 text-white": variant === "destructive",
          "border-transparent bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20": variant === "success",
          "border-transparent bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20": variant === "warning",
          "border-border-medium text-text-secondary bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
