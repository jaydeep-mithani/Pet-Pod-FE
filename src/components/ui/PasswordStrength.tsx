"use client";

import { useMotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

export type PasswordStrengthLevel = 0 | 1 | 2 | 3;

/**
 * Bucket a password into three tiers. Points are awarded for length and
 * character-class variety, then collapsed into Weak / Strong / Very strong so
 * the meter reads as three segments (red → yellow → green). Returns 0 for an
 * empty password so callers can hide the meter until the user starts typing.
 */
export function scorePasswordStrength(password: string): PasswordStrengthLevel {
  if (!password) return 0;
  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;
  if (points <= 2) return 1;
  if (points <= 3) return 2;
  return 3;
}

const LEVEL_META: Record<1 | 2 | 3, { label: string; bar: string }> = {
  1: { label: "Weak", bar: "bg-red-500" },
  2: { label: "Strong", bar: "bg-yellow-400" },
  3: { label: "Very strong", bar: "bg-green-500" },
};

// The meter sits on the auth form card, which is light in playful/calm and
// dark in bold — so the label ink and the empty-track colour flip for bold.
const LABEL_INK: Record<"light" | "dark", Record<1 | 2 | 3, string>> = {
  light: { 1: "text-red-600", 2: "text-yellow-600", 3: "text-green-600" },
  dark: { 1: "text-red-400", 2: "text-yellow-300", 3: "text-green-400" },
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
    <div className={cn("space-y-1.5", className)} aria-live="polite">
      <div className="flex gap-1.5">
        {([1, 2, 3] as const).map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              segment <= level ? meta.bar : track,
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium", LABEL_INK[surface][level])}>
        Password strength: {meta.label}
      </p>
    </div>
  );
};

export default PasswordStrength;
