"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PetForm from "@/components/forms/PetForm";
import PetFormSkeleton from "@/components/ui/PetFormSkeleton";
import { Footer } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { petsService, type CreatePetInput } from "@/lib/services";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";
import { petDisplayName } from "@/utils";

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-white pt-28 sm:pt-32">
    <section className="bg-gradient-to-b from-rose-50/60 to-white pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.pets}
          className="text-sm font-medium text-pink-600 hover:text-pink-700"
        >
          ← Back to browse
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Share their story
        </h1>
        <p className="mt-2 max-w-xl text-base text-gray-600">
          Honesty is the most important thing. Tell adopters what your pet is
          like and why they need a new home.
        </p>
      </div>
    </section>

    <section className="pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default function NewPetPage() {
  const status = useRequireAuth();
  const { user } = useAuth();
  const router = useRouter();

  // Listing a pet is a verified-email-only action. Bounce unverified users
  // proactively so they don't fill out the form just to get a 403.
  useEffect(() => {
    if (status === "authed" && user && !user.emailVerified) {
      toast.info("Verify your email to list a pet.");
      router.replace(
        `${ROUTES.verifyEmail}?next=${encodeURIComponent(ROUTES.newListing)}`,
      );
    }
  }, [status, user, router]);

  const handleSubmit = async (input: CreatePetInput) => {
    try {
      const pet = await petsService.create(input);
      toast.success(`${petDisplayName(pet)} is now listed.`);
      router.push(ROUTES.petDetail(pet.id));
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? (err.fieldErrors[0] ?? err.message)
          : "Failed to create listing.";
      toast.error(msg);
    }
  };

  if (status !== "authed") {
    return (
      <PageShell>
        <PetFormSkeleton />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PetForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push(ROUTES.pets)}
      />
    </PageShell>
  );
}
