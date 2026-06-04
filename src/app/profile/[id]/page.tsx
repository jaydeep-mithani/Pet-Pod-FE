"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { Footer, PetCard, PetCardSkeleton, UserAvatar } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { usersService, type PublicUser } from "@/lib/services/users.service";
import { petsService } from "@/lib/services";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";
import { formatLocation } from "@/utils";
import type { PetListItem } from "@/types";

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [pets, setPets] = useState<PetListItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const [u, list] = await Promise.all([
          usersService.getPublic(id),
          petsService.list({ ownerId: id, limit: 24 }),
        ]);
        if (cancelled) return;
        setProfile(u);
        setPets(list);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError && err.status === 404
            ? "We couldn't find that person."
            : "Couldn't load this profile.",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // If you somehow landed on your own profile via /profile/[id], shortcut to
  // the editable /profile page.
  useEffect(() => {
    if (currentUser && profile && currentUser.id === profile.id) {
      router.replace(ROUTES.profile);
    }
  }, [currentUser, profile, router]);

  if (loadError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white pt-28">
        <p className="text-sm text-gray-700">{loadError}</p>
        <Link
          href={ROUTES.pets}
          className="mt-3 inline-block text-sm font-medium text-pink-600 hover:text-pink-700"
        >
          Browse pets
        </Link>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white pt-28">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  const location = formatLocation(profile);
  const joined = new Date(profile.createdAt).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-white pt-28 sm:pt-32">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            <UserAvatar
              name={profile.name}
              avatarUrl={profile.avatarUrl}
              size="lg"
              className="!h-24 !w-24 text-2xl ring-4 ring-white"
            />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {profile.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 sm:justify-start">
                {location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  Member since {joined}
                </span>
              </div>
              {profile.bio && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-700">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900">
            {profile.name.split(" ")[0]}&apos;s listings
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Pets {profile.name.split(" ")[0]} is currently sharing.
          </p>

          <div className="mt-6">
            {pets === null ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PetCardSkeleton key={i} />
                ))}
              </div>
            ) : pets.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-600">
                  No public listings right now.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
