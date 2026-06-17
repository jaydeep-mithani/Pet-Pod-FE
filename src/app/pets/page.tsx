import Link from "next/link";
import { Heart } from "lucide-react";

export const dynamic = "force-dynamic";

import {
  Button,
  FinalCTASection,
  Footer,
  PetCard,
  VelocityTilt,
} from "@/components";
import BrowseHeader from "./BrowseHeader";
import { petsService } from "@/lib/services";
import { ROUTES } from "@/lib/routes";
import type { PetListItem } from "@/types";

async function loadPets(): Promise<PetListItem[]> {
  try {
    return await petsService.list();
  } catch {
    return [];
  }
}

export default async function PetsBrowsePage() {
  const pets = await loadPets();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-12 pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BrowseHeader />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pets.length > 0 ? (
            <VelocityTilt className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pets.map((pet, i) => (
                <PetCard key={pet.id} pet={pet} priority={i < 4} />
              ))}
            </VelocityTilt>
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-rose-100 bg-rose-50/40 p-10 text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 text-pink-600">
                <Heart className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                No pets listed yet
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Be the first to share a pet&apos;s story. Someone out there is
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
          )}
        </div>
      </section>

      <FinalCTASection />
      <Footer />
    </main>
  );
}
