import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    const radioGroupName = React.useMemo(() => name || `radio-group-${Math.random()}`, [name]);

    return (
      <div ref={ref} className={cn("grid gap-2", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              // @ts-ignore
              checked: child.props.value === value,
              // @ts-ignore
              onChange: () => onValueChange?.(child.props.value),
              name: radioGroupName,
            });
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, checked, onChange, name, value, children, ...props }, ref) => {
    const id = React.useId();
    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={id}
          ref={ref}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className={cn(
            "h-4 w-4 border border-border-medium text-brand-primary focus:ring-brand-primary accent-brand-primary cursor-pointer",
            className
          )}
          {...props}
        />
        {children && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary cursor-pointer font-body">
            {children}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";
