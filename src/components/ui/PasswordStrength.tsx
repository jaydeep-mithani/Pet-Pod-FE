"use client";

import { useMotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

const SEGMENTS = 5;

/**
 * Bucket a password into five tiers (Very weak → Very strong). One point each
 * for reaching 8 and 12 characters, mixing upper- and lower-case, including a
 * digit, and including a symbol; the 0–5 total maps to a tier (0 and 1 both
 * read as "very weak"). The five-segment meter nudges people toward the top of
 * the scale. Returns 0 for an empty password so callers can hide the meter
 * until typing starts.
 */
export function scorePasswordStrength(password: string): PasswordStrengthLevel {
  if (!password) return 0;
  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;
  return Math.max(1, points) as PasswordStrengthLevel;
}

const LEVEL_META: Record<1 | 2 | 3 | 4 | 5, { label: string; bar: string }> = {
  1: { label: "Very weak", bar: "bg-red-500" },
  2: { label: "Weak", bar: "bg-orange-500" },
  3: { label: "Medium", bar: "bg-yellow-400" },
  4: { label: "Strong", bar: "bg-lime-500" },
  5: { label: "Very strong", bar: "bg-green-600" },
};

// The meter sits on the auth form card, which is light in playful/calm and
// dark in bold — so the label ink and empty-track colour flip for bold.
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

  // Nothing to show until the user starts typing.
  if (level === 0) return null;

  const surface = vibe === "bold" ? "dark" : "light";
  const track = surface === "dark" ? "bg-white/15" : "bg-gray-200";
  const meta = LEVEL_META[level];

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      aria-live="polite"
    >
      <div className="flex gap-1">
        {Array.from({ length: SEGMENTS }, (_, i) => i + 1).map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 w-6 rounded-full transition-colors duration-300",
              segment <= level ? meta.bar : track,
            )}
          />
        ))}
      </div>
      <span className={cn("text-xs font-medium", LABEL_INK[surface][level])}>
        {meta.label}
      </span>
    </div>
  );
};

export default PasswordStrength;
