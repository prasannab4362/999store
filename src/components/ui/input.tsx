import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[var(--radius-control)] border border-border-medium bg-transparent px-4 py-2 text-sm text-text-primary tracking-[-0.011em] font-ui transition-premium file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-text-muted focus-visible:outline-none focus-visible:border-transparent focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 hover:border-text-secondary antialiased",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
