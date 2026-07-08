"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import {
  Button,
  Footer,
  PetCard,
  PetCardSkeleton,
  VelocityTilt,
} from "@/components";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { petsService } from "@/lib/services";
import { ROUTES } from "@/lib/routes";
import { STATUS_LABEL } from "@/constants";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import { cn } from "@/utils";
import type { PetListItem, PetStatus } from "@/types";

// Status chips sit on top of pet photos, so they need per-vibe palettes:
// playful keeps pastels, calm goes teal/sand, bold flips to dark pills with
// neon text so they read on the night stage.
const STATUS_TINT: Record<MotionVibe, Record<PetStatus, string>> = {
  playful: {
    AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
    ADOPTED: "bg-gray-100 text-gray-600 ring-gray-200",
    REMOVED: "bg-gray-100 text-gray-500 ring-gray-200",
  },
  calm: {
    AVAILABLE: "bg-teal-50 text-teal-700 ring-teal-200",
    PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
    ADOPTED: "bg-stone-100 text-stone-600 ring-stone-200",
    REMOVED: "bg-stone-100 text-stone-500 ring-stone-200",
  },
  bold: {
    AVAILABLE: "bg-gray-950/85 text-cyan-300 ring-cyan-400/40",
    PENDING: "bg-gray-950/85 text-fuchsia-300 ring-fuchsia-400/40",
    ADOPTED: "bg-gray-950/85 text-gray-300 ring-gray-500/40",
    REMOVED: "bg-gray-950/85 text-gray-500 ring-gray-600/40",
  },
};

// Header underline: playful floats free, calm gets a hairline rule, bold a
// neon one.
const HEADER_RULE: Record<MotionVibe, string> = {
  playful: "",
  calm: "border-b border-stone-200 pb-6",
  bold: "border-b border-fuchsia-500/30 pb-6",
};

export default function MyListingsPage() {
  const status = useRequireAuth();
  const { vibe } = useMotionVibe();
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
          <div
            className={cn(
              "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end",
              HEADER_RULE[vibe],
            )}
          >
            <div>
              <Link
                href={ROUTES.settingsProfile}
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                ← Back to profile
              </Link>
              {vibe === "bold" && (
                <span className="mt-3 block font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
                  {"// my listings"}
                </span>
              )}
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
            <VelocityTilt className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pets?.map((pet) => (
                <div key={pet.id} className="relative">
                  <span
                    className={cn(
                      "absolute right-3 top-3 z-30 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1",
                      STATUS_TINT[vibe][pet.status],
                    )}
                  >
                    {STATUS_LABEL[pet.status]}
                  </span>
                  <PetCard pet={pet} />
                </div>
              ))}
            </VelocityTilt>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

// The playful rose wash uses an opacity-suffixed class (bg-rose-50/40) that
// the theme layers don't remap, so the empty state branches per vibe: calm
// gets quiet paper, bold a neon-edged panel on the dark stage.
const EMPTY_STATE_CLASS: Record<MotionVibe, string> = {
  playful: "border border-rose-100 bg-rose-50/40",
  calm: "border border-stone-200 bg-[#f7f6f3] text-left",
  bold: "border border-fuchsia-500/40 bg-gray-950 shadow-[0_0_32px_-12px_rgba(217,70,239,0.45)]",
};

const EmptyState: React.FC = () => {
  const { vibe } = useMotionVibe();
  return (
    <div
      className={cn(
        "mx-auto max-w-md rounded-3xl p-10 text-center",
        EMPTY_STATE_CLASS[vibe],
      )}
    >
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
};
