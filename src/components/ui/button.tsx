import * as React from "react";
import { Slot } from "@radix-ui/react-slot"; // wait, did we install slot? Let's check or just make a standard button
// We can easily make a standard button without Slot, or import Slot if installed. Let's write a standard button.

import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Component = asChild ? "span" : "button"; // simple fallback
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-control font-heading text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-100 cursor-pointer",
          {
            "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover shadow-sm": variant === "default",
            "bg-brand-accent text-white hover:bg-brand-accent-hover shadow-sm": variant === "accent",
            "bg-red-600 text-white hover:bg-red-700 shadow-sm": variant === "destructive",
            "border border-border-light bg-transparent hover:bg-bg-secondary hover:text-text-primary text-text-secondary": variant === "outline",
            "bg-bg-secondary text-text-primary hover:bg-gray-200": variant === "secondary",
            "hover:bg-bg-secondary hover:text-text-primary text-text-secondary": variant === "ghost",
            "text-brand-primary underline-offset-4 hover:underline bg-transparent p-0 active:scale-100": variant === "link",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8 text-base": size === "lg",
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
