"use client";

import { Check, HandHeart, ShieldCheck } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import { WHY_NO_MONEY_REASONS } from "@/constants";
import { useMotionVibe } from "@/lib/motion";

const REASON_ICONS = [HandHeart, Check, ShieldCheck];

const WhyNoMoneySection: React.FC = () => {
  const { vibe } = useMotionVibe();

  // Calm: light paper editorial — warm stone background, ink text, reasons
  // as left-ruled rows instead of dark glass cards.
  if (vibe === "calm") {
    return (
      <section className="relative overflow-hidden bg-[#f7f6f3] py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Why no money changes hands"
              title={
                <span>
                  Pets aren&apos;t products.
                  <span className="block text-stone-500">
                    We built it that way on purpose.
                  </span>
                </span>
              }
              subtitle="Every other rehoming option turns animals into transactions. We think that's the root of the problem."
            />
          </ScrollReveal>

          <div className="mt-14 space-y-10">
            {WHY_NO_MONEY_REASONS.map((reason, i) => (
              <ScrollReveal key={reason.title} delay={i * 0.08}>
                <div className="border-l-2 border-teal-700/40 pl-6 sm:pl-8">
                  <h3 className="text-xl text-gray-900">{reason.title}</h3>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-stone-600">
                    {reason.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gray-950 py-20 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.18) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(168, 85, 247, 0.18) 0, transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Why no money changes hands"
            title={
              <span>
                Pets aren&apos;t products.
                <span className="block text-white/70">
                  We built it that way on purpose.
                </span>
              </span>
            }
            subtitle={
              <span className="text-white/70">
                Every other rehoming option turns animals into transactions. We
                think that&apos;s the root of the problem.
              </span>
            }
            className="[&_h2]:text-white [&_p]:text-white/70"
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {WHY_NO_MONEY_REASONS.map((reason, i) => {
            const Icon = REASON_ICONS[i];
            return (
              <ScrollReveal key={reason.title} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/80 to-purple-600/80 text-white">
                    {Icon && <Icon className="h-6 w-6" aria-hidden />}
                  </div>
                  <h3 className="text-lg font-semibold">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {reason.description}
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

export default WhyNoMoneySection;
