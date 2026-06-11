import { HandHeart, MessagesSquare, ShieldX } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import { MISSION_BELIEFS } from "@/constants";

const BELIEF_ICONS = [HandHeart, MessagesSquare, ShieldX];

const MissionSection: React.FC = () => {
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
            eyebrow="What we believe"
            title={
              <span>
                Three things that shaped{" "}
                <span className="block text-white/70">
                  every decision we’ve made.
                </span>
              </span>
            }
            subtitle={
              <span className="text-white/70">
                We didn’t want to build another adoption marketplace. So we
                started from a blank page and asked what we’d actually want if
                it were our own pet.
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
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/80 to-purple-600/80 text-white">
                    {Icon && <Icon className="h-6 w-6" aria-hidden />}
                  </div>
                  <h3 className="text-lg font-semibold">{belief.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
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
