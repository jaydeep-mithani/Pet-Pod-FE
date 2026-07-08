"use client";

import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

// Per-vibe section chrome, mirroring the profile page: playful keeps the soft
// card look, calm trades cards for hairline-ruled editorial sections, bold
// goes neon-bordered panels on the dark stage.
const SECTION_CLASS: Record<MotionVibe, string> = {
  playful: "rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8",
  calm: "border-t border-stone-200 pt-8 sm:pt-10",
  bold: "rounded-2xl border border-fuchsia-500/40 bg-white p-6 shadow-[0_0_32px_-12px_rgba(217,70,239,0.45)] sm:p-8",
};

// Danger zone gets red chrome in every vibe — destructive stays destructive,
// though bold swaps the glow to red instead of fuchsia.
const DANGER_CLASS: Record<MotionVibe, string> = {
  playful: "rounded-3xl border border-red-200 bg-red-50/40 p-6 sm:p-8",
  calm: "border-t-2 border-red-200 pt-8 sm:pt-10",
  bold: "rounded-2xl border border-red-500/40 bg-white p-6 shadow-[0_0_32px_-12px_rgba(239,68,68,0.5)] sm:p-8",
};

interface SettingsSectionProps {
  title: string;
  description?: string;
  tone?: "default" | "danger";
  children: React.ReactNode;
  className?: string;
}

/** One titled block on a settings page, themed per vibe. */
const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  tone = "default",
  children,
  className,
}) => {
  const { vibe } = useMotionVibe();
  const danger = tone === "danger";

  return (
    <section
      className={cn(
        danger ? DANGER_CLASS[vibe] : SECTION_CLASS[vibe],
        className,
      )}
    >
      <h2
        className={cn(
          "text-sm font-semibold uppercase tracking-wider",
          danger ? "text-red-600" : "text-gray-500",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
};

export default SettingsSection;
