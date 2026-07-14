import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "accent" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-heading transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
        {
          "border-transparent bg-brand-primary text-brand-primary-foreground shadow": variant === "default",
          "border-transparent bg-brand-accent text-white shadow": variant === "accent",
          "border-transparent bg-bg-secondary text-text-primary": variant === "secondary",
          "border-transparent bg-red-600 text-white shadow": variant === "destructive",
          "border-transparent bg-emerald-100 text-emerald-800": variant === "success",
          "border-transparent bg-amber-100 text-amber-800": variant === "warning",
          "border-border-light text-text-secondary": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
