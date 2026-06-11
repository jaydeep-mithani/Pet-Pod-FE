"use client";

import { Feather, PawPrint, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  MOTION_VIBES,
  VIBE_LABEL,
  useMotionVibe,
  type MotionVibe,
} from "@/lib/motion";
import { cn } from "@/utils";

const VIBE_ICON: Record<
  MotionVibe,
  React.ComponentType<{ className?: string }>
> = {
  playful: PawPrint,
  calm: Feather,
  bold: Zap,
};

interface MotionVibeToggleProps {
  /** "compact" = icons only (navbar); "full" = icons + labels (menus). */
  variant?: "compact" | "full";
  /** Match the navbar's dark-on-scroll styling. */
  appearance?: "light" | "dark";
  className?: string;
}

const MotionVibeToggle: React.FC<MotionVibeToggleProps> = ({
  variant = "compact",
  appearance = "light",
  className,
}) => {
  const { vibe, setVibe, reduced, hydrated } = useMotionVibe();

  // Under prefers-reduced-motion the vibes all behave identically, so the
  // control would be a lie — hide it and let the OS setting rule.
  if (reduced) return null;

  const dark = appearance === "dark";

  return (
    <div
      role="radiogroup"
      aria-label="Animation style"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full p-1",
        dark ? "bg-white/10" : "bg-gray-100",
        className,
      )}
    >
      {MOTION_VIBES.map((v) => {
        const Icon = VIBE_ICON[v];
        const active = hydrated && vibe === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            title={`${VIBE_LABEL[v]} animations`}
            onClick={() => setVibe(v)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "text-white"
                : dark
                  ? "text-white/70 hover:text-white"
                  : "text-gray-500 hover:text-gray-800",
            )}
          >
            {active && (
              <motion.span
                layoutId="vibe-indicator"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden />
            {variant === "full" && (
              <span className="relative z-10">{VIBE_LABEL[v]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MotionVibeToggle;
