"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PawPrint, Plus } from "lucide-react";
import { Button } from "@/components";
import SettingsSection from "../SettingsSection";
import { petsService } from "@/lib/services";
import { ROUTES } from "@/lib/routes";
import type { PetListItem } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  ADOPTED: "Adopted",
};

export default function SettingsListingsPage() {
  const [pets, setPets] = useState<PetListItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    petsService
      .listMine()
      .then((mine) => {
        if (!cancelled) setPets(mine.filter((p) => p.status !== "REMOVED"));
      })
      .catch(() => {
        if (!cancelled) setPets([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = (pets ?? []).reduce<Record<string, number>>((acc, pet) => {
    acc[pet.status] = (acc[pet.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <SettingsSection
      title="Your listings"
      description="Create, edit, and manage the pets you're rehoming."
    >
      {pets === null ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : pets.length === 0 ? (
        <p className="text-sm text-gray-600">
          You haven&apos;t listed a pet yet. When you do, you can manage
          everything from here.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            <PawPrint className="h-3.5 w-3.5" aria-hidden />
            {pets.length} total
          </span>
          {Object.entries(STATUS_LABEL).map(([status, label]) =>
            counts[status] ? (
              <span
                key={status}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
              >
                {counts[status]} {label.toLowerCase()}
              </span>
            ) : null,
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={ROUTES.myListings}>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
          >
            Manage listings
          </Button>
        </Link>
        <Link href={ROUTES.newListing}>
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={<Plus className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            New listing
          </Button>
        </Link>
      </div>
    </SettingsSection>
  );
}
