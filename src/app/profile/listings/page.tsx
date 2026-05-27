"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button, Footer, PetCard, PetCardSkeleton } from "@/components";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { petsService } from "@/lib/services";
import { ROUTES } from "@/lib/routes";
import { STATUS_LABEL } from "@/constants";
import { cn } from "@/utils";
import type { PetListItem, PetStatus } from "@/types";

const STATUS_TINT: Record<PetStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  ADOPTED: "bg-gray-100 text-gray-600 ring-gray-200",
};

export default function MyListingsPage() {
  const status = useRequireAuth();
  const [pets, setPets] = useState<PetListItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authed") return;
    let cancelled = false;
    (async () => {
      try {
        const data = await petsService.listMine();
        if (!cancelled) setPets(data);
      } catch {
        if (!cancelled) setLoadError("Couldn't load your listings.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <main className="min-h-screen bg-white pt-28 sm:pt-32">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Link
                href={ROUTES.profile}
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                ← Back to profile
              </Link>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                My listings
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Pets you&apos;ve shared. Tap one to edit or mark as adopted.
              </p>
            </div>
            <Link href={ROUTES.newListing}>
              <Button
                variant="primary"
                size="md"
                icon={<PlusCircle className="h-5 w-5" />}
              >
                List a pet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {pets === null && !loadError ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PetCardSkeleton key={i} />
              ))}
            </div>
          ) : loadError ? (
            <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">
              {loadError}
            </div>
          ) : pets && pets.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pets?.map((pet) => (
                <div key={pet.id} className="relative">
                  <span
                    className={cn(
                      "absolute right-3 top-3 z-30 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1",
                      STATUS_TINT[pet.status],
                    )}
                  >
                    {STATUS_LABEL[pet.status]}
                  </span>
                  <PetCard pet={pet} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

const EmptyState: React.FC = () => (
  <div className="mx-auto max-w-md rounded-3xl border border-rose-100 bg-rose-50/40 p-10 text-center">
    <h2 className="text-lg font-semibold text-gray-900">
      You haven&apos;t listed a pet yet
    </h2>
    <p className="mt-2 text-sm text-gray-600">
      Share a pet&apos;s story to find them a safe new home.
    </p>
    <div className="mt-6">
      <Link href={ROUTES.newListing}>
        <Button variant="primary" size="md">
          List a pet
        </Button>
      </Link>
    </div>
  </div>
);
