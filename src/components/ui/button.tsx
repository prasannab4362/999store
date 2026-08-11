import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full font-ui text-[17px] font-semibold tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-[2px] hover:scale-[1.02] hover:shadow-md cursor-pointer antialiased",
          {
            "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover shadow-sm": variant === "default",
            "bg-brand-accent text-brand-primary-foreground hover:bg-brand-accent-hover shadow-sm": variant === "accent",
            "bg-red-600 text-white hover:bg-red-700 shadow-sm": variant === "destructive",
            "border border-border-medium bg-transparent hover:bg-bg-secondary hover:text-text-primary text-text-primary shadow-sm": variant === "outline",
            "bg-bg-secondary text-text-primary hover:bg-border-light": variant === "secondary",
            "hover:bg-bg-secondary hover:text-text-primary text-text-secondary": variant === "ghost",
            "text-brand-primary underline-offset-4 hover:underline bg-transparent p-0 hover:-translate-y-0 hover:scale-100 hover:shadow-none": variant === "link",
          },
          {
            "h-11 px-5 py-2.5": size === "default",
            "h-9 px-4 text-[14px]": size === "sm",
            "h-14 px-10 text-[19px]": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
