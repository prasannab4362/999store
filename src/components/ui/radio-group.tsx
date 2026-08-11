import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    const radioGroupName = React.useMemo(() => name || `radio-group-${Math.random()}`, [name]);

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, name: radioGroupName }}>
        <div ref={ref} className={cn("grid gap-3", className)} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, checked, onChange, name, value, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const id = React.useId();

    const isChecked = checked ?? (context.value === value);
    const radioName = name ?? context.name;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      context.onValueChange?.(value);
    };

    return (
      <div className="flex items-center space-x-3 group">
        <input
          type="radio"
          id={id}
          ref={ref}
          name={radioName}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          className={cn(
            "appearance-none h-5 w-5 rounded-full border border-border-medium bg-transparent checked:border-[6px] checked:border-brand-primary transition-premium focus-visible:outline-none focus-visible:shadow-focus cursor-pointer group-hover:border-text-secondary checked:group-hover:border-brand-primary",
            className
          )}
          {...props}
        />
        {children && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary cursor-pointer font-ui">
            {children}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";
