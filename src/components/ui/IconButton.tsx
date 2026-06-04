"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils";

type Variant = "default" | "primary" | "danger";

interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  icon: LucideIcon;
  label: string;
  variant?: Variant;
  size?: "sm" | "md";
}

const variantStyles: Record<Variant, string> = {
  default:
    "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:ring-gray-300",
  primary:
    "bg-white text-pink-600 ring-1 ring-pink-200 hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-300",
  danger:
    "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50 hover:text-red-700 hover:ring-red-300",
};

const sizeStyles = {
  sm: {
    box: "h-8",
    icon: "h-4 w-4",
    text: "text-xs",
    pad: "px-2 group-hover:pr-3",
  },
  md: {
    box: "h-10",
    icon: "h-4 w-4",
    text: "text-sm",
    pad: "px-2.5 group-hover:pr-3.5",
  },
} as const;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon: Icon,
      label,
      variant = "default",
      size = "md",
      className,
      type = "button",
      disabled,
      ...rest
    },
    ref,
  ) {
    const styles = sizeStyles[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "group inline-flex shrink-0 items-center gap-0 overflow-hidden rounded-full shadow-sm transition-all duration-200 ease-out",
          "hover:gap-1.5",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
          styles.box,
          styles.pad,
          variantStyles[variant],
          className,
        )}
        {...rest}
      >
        <Icon className={cn("shrink-0", styles.icon)} aria-hidden />
        <span
          className={cn(
            "max-w-0 overflow-hidden whitespace-nowrap font-medium transition-all duration-200 ease-out group-hover:max-w-[12rem]",
            styles.text,
          )}
        >
          {label}
        </span>
      </button>
    );
  },
);

export default IconButton;
