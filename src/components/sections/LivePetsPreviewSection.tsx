import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import Button from "../ui/Button";
import PetCard from "../ui/PetCard";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";
import { petsService } from "@/lib/services";
import { ROUTES } from "@/lib/routes";
import type { PetListItem } from "@/types";

async function fetchFeatured(): Promise<PetListItem[]> {
  try {
    return await petsService.listFeatured(8);
  } catch {
    return [];
  }
}

const LivePetsPreviewSection: React.FC = async () => {
  const pets = await fetchFeatured();

  return (
    <section className="bg-gradient-to-b from-white to-rose-50/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Looking for a home"
            title="Pets waiting for a second chance"
            subtitle="Real animals posted by their current owners. Read their story, message the owner, and see if it's the right fit."
          />
        </ScrollReveal>

        {pets.length > 0 ? (
          <>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pets.map((pet, i) => (
                <ScrollReveal key={pet.id} delay={i * 0.05}>
                  <PetCard pet={pet} priority={i < 4} />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.1}>
              <div className="mt-12 flex justify-center">
                <Link href={ROUTES.pets}>
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<ArrowRight className="h-5 w-5" />}
                    iconPosition="right"
                  >
                    See all pets
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </>
        ) : (
          <ScrollReveal>
            <div className="mt-12 mx-auto max-w-xl rounded-3xl border border-rose-100 bg-white/70 p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 text-pink-600">
                <Heart className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                No pets listed yet
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Be the first to share a pet&apos;s story — someone out there is
                looking for exactly who you have to give.
              </p>
              <div className="mt-6">
                <Link href={ROUTES.newListing}>
                  <Button variant="primary" size="md">
                    Rehome a pet
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default LivePetsPreviewSection;
