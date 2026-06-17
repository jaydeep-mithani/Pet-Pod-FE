"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useMotionVibe } from "@/lib/motion";
import { FIELD_CHROME } from "./Input";
import { cn } from "@/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  /** Show "x / maxLength" counter beside the label. Requires `maxLength`. */
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      hint,
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
    const reactId = useId();
    const inputId = id ?? reactId;

    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const [length, setLength] = useState(0);

    useEffect(() => {
      if (innerRef.current) setLength(innerRef.current.value.length);
    }, []);

    const setRef = useCallback(
      (el: HTMLTextAreaElement | null) => {
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref)
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            el;
      },
      [ref],
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                  length >= (maxLength ?? 0)
                    ? "text-pink-600"
                    : "text-gray-400",
                )}
              >
                {length} / {maxLength}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            "rounded-xl border-2 bg-white px-3 py-2 transition-all",
            FIELD_CHROME[vibe].focus,
            error
              ? "border-red-400"
              : cn("border-gray-200", FIELD_CHROME[vibe].hover),
          )}
        >
          <textarea
            ref={setRef}
            id={inputId}
            required={required}
            maxLength={maxLength}
            onChange={handleChange}
            className={cn(
              "block w-full resize-y bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none",
              className,
            )}
            {...rest}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-gray-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);

export default Textarea;
