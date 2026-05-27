import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { Calendar, MapPin } from "lucide-react";
import { Footer, UserAvatar } from "@/components";
import MessageOwnerButton from "@/components/sections/MessageOwnerButton";
import PetOwnerActions from "@/components/sections/PetOwnerActions";
import PetPhotoGallery from "@/components/sections/PetPhotoGallery";
import {
  SIZE_LABEL,
  SPECIES_EMOJI,
  SPECIES_LABEL,
  STATUS_LABEL,
} from "@/constants";
import { petsService } from "@/lib/services";
import { ROUTES } from "@/lib/routes";
import { ApiError } from "@/lib/api/errors";
import {
  formatLocation,
  formatPetAge,
  formatRelativeTime,
  petDisplayName,
  petShortName,
} from "@/utils";
import type { PetDetail } from "@/types";

async function loadPet(id: string): Promise<PetDetail | null> {
  try {
    return await petsService.getById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pet = await loadPet(id);
  if (!pet) notFound();

  const location = formatLocation(pet);
  const hasPhotos = pet.photos.length > 0;
  const displayName = petDisplayName(pet);
  const shortName = petShortName(pet);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-12 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={ROUTES.pets}
              className="text-sm font-medium text-pink-600 hover:text-pink-700"
            >
              ← Back to browse
            </Link>
            <PetOwnerActions petId={pet.id} ownerId={pet.ownerId} />
          </div>

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              {hasPhotos ? (
                <PetPhotoGallery photos={pet.photos} alt={shortName} />
              ) : (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-lg ring-1 ring-gray-200/70">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100 text-gray-500">
                    <span className="text-6xl" aria-hidden>
                      {SPECIES_EMOJI[pet.species]}
                    </span>
                    <span className="text-xs uppercase tracking-widest">
                      No photo yet
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-pink-700">
                  <span aria-hidden>{SPECIES_EMOJI[pet.species]}</span>
                  <span>{SPECIES_LABEL[pet.species]}</span>
                  {pet.breed && <span className="text-pink-400">•</span>}
                  {pet.breed && <span>{pet.breed}</span>}
                </div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  {displayName}
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:text-lg">
                  {pet.shortDescription}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-5 text-sm sm:grid-cols-3">
                <Stat label="Age" value={formatPetAge(pet.ageMonths)} />
                <Stat label="Size" value={SIZE_LABEL[pet.size]} />
                <Stat label="Status" value={STATUS_LABEL[pet.status]} />
                <Stat
                  label="Location"
                  value={location || pet.country}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                />
                <Stat
                  label="Posted"
                  value={formatRelativeTime(pet.createdAt)}
                  icon={<Calendar className="h-3.5 w-3.5" />}
                />
              </dl>

              {pet.story && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    The story
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-700">
                    {pet.story}
                  </p>
                </div>
              )}

              {pet.reasonForRehoming && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Why they need a new home
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-700">
                    {pet.reasonForRehoming}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <Link
                  href={ROUTES.publicProfile(pet.owner.id)}
                  className="flex items-center gap-3 transition-colors hover:text-pink-600"
                >
                  <UserAvatar
                    name={pet.owner.name}
                    avatarUrl={pet.owner.avatarUrl}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {pet.owner.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Member since{" "}
                      {new Date(pet.owner.createdAt).toLocaleDateString(
                        undefined,
                        { month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                </Link>
                <div className="mt-4">
                  <MessageOwnerButton
                    petId={pet.id}
                    ownerId={pet.ownerId}
                    ownerFirstName={pet.owner.name.split(" ")[0]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

interface StatProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const Stat: React.FC<StatProps> = ({ label, value, icon }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
      {label}
    </dt>
    <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-900">
      {icon}
      <span>{value}</span>
    </dd>
  </div>
);
