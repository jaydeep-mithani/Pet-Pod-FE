"use client";

import { MessageCircle, PawPrint, Search } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../ui/TiltCard";
import { HOW_IT_WORKS_STEPS } from "@/constants";
import { useMotionVibe } from "@/lib/motion";

const STEP_ICONS = [Search, MessageCircle, PawPrint];

// Alternating poster rotations for bold's deck-of-cards look.
const BOLD_ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1"];

const HowItWorksSection: React.FC = () => {
  const { vibe } = useMotionVibe();

  // Bold: rotated neon cards on the dark stage, oversized ghost numerals
  // bleeding out behind the content.
  if (vibe === "bold") {
    return (
      <section
        id="how-it-works"
        className="relative overflow-hidden bg-gray-950 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="How it works"
              title={<span className="text-white">Three simple steps</span>}
              subtitle={
                <span className="text-gray-400">
                  No paperwork. No marketplace fees. Just people helping pets
                  find the right home.
                </span>
              }
            />
          </ScrollReveal>

          <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <ScrollReveal key={step.step} delay={i * 0.12}>
                  <TiltCard>
                    <div
                      className={`group relative h-full overflow-hidden rounded-2xl border border-fuchsia-500/40 bg-[#13131e] p-8 shadow-[0_0_32px_-12px_rgba(217,70,239,0.45)] transition-transform duration-300 hover:rotate-0 ${BOLD_ROTATIONS[i]}`}
                    >
                      <span
                        className="pointer-events-none absolute -right-3 -top-7 select-none text-[7rem] font-bold leading-none text-fuchsia-500/15"
                        aria-hidden
                      >
                        {step.step}
                      </span>
                      <div className="relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-[0_0_16px_rgba(217,70,239,0.6)]">
                        {Icon && <Icon className="h-6 w-6" aria-hidden />}
                      </div>
                      <h3 className="relative text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Calm: an editorial numbered list — generous whitespace, hairline rules,
  // oversized serif numerals, no cards or icon chips.
  if (vibe === "calm") {
    return (
      <section
        id="how-it-works"
        className="relative overflow-hidden bg-white py-24 sm:py-28"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="How it works"
              title="Three simple steps"
              subtitle="No paperwork. No marketplace fees. Just people helping pets find the right home."
            />
          </ScrollReveal>

          <div className="mt-14 border-t border-stone-200">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.08}>
                <div className="grid grid-cols-[4.5rem_1fr] items-start gap-6 border-b border-stone-200 py-10 sm:grid-cols-[7rem_1fr] sm:gap-10">
                  <span
                    className="text-5xl font-semibold leading-none text-teal-800/25 sm:text-6xl"
                    aria-hidden
                  >
                    0{step.step}
                  </span>
                  <div>
                    <h3 className="text-2xl text-gray-900">{step.title}</h3>
                    <p className="mt-2.5 max-w-xl text-base leading-relaxed text-stone-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three simple steps"
            subtitle="No paperwork. No marketplace fees. Just people helping pets find the right home."
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <ScrollReveal key={step.step} delay={i * 0.1}>
                <TiltCard>
                  <div className="group relative h-full rounded-3xl bg-gradient-to-b from-rose-50/60 to-white p-8 ring-1 ring-rose-100 transition-shadow hover:shadow-[var(--pp-card-glow)]">
                    <div className="absolute -top-4 left-8 inline-flex h-10 items-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-md">
                      Step {step.step}
                    </div>
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-sm ring-1 ring-rose-100 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {Icon && <Icon className="h-6 w-6" aria-hidden />}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
