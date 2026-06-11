import { Home, Search } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import { COMMUNITY_RESOURCES, type ResourceAudience } from "@/constants";
import { cn } from "@/utils";

const AUDIENCE_META: Record<
  ResourceAudience,
  { label: string; eyebrow: string; subtitle: string; icon: typeof Home }
> = {
  rehomer: {
    label: "rehomer",
    eyebrow: "If you’re rehoming",
    subtitle:
      "You’re doing the right thing by your pet. These are the things we’ve learned that make the handover easier — for you, for them, and for whoever takes them next.",
    icon: Home,
  },
  adopter: {
    label: "adopter",
    eyebrow: "If you’re adopting",
    subtitle:
      "Adopting from a current owner is different from a shelter. You get more story, more nuance, and a person on the other end. Here’s how to make the most of that.",
    icon: Search,
  },
};

const ResourcesSection: React.FC = () => {
  const rehomerResources = COMMUNITY_RESOURCES.filter(
    (r) => r.audience === "rehomer",
  );
  const adopterResources = COMMUNITY_RESOURCES.filter(
    (r) => r.audience === "adopter",
  );

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Resources"
            title="Practical help for both sides of a rehoming."
            subtitle="No medical advice or legal guidance — just lived-experience tips for the two moments that matter: handing a pet over, and bringing one home."
          />
        </ScrollReveal>

        <AudienceBlock
          audience="rehomer"
          resources={rehomerResources}
          className="mt-16"
        />

        <AudienceBlock
          audience="adopter"
          resources={adopterResources}
          className="mt-20"
        />
      </div>
    </section>
  );
};

interface AudienceBlockProps {
  audience: ResourceAudience;
  resources: typeof COMMUNITY_RESOURCES;
  className?: string;
}

const AudienceBlock: React.FC<AudienceBlockProps> = ({
  audience,
  resources,
  className,
}) => {
  const meta = AUDIENCE_META[audience];
  const Icon = meta.icon;

  return (
    <div className={className}>
      <ScrollReveal>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">
              {meta.eyebrow}
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              {meta.subtitle}
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div
        className={cn(
          "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {resources.map((resource, i) => (
          <ScrollReveal key={resource.title} delay={i * 0.08}>
            <div className="group relative h-full overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50/60 to-white p-7 ring-1 ring-rose-100 transition-all hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">
                {resource.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {resource.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default ResourcesSection;
