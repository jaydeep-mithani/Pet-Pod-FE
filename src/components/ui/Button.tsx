"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionVibe } from "@/lib/motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "floating";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const MAGNETIC_RANGE = 16;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
  iconPosition = "left",
}) => {
  const { tokens, vibe } = useMotionVibe();
  const ref = useRef<HTMLButtonElement | null>(null);

  // Magnetic pull (bold vibe, lg/xl sizes only): the button drifts a few px
  // toward the cursor while hovered, springing back on leave.
  const magneticEnabled =
    tokens.magnetic && (size === "lg" || size === "xl") && !disabled;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Soft, wobbly springs so the pull feels elastic rather than mechanical.
  const magneticX = useSpring(mx, { stiffness: 200, damping: 14 });
  const magneticY = useSpring(my, { stiffness: 200, damping: 14 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!magneticEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    mx.set(Math.max(-MAGNETIC_RANGE, Math.min(MAGNETIC_RANGE, relX * 0.38)));
    my.set(Math.max(-MAGNETIC_RANGE, Math.min(MAGNETIC_RANGE, relY * 0.38)));
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Shape is part of each vibe's identity: playful = pill, calm = quiet
  // rectangle, bold = sharp skewed parallelogram (content counter-skewed).
  const shapeClasses =
    vibe === "bold"
      ? "rounded-[3px] -skew-x-6"
      : vibe === "calm"
        ? "rounded-lg"
        : "rounded-full";

  const baseClasses = `font-semibold ${shapeClasses} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2`;

  // Calm trades gradients and glow for flat, deep teal — quiet confidence.
  const variantClasses =
    vibe === "calm"
      ? {
          primary:
            "bg-teal-800 hover:bg-teal-900 text-white focus:ring-teal-700 shadow-sm",
          secondary:
            "bg-stone-700 hover:bg-stone-800 text-white focus:ring-stone-500 shadow-sm",
          outline:
            "border border-teal-800 text-teal-900 hover:bg-teal-800 hover:text-white focus:ring-teal-700 bg-transparent",
          ghost:
            "text-teal-900 hover:bg-teal-800/10 focus:ring-teal-700 bg-transparent",
          floating:
            "bg-white/15 backdrop-blur-sm border border-white/25 text-white hover:bg-white/25 focus:ring-white/50",
        }
      : {
          primary:
            "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right text-white focus:ring-pink-500 shadow-lg hover:shadow-[0_8px_32px_-8px_rgba(236,72,153,0.45)]",
          secondary:
            "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl",
          outline:
            "border-2 border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white focus:ring-pink-500 bg-transparent hover:shadow-lg",
          ghost:
            "text-pink-600 hover:bg-pink-50 focus:ring-pink-500 bg-transparent hover:shadow-md",
          floating:
            "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 focus:ring-white/50 shadow-lg hover:shadow-xl",
        };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const renderContent = () => {
    const content = !icon ? (
      children
    ) : iconPosition === "left" ? (
      <>
        {icon}
        {children}
      </>
    ) : (
      <>
        {children}
        {icon}
      </>
    );
    // Counter-skew the label so bold's parallelogram shape doesn't slant
    // the text itself.
    return (
      <span
        className={
          vibe === "bold"
            ? "inline-flex skew-x-6 items-center gap-2"
            : "inline-flex items-center gap-2"
        }
      >
        {content}
      </span>
    );
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      onPointerMove={magneticEnabled ? handlePointerMove : undefined}
      onPointerLeave={magneticEnabled ? handlePointerLeave : undefined}
      style={magneticEnabled ? { x: magneticX, y: magneticY } : undefined}
      whileHover={
        disabled
          ? undefined
          : { scale: tokens.hover.scale === 1 ? 1.01 : tokens.hover.scale }
      }
      whileTap={disabled ? undefined : { scale: tokens.press.scale }}
      transition={tokens.interactive}
    >
      {renderContent()}
    </motion.button>
  );
};

export default Button;
