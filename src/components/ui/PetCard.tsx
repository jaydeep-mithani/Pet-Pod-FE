"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

interface HoverHeart {
  id: number;
  x: number;
  drift: number;
}

let heartId = 0;
const MAX_HEARTS = 5;

const PetCard: React.FC<PetCardProps> = ({ pet, priority, className }) => {
  const { tokens, vibe } = useMotionVibe();
  const [hearts, setHearts] = useState<HoverHeart[]>([]);

  const locationLabel = formatLocation(pet);
  const speciesLabel = pet.breed ?? SPECIES_LABEL[pet.species];
  const hasPhotos = pet.photos.length > 0;
  const displayName = petDisplayName(pet);
  const altLabel = `${petShortName(pet)}, a ${speciesLabel} looking for a new home`;

  // Playful flourish: a little heart floats off the card when you hover it.
  const heartsEnabled = vibe === "playful" && tokens.flourish;
  const handleHoverStart = () => {
    if (!heartsEnabled) return;
    setHearts((curr) => [
      ...curr.slice(-MAX_HEARTS + 1),
      {
        id: heartId++,
        x: 16 + Math.random() * 40,
        drift: Math.random() * 24 - 12,
      },
    ]);
  };

  const removeHeart = (id: number) => {
    setHearts((curr) => curr.filter((h) => h.id !== id));
  };

  return (
    <motion.div
      onHoverStart={handleHoverStart}
      whileHover={{
        y: tokens.hover.y,
        scale: tokens.hover.scale,
        rotate: tokens.hover.rotate,
      }}
      transition={tokens.interactive}
      className={cn("relative h-full", className)}
    >
      {heartsEnabled && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30"
          aria-hidden
        >
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                className="absolute top-2 text-pink-500"
                style={{ right: heart.x }}
                initial={{ opacity: 0.9, y: 0, x: 0, scale: 0.5 }}
                animate={{
                  opacity: 0,
                  y: -34,
                  x: heart.drift,
                  scale: 1.1,
                  transition: { duration: 0.9, ease: "easeOut" },
                }}
                onAnimationComplete={() => removeHeart(heart.id)}
              >
                <Heart className="h-4 w-4 fill-current" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Link
        href={ROUTES.petDetail(pet.id)}
        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200/70 transition-[box-shadow,--tw-ring-color] duration-300 hover:shadow-[0_8px_32px_-8px_rgba(236,72,153,0.35)] hover:ring-pink-300/70"
      >
        {/*
          The image wrapper owns its own rounded clip + compositing layer
          ([transform:translateZ(0)]) so the corner radius keeps clipping
          while the card scales/rotates on hover — without it, fast hovers
          flash the image's square corners.
        */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl bg-gray-100 [transform:translateZ(0)]">
          {hasPhotos ? (
            <PhotoCarousel
              photos={pet.photos}
              alt={altLabel}
              autoplayMs={4000}
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              showDots
              className={IMAGE_ZOOM_CLASS[tokens.imageZoom]}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100 text-gray-500">
              <span className="text-4xl" aria-hidden>
                {SPECIES_EMOJI[pet.species]}
              </span>
              <span className="text-xs uppercase tracking-widest">
                No photo yet
              </span>
            </div>
          )}
          <div className="absolute left-2.5 top-2.5 z-20 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
            <span aria-hidden>{SPECIES_EMOJI[pet.species]}</span>
            <span>{speciesLabel}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900">
              {displayName}
            </h3>
            <span className="text-xs text-gray-500">
              {formatPetAge(pet.ageMonths)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">
            {pet.shortDescription}
          </p>
          {locationLabel && (
            <div className="mt-auto flex items-center gap-1 pt-1.5 text-xs text-gray-500">
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
