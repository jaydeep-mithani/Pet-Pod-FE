import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.round((now - then) / 1000);

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function formatPetAge(months: number): string {
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  if (years === 1) return "1 yr";
  return `${years} yrs`;
}

export function formatLocation(parts: {
  city: string | null;
  region: string | null;
  country?: string | null;
}): string {
  return [parts.city, parts.region].filter(Boolean).join(", ");
}

import { SPECIES_LABEL } from "@/constants";
import type { PetSpecies } from "@/types";

interface PetIdentity {
  name?: string | null;
  breed?: string | null;
  species: PetSpecies;
}

const speciesTitle = (species: PetSpecies): string =>
  species === "OTHER" ? "Pet" : SPECIES_LABEL[species];

/**
 * Resolves a display label for a pet. Falls back to "Unnamed [species]" when
 * the owner left the name blank — common for newborn litters and strays.
 *   "Mochi" → "Mochi"
 *   no name, breed "Shiba mix" → "Unnamed Shiba mix"
 *   no name, no breed, species DOG → "Unnamed Dog"
 *   no name, no breed, species OTHER → "Unnamed Pet"
 */
export function petDisplayName(pet: PetIdentity): string {
  if (pet.name?.trim()) return pet.name.trim();
  if (pet.breed?.trim()) return `Unnamed ${pet.breed.trim()}`;
  return `Unnamed ${speciesTitle(pet.species)}`;
}

/** Alias of petDisplayName — kept so existing call-sites compile. */
export const petShortName = petDisplayName;

export function firstName(user: { name: string | null | undefined }): string {
  return user.name?.trim().split(/\s+/)[0] ?? "there";
}
