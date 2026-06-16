"use client";

import { Heart } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import { useMotionVibe } from "@/lib/motion";

const HERO_DESCRIPTION =
  "Pet Pod isn’t a marketplace or a shelter. It’s a small platform built around one idea: that the people best placed to find a pet their next home are the ones who know that pet best. We just help them find each other.";

const CommunityHeroSection: React.FC = () => {
  const { vibe } = useMotionVibe();

  // Bold: a dark poster in miniature — mono "// about" eyebrow, outline-stroke
  // accent, slight rotation. Mirrors HeroSection's bold branch.
  if (vibe === "bold") {
    return (
      <section className="relative overflow-hidden bg-gray-950 pt-32 pb-20 sm:pt-36 sm:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, rgba(217, 70, 239, 0.20) 0, transparent 45%), radial-gradient(circle at 85% 15%, rgba(34, 211, 238, 0.14) 0, transparent 40%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
              {"// about pet pod"}
            </p>
            <h1 className="mt-6 max-w-4xl -rotate-1 text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl">
              A quieter way to{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #e879f9" }}
              >
                rehome a pet
              </span>
              .
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {HERO_DESCRIPTION}
            </p>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  // Calm: editorial intro — left-aligned on warm paper, hairline rule, no
  // ornament. Serif heading comes from the calm theme layer automatically.
  if (vibe === "calm") {
    return (
      <section className="relative overflow-hidden bg-[#f7f6f3] pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-teal-700">
              About Pet Pod
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              A quieter way to{" "}
              <span className="text-teal-800">rehome a pet</span>.
            </h1>
            <div className="mt-8 h-px w-24 bg-teal-700/40" aria-hidden />
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              {HERO_DESCRIPTION}
            </p>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-amber-50/50 to-white pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 25%, rgba(236, 72, 153, 0.10) 0, transparent 45%), radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.10) 0, transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <Heart className="h-7 w-7 text-white" aria-hidden />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-600">
            About Pet Pod
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            A quieter way to{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              rehome a pet
            </span>
            .
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            {HERO_DESCRIPTION}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CommunityHeroSection;
