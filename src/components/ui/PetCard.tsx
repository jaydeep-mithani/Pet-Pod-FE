"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PhotoCarousel from "./PhotoCarousel";
import type { PetListItem } from "@/types";
import { ROUTES } from "@/lib/routes";
import { SPECIES_EMOJI, SPECIES_LABEL } from "@/constants";
import { IMAGE_ZOOM_CLASS, useMotionVibe } from "@/lib/motion";
import {
  cn,
  formatLocation,
  formatPetAge,
  petDisplayName,
  petShortName,
} from "@/utils";

interface PetCardProps {
  pet: PetListItem;
  priority?: boolean;
  className?: string;
}

const PetCard: React.FC<PetCardProps> = ({ pet, priority, className }) => {
  const { tokens } = useMotionVibe();
  const locationLabel = formatLocation(pet);
  const speciesLabel = pet.breed ?? SPECIES_LABEL[pet.species];
  const hasPhotos = pet.photos.length > 0;
  const displayName = petDisplayName(pet);
  const altLabel = `${petShortName(pet)}, a ${speciesLabel} looking for a new home`;

  return (
    <motion.div
      whileHover={{
        y: tokens.hover.y,
        scale: tokens.hover.scale,
        rotate: tokens.hover.rotate,
      }}
      transition={tokens.interactive}
      className={cn("h-full", className)}
    >
      <Link
        href={ROUTES.petDetail(pet.id)}
        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200/70 transition-[box-shadow,--tw-ring-color] duration-300 hover:shadow-[0_8px_32px_-8px_rgba(236,72,153,0.35)] hover:ring-pink-300/70"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
          {hasPhotos ? (
            <PhotoCarousel
              photos={pet.photos}
              alt={altLabel}
              autoplayMs={4000}
              priority={priority}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              showDots
              className={IMAGE_ZOOM_CLASS[tokens.imageZoom]}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100 text-gray-500">
              <span className="text-5xl" aria-hidden>
                {SPECIES_EMOJI[pet.species]}
              </span>
              <span className="text-xs uppercase tracking-widest">
                No photo yet
              </span>
            </div>
          )}
          <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
            <span aria-hidden>{SPECIES_EMOJI[pet.species]}</span>
            <span>{speciesLabel}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {displayName}
            </h3>
            <span className="text-sm text-gray-500">
              {formatPetAge(pet.ageMonths)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">
            {pet.shortDescription}
          </p>
          {locationLabel && (
            <div className="mt-auto flex items-center gap-1 pt-2 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              <span>{locationLabel}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default PetCard;
