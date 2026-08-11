import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-[var(--radius-control)] border border-border-medium bg-transparent px-4 py-3 text-sm text-text-primary transition-premium placeholder:text-text-muted focus-visible:outline-none focus-visible:border-transparent focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 font-body hover:border-text-secondary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
