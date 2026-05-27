import { MessageCircle, PawPrint, Search } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import { HOW_IT_WORKS_STEPS } from "@/constants";

const STEP_ICONS = [Search, MessageCircle, PawPrint];

const HowItWorksSection: React.FC = () => {
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
                <div className="group relative h-full rounded-3xl bg-gradient-to-b from-rose-50/60 to-white p-8 ring-1 ring-rose-100 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute -top-4 left-8 inline-flex h-10 items-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-md">
                    Step {step.step}
                  </div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-sm ring-1 ring-rose-100">
                    {Icon && <Icon className="h-6 w-6" aria-hidden />}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {step.description}
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

export default HowItWorksSection;
