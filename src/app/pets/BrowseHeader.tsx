"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button, SectionHeading } from "@/components";
import { ROUTES } from "@/lib/routes";
import { useMotionVibe } from "@/lib/motion";

const EYEBROW = "Pets near you";
const TITLE = "Looking for a new home";
const SUBTITLE =
  "Real animals shared by their current owners. Read the story, message the owner, and meet on your own terms.";

function ListButton() {
  return (
    <Link href={ROUTES.newListing}>
      <Button
        variant="primary"
        size="md"
        icon={<PlusCircle className="h-5 w-5" />}
      >
        List a pet
      </Button>
    </Link>
  );
}

const BrowseHeader: React.FC = () => {
  const { vibe } = useMotionVibe();

  // Bold: mono cyan eyebrow + outline-stroke accent on a dark stage.
  if (vibe === "bold") {
    return (
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
            {"// browse"}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Looking for a{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #e879f9" }}
            >
              new home
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400">
            {SUBTITLE}
          </p>
        </div>
        <ListButton />
      </div>
    );
  }

  // Calm: editorial — quiet uppercase eyebrow, serif heading (auto), hairline
  // rule under the lede, no ornament.
  if (vibe === "calm") {
    return (
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-teal-700">
            {EYEBROW}
          </p>
          <h1 className="mt-5 text-4xl leading-tight tracking-tight text-gray-900 sm:text-5xl">
            {TITLE}
          </h1>
          <div className="mt-6 h-px w-20 bg-teal-700/40" aria-hidden />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-600">
            {SUBTITLE}
          </p>
        </div>
        <ListButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <SectionHeading
        align="left"
        eyebrow={EYEBROW}
        title={TITLE}
        subtitle={SUBTITLE}
        className="!mx-0"
      />
      <ListButton />
    </div>
  );
};

export default BrowseHeader;
