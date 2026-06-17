"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { LucideIcon } from "lucide-react";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

/**
 * Per-vibe focus/hover chrome for field wrappers. The globals.css theme
 * layers only remap `focus:`-variant utilities, not `focus-within:`, so the
 * wrapper-based field primitives (Input/Select/Textarea) branch here instead.
 * Complete static class strings so Tailwind can see them.
 */
export const FIELD_CHROME: Record<
  MotionVibe,
  { focus: string; hover: string }
> = {
  playful: {
    focus:
      "focus-within:border-transparent focus-within:ring-2 focus-within:ring-pink-500",
    hover: "hover:border-pink-200",
  },
  calm: {
    focus:
      "focus-within:border-transparent focus-within:ring-2 focus-within:ring-teal-700",
    hover: "hover:border-teal-200",
  },
  bold: {
    focus:
      "focus-within:border-transparent focus-within:ring-2 focus-within:ring-fuchsia-500",
    hover: "hover:border-fuchsia-500/40",
  },
};

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  rightSlot?: React.ReactNode;
  containerClassName?: string;
  /** Show "x / maxLength" counter beside the label. Requires `maxLength` to be set. */
  showCount?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    rightSlot,
    className,
    containerClassName,
    required,
    showCount,
    maxLength,
    onChange,
    id,
    ...rest
  },
  ref,
) {
  const { vibe } = useMotionVibe();
  const reactId = (rest as { id?: string }).id ?? undefined;
  const generatedId = useFallbackId(id ?? reactId);
  const inputId = id ?? generatedId;

  const innerRef = useRef<HTMLInputElement | null>(null);
  const [length, setLength] = useState(0);

  // Sync initial length after mount (covers RHF defaultValues populating via ref).
  useEffect(() => {
    if (innerRef.current) setLength(innerRef.current.value.length);
  }, []);

  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    },
    [ref],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showCount && maxLength) setLength(e.target.value.length);
    onChange?.(e);
  };

  const showCounter = showCount && typeof maxLength === "number";

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {(label || showCounter) && (
        <div className="flex items-baseline justify-between gap-2">
          {label ? (
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-800"
            >
              {label}
              {required && <span className="ml-1 text-pink-500">*</span>}
            </label>
          ) : (
            <span />
          )}
          {showCounter && (
            <span
              className={cn(
                "text-xs tabular-nums",
                length >= (maxLength ?? 0) ? "text-pink-600" : "text-gray-400",
              )}
            >
              {length} / {maxLength}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border-2 bg-white px-3 transition-all",
          FIELD_CHROME[vibe].focus,
          error
            ? "border-red-400"
            : cn("border-gray-200", FIELD_CHROME[vibe].hover),
          rest.disabled && "cursor-not-allowed opacity-60",
        )}
      >
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        )}
        <input
          ref={setRef}
          id={inputId}
          required={required}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            "w-full bg-transparent py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none",
            className,
          )}
          {...rest}
        />
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
});

function useFallbackId(provided?: string) {
  const generated = useId();
  return provided ?? generated;
}

export default Input;
