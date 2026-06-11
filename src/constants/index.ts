import type { PetSize, PetSpecies, PetStatus } from "@/types";

export const APP_NAME = "Pet Pod";

export const APP_TAGLINE = "Every pet deserves a home. No money. Just love.";

export const APP_DESCRIPTION =
  "Pet Pod connects people who can't keep their pets with people who can. A safe, money-free way to give animals a second chance.";

export const SPECIES_LABEL: Record<PetSpecies, string> = {
  DOG: "Dog",
  CAT: "Cat",
  RABBIT: "Rabbit",
  BIRD: "Bird",
  SMALL: "Small pet",
  OTHER: "Other",
};

export const SPECIES_EMOJI: Record<PetSpecies, string> = {
  DOG: "🐕",
  CAT: "🐈",
  RABBIT: "🐇",
  BIRD: "🦜",
  SMALL: "🐹",
  OTHER: "🐾",
};

export const SIZE_LABEL: Record<PetSize, string> = {
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
};

export const STATUS_LABEL: Record<PetStatus, string> = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  ADOPTED: "Adopted",
};

export const SPECIES_OPTIONS = (Object.keys(SPECIES_LABEL) as PetSpecies[]).map(
  (value) => ({ value, label: SPECIES_LABEL[value] }),
);

export const SIZE_OPTIONS = (Object.keys(SIZE_LABEL) as PetSize[]).map(
  (value) => ({ value, label: SIZE_LABEL[value] }),
);

export const STATUS_OPTIONS = (Object.keys(STATUS_LABEL) as PetStatus[]).map(
  (value) => ({ value, label: STATUS_LABEL[value] }),
);

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Post or browse",
    description:
      "Share your pet's story if you need to rehome them, or browse pets near you waiting for a second chance.",
  },
  {
    step: 2,
    title: "Chat directly",
    description:
      "Message the current owner. Ask questions, share your home, and make sure it's the right fit — for both of you.",
  },
  {
    step: 3,
    title: "Meet and adopt",
    description:
      "Arrange a meeting on your own terms. When you both agree, the pet goes home — no fees, no marketplace, just trust.",
  },
] as const;

export const WHY_NO_MONEY_REASONS = [
  {
    title: "No price tag, no incentive to mislead",
    description:
      "When money's off the table, owners share the real reason for rehoming and adopters share the real reason they're ready. Honesty is the default.",
  },
  {
    title: "We're not a marketplace",
    description:
      "Pets aren't products. We don't take a cut, we don't run auctions, and we don't let anyone profit off animals on this platform.",
  },
  {
    title: "Built for safety",
    description:
      "Every conversation happens in-app. You control what you share and when you meet. We never expose contact details until you choose to.",
  },
] as const;

export const MISSION_BELIEFS = [
  {
    title: "Rehoming is an act of love",
    description:
      "Giving up a pet isn't failure — it's recognising that they deserve more than you can give right now. We exist to make that decision easier, not harder.",
  },
  {
    title: "Every adoption is a conversation",
    description:
      "A good match doesn't come from filters and reviews. It comes from honest questions, shared photos, and time spent getting to know each other before you meet.",
  },
  {
    title: "No one should profit from a pet",
    description:
      "Backyard breeders, kitten-flipping listings, scam adopters — they all rely on money changing hands. Take money out and most of the bad actors leave with it.",
  },
] as const;

export type ResourceAudience = "rehomer" | "adopter";

export const COMMUNITY_RESOURCES: Array<{
  audience: ResourceAudience;
  title: string;
  description: string;
}> = [
  {
    audience: "rehomer",
    title: "Writing a listing adopters will trust",
    description:
      "Lead with the real reason you're rehoming. Share medical history, quirks, what they love, what they hate. Adopters reward honesty — and it filters out everyone who isn't a real fit.",
  },
  {
    audience: "rehomer",
    title: "Vetting an adopter without grilling them",
    description:
      "Ask about their schedule, other pets, kids, and what they'd do if it doesn't work out. The answers to that last question tell you everything.",
  },
  {
    audience: "rehomer",
    title: "Handing over the paperwork",
    description:
      "Vet records, vaccination history, microchip transfer, food + routine notes. Print or share digitally — the new owner needs a few weeks of continuity to make the transition smooth.",
  },
  {
    audience: "adopter",
    title: "Asking the right questions before you meet",
    description:
      "Why are they rehoming? How long have they had the pet? How does the pet behave around new people, kids, other animals? If something feels off, trust that.",
  },
  {
    audience: "adopter",
    title: "Preparing your home for the first week",
    description:
      "A quiet corner, the same food they're used to, no overwhelming visitors, plenty of patience. Most pets need 3 weeks to feel safe in a new home — go slow.",
  },
  {
    audience: "adopter",
    title: "When the match isn't right",
    description:
      "It's rare, but it happens. The kindest thing is to be honest early. Talk to the rehomer first — most are happy to take their pet back if it isn't working out.",
  },
];
