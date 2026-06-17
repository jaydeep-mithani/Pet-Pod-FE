"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
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

// hover:bg-gray-50 / ring-pink-200 / red-* rings aren't fully remapped by the
// global theme layers, so the variant chrome branches per vibe — most
// important for bold, where light hover fills would flash on the dark stage
// and pale rings would vanish. focusRing keeps the focus ring on-vibe too.
const VARIANT_CHROME: Record<MotionVibe, Record<Variant, string>> = {
  playful: {
    default:
      "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:ring-gray-300",
    primary:
      "bg-white text-pink-600 ring-1 ring-pink-200 hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-300",
    danger:
      "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50 hover:text-red-700 hover:ring-red-300",
  },
  calm: {
    default:
      "bg-white text-gray-700 ring-1 ring-stone-200 hover:bg-stone-50 hover:text-gray-900 hover:ring-stone-300",
    primary:
      "bg-white text-teal-700 ring-1 ring-teal-200 hover:bg-teal-50 hover:text-teal-800 hover:ring-teal-300",
    danger:
      "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50 hover:text-red-700 hover:ring-red-300",
  },
  bold: {
    default:
      "bg-white/5 text-gray-200 ring-1 ring-white/15 hover:bg-white/10 hover:text-white hover:ring-white/30",
    primary:
      "bg-white/5 text-fuchsia-300 ring-1 ring-fuchsia-500/40 hover:bg-fuchsia-500/10 hover:text-fuchsia-200 hover:ring-fuchsia-500/70",
    danger:
      "bg-white/5 text-red-400 ring-1 ring-red-500/40 hover:bg-red-500/10 hover:text-red-300 hover:ring-red-500/70",
  },
};

const FOCUS_RING: Record<MotionVibe, string> = {
  playful: "focus:ring-pink-500 focus:ring-offset-2",
  calm: "focus:ring-teal-700 focus:ring-offset-2",
  bold: "focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-[#0a0a12]",
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
    const { vibe } = useMotionVibe();
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
          "focus:outline-none focus:ring-2",
          FOCUS_RING[vibe],
          styles.box,
          styles.pad,
          VARIANT_CHROME[vibe][variant],
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
