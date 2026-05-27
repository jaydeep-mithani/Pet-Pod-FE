"use client";

import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    error,
    hint,
    options,
    placeholder,
    className,
    containerClassName,
    required,
    id,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-800"
        >
          {label}
          {required && <span className="ml-1 text-pink-500">*</span>}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center rounded-xl border-2 bg-white transition-all",
          "focus-within:border-transparent focus-within:ring-2 focus-within:ring-pink-500",
          error ? "border-red-400" : "border-gray-200 hover:border-pink-200",
          rest.disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <select
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            "w-full appearance-none bg-transparent py-2.5 pl-3 pr-9 text-sm text-gray-900 focus:outline-none",
            className,
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 h-4 w-4 text-gray-400"
          aria-hidden
        />
      </div>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
