"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PetForm, { type PetFormSubmitData } from "@/components/forms/PetForm";
import PetFormSkeleton from "@/components/ui/PetFormSkeleton";
import type { PhotoEntry } from "@/components/ui/ImageUploader";
import { Footer } from "@/components";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { petsService } from "@/lib/services";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";
import { petShortName } from "@/utils";
import type { PetDetail } from "@/types";

interface ShellProps {
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}

const PageShell: React.FC<ShellProps> = ({ backHref, backLabel, children }) => (
  <main className="min-h-screen bg-white pt-28 sm:pt-32">
    <section className="bg-gradient-to-b from-rose-50/60 to-white pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="text-sm font-medium text-pink-600 hover:text-pink-700"
        >
          ← {backLabel}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Edit listing
        </h1>
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

export default function EditPetPage() {
  const status = useRequireAuth();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || status !== "authed") return;
    let cancelled = false;
    (async () => {
      try {
        const data = await petsService.getById(id);
        if (!cancelled) setPet(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setLoadError("Pet not found.");
        } else {
          setLoadError("Couldn't load this listing.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, status]);

  useEffect(() => {
    if (pet && user && pet.ownerId !== user.id) {
      toast.error("You can't edit someone else's listing.");
      router.replace(ROUTES.petDetail(pet.id));
    }
  }, [pet, user, router]);

  const handleSubmit = async (input: PetFormSubmitData) => {
    if (!pet) return;
    // Photos are managed live (onPhotoAdd / onPhotoRemove) in edit mode,
    // so drop them from the save payload to avoid double-writes.
    const { photos: _ignored, ...rest } = input;
    void _ignored;
    try {
      const updated = await petsService.update(pet.id, rest);
      toast.success(`Saved changes to ${petShortName(updated)}.`);
      router.push(ROUTES.petDetail(updated.id));
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? (err.fieldErrors[0] ?? err.message)
          : "Failed to save changes.";
      toast.error(msg);
    }
  };

  const handlePhotoAdd = async (uploaded: {
    url: string;
    publicId: string;
  }): Promise<PhotoEntry> => {
    if (!pet) throw new Error("Pet not loaded");
    const photo = await petsService.addPhoto(pet.id, uploaded);
    return { id: photo.id, url: photo.url, publicId: uploaded.publicId };
  };

  const handlePhotoRemove = async (photo: PhotoEntry) => {
    if (!pet) return;
    if (!photo.id) return;
    await petsService.removePhoto(pet.id, photo.id);
  };

  const handlePhotoReorder = async (next: PhotoEntry[]) => {
    if (!pet) return;
    const ids = next.map((p) => p.id).filter((id): id is string => Boolean(id));
    if (ids.length !== next.length) return;
    await petsService.reorderPhotos(pet.id, ids);
  };

  if (loadError) {
    return (
      <PageShell backHref={ROUTES.pets} backLabel="Back to browse">
        <div className="py-8 text-center">
          <p className="text-sm text-gray-700">{loadError}</p>
        </div>
      </PageShell>
    );
  }

  if (status !== "authed" || !pet) {
    return (
      <PageShell backHref={ROUTES.pets} backLabel="Back to browse">
        <PetFormSkeleton />
      </PageShell>
    );
  }

  return (
    <PageShell
      backHref={ROUTES.petDetail(pet.id)}
      backLabel={`Back to ${petShortName(pet)}`}
    >
      <PetForm
        mode="edit"
        initial={{
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          ageMonths: pet.ageMonths,
          size: pet.size,
          status: pet.status,
          shortDescription: pet.shortDescription,
          story: pet.story,
          reasonForRehoming: pet.reasonForRehoming,
          city: pet.city,
          region: pet.region,
          country: pet.country,
          photos: pet.photos.map((p) => ({
            id: p.id,
            url: p.url,
            publicId: "",
          })),
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.push(ROUTES.petDetail(pet.id))}
        onPhotoAdd={handlePhotoAdd}
        onPhotoRemove={handlePhotoRemove}
        onPhotoReorder={handlePhotoReorder}
      />
    </PageShell>
  );
}
