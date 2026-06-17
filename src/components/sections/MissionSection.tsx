"use client";

import { HandHeart, MessagesSquare, ShieldX } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import { MISSION_BELIEFS } from "@/constants";
import { useMotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

const BELIEF_ICONS = [HandHeart, MessagesSquare, ShieldX];

const MissionSection: React.FC = () => {
  const { vibe } = useMotionVibe();

  // Calm: light paper editorial — mirrors WhyNoMoneySection's calm branch.
  // Warm stone background, ink text, beliefs as left-ruled rows instead of
  // dark glass cards.
  if (vibe === "calm") {
    return (
      <section className="relative overflow-hidden bg-[#f7f6f3] py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="What we believe"
              title={
                <span>
                  Three things that shaped
                  <span className="block text-stone-500">
                    every decision we&apos;ve made.
                  </span>
                </span>
              }
              subtitle="We didn't want to build another adoption marketplace. So we started from a blank page and asked what we'd actually want if it were our own pet."
            />
          </ScrollReveal>

          <div className="mt-14 space-y-10">
            {MISSION_BELIEFS.map((belief, i) => (
              <ScrollReveal key={belief.title} delay={i * 0.08}>
                <div className="border-l-2 border-teal-700/40 pl-6 sm:pl-8">
                  <h3 className="text-xl text-gray-900">{belief.title}</h3>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-stone-600">
                    {belief.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Playful keeps the dark glass cards as designed; bold reuses the dark
  // stage but trades the soft white hairlines for neon fuchsia borders,
  // glows, and oversized ghost numerals.
  const isBold = vibe === "bold";

  return (
    <section className="relative overflow-hidden bg-gray-950 py-20 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: isBold
            ? "radial-gradient(circle at 20% 20%, rgba(217, 70, 239, 0.22) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(34, 211, 238, 0.16) 0, transparent 40%)"
            : "radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.18) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(168, 85, 247, 0.18) 0, transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="What we believe"
            title={
              <span>
                Three things that shaped{" "}
                <span className="block text-white/70">
                  every decision we&apos;ve made.
                </span>
              </span>
            }
            subtitle={
              <span className="text-white/70">
                We didn&apos;t want to build another adoption marketplace. So we
                started from a blank page and asked what we&apos;d actually want
                if it were our own pet.
              </span>
            }
            className="[&_h2]:text-white [&_p]:text-white/70"
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {MISSION_BELIEFS.map((belief, i) => {
            const Icon = BELIEF_ICONS[i];
            return (
              <ScrollReveal key={belief.title} delay={i * 0.1}>
                <div
                  className={cn(
                    "h-full rounded-3xl border bg-white/5 p-7 backdrop-blur-sm transition-colors hover:bg-white/10",
                    isBold
                      ? "relative overflow-hidden rounded-2xl border-fuchsia-500/40 shadow-[0_0_32px_-12px_rgba(217,70,239,0.45)] hover:border-fuchsia-400/70"
                      : "border-white/10 hover:border-white/20",
                  )}
                >
                  {isBold && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-6 select-none text-[6.5rem] font-bold leading-none text-fuchsia-500/15"
                    >
                      0{i + 1}
                    </span>
                  )}
                  <div
                    className={cn(
                      "relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/80 to-purple-600/80 text-white",
                      isBold && "shadow-[0_0_16px_rgba(217,70,239,0.6)]",
                    )}
                  >
                    {Icon && <Icon className="h-6 w-6" aria-hidden />}
                  </div>
                  <h3 className="relative text-lg font-semibold">
                    {belief.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                    {belief.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
