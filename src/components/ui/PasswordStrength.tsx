"use client";

import { useMotionVibe } from "@/lib/motion";
import { cn } from "@/utils";
import { scorePasswordStrength } from "@/lib/validation/password";

const SEGMENTS = 5;

const LEVEL_META: Record<1 | 2 | 3 | 4 | 5, { label: string; bar: string }> = {
  1: { label: "Very weak", bar: "bg-red-500" },
  2: { label: "Weak", bar: "bg-orange-500" },
  3: { label: "Medium", bar: "bg-yellow-400" },
  4: { label: "Strong", bar: "bg-lime-500" },
  5: { label: "Very strong", bar: "bg-green-600" },
};

// The meter sits inside the auth input, which is light in playful/calm and
// dark in bold — so the label ink and idle-track colour flip for bold.
const LABEL_INK: Record<"light" | "dark", Record<1 | 2 | 3 | 4 | 5, string>> = {
  light: {
    1: "text-red-600",
    2: "text-orange-600",
    3: "text-yellow-600",
    4: "text-lime-600",
    5: "text-green-600",
  },
  dark: {
    1: "text-red-400",
    2: "text-orange-400",
    3: "text-yellow-300",
    4: "text-lime-300",
    5: "text-green-400",
  },
};

interface PasswordStrengthProps {
  value: string;
  className?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  value,
  className,
}) => {
  const { vibe } = useMotionVibe();
  const level = scorePasswordStrength(value);

  const surface = vibe === "bold" ? "dark" : "light";
  const track = surface === "dark" ? "bg-white/20" : "bg-gray-300/70";

  // Narrows level away from 0 in the else branches so the 1–5 maps type-check.
  const activeBar = level === 0 ? null : LEVEL_META[level].bar;
  const label = level === 0 ? "Password strength" : LEVEL_META[level].label;
  const labelInk = level === 0 ? "text-gray-400" : LABEL_INK[surface][level];

  return (
    <div
      className={cn("flex items-center justify-between gap-3", className)}
      aria-live="polite"
    >
      <div className="flex gap-1">
        {Array.from({ length: SEGMENTS }, (_, i) => i + 1).map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 w-6 rounded-full transition-colors duration-300",
              activeBar && segment <= level ? activeBar : track,
            )}
          />
        ))}
      </div>
      <span className={cn("text-xs font-medium", labelInk)}>{label}</span>
    </div>
  );
};

export default PasswordStrength;
