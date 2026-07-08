"use client";

import { Check } from "lucide-react";
import SettingsSection from "../SettingsSection";
import { useMotionVibe, VIBE_LABEL, type MotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

interface VibeOption {
  vibe: MotionVibe;
  tagline: string;
  /** Swatch classes previewing the theme's palette. */
  swatches: string[];
  /** Selected-state ring in the theme's own accent. */
  activeRing: string;
}

const VIBE_OPTIONS: VibeOption[] = [
  {
    vibe: "playful",
    tagline:
      "Candy colors, paw-print cursor, bouncy details. The default Pet Pod.",
    swatches: ["bg-pink-500", "bg-purple-500", "bg-amber-300"],
    activeRing: "ring-pink-500",
  },
  {
    vibe: "calm",
    tagline: "Serif type, teal and sand, gentle motion. Easy on the eyes.",
    swatches: ["bg-teal-700", "bg-stone-300", "bg-amber-100"],
    activeRing: "ring-teal-600",
  },
  {
    vibe: "bold",
    tagline: "Dark neon, electric cursor, loud energy. Turn the lights off.",
    swatches: ["bg-fuchsia-500", "bg-cyan-400", "bg-gray-950"],
    activeRing: "ring-fuchsia-500",
  },
];

export default function SettingsAppearancePage() {
  const { vibe, setVibe } = useMotionVibe();

  return (
    <SettingsSection
      title="Theme"
      description="Each theme changes the whole experience — colors, type, cursor, and motion. Saved on this device."
    >
      <div
        role="radiogroup"
        aria-label="Theme"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {VIBE_OPTIONS.map((option) => {
          const active = vibe === option.vibe;
          return (
            <button
              key={option.vibe}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setVibe(option.vibe)}
              className={cn(
                "flex h-full flex-col items-start gap-3 rounded-2xl border-2 border-gray-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                active && cn("border-transparent ring-2", option.activeRing),
              )}
            >
              <span className="flex w-full items-center justify-between">
                <span className="flex gap-1.5" aria-hidden>
                  {option.swatches.map((swatch) => (
                    <span
                      key={swatch}
                      className={cn(
                        "h-5 w-5 rounded-full border border-black/10",
                        swatch,
                      )}
                    />
                  ))}
                </span>
                {active && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Active
                  </span>
                )}
              </span>
              <span className="text-base font-semibold text-gray-900">
                {VIBE_LABEL[option.vibe]}
              </span>
              <span className="text-xs leading-relaxed text-gray-600">
                {option.tagline}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Tip: the floating paw button in the corner switches themes from any
        page.
      </p>
    </SettingsSection>
  );
}
