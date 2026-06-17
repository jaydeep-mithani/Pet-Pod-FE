"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { APP_NAME } from "@/constants";
import { ROUTES } from "@/lib/routes";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

// The hero-photo wash is identity-defining and uses opacity-suffixed gradient
// stops that the global theme layers don't remap, so it branches here:
// playful keeps the candy pink/purple, calm gets a muted teal/stone dusk,
// bold gets a fuchsia-to-indigo neon night.
const HERO_OVERLAY: Record<MotionVibe, string> = {
  playful:
    "bg-gradient-to-br from-pink-600/70 via-rose-600/50 to-purple-700/80",
  calm: "bg-gradient-to-br from-teal-900/70 via-stone-900/45 to-stone-950/80",
  bold: "bg-gradient-to-br from-fuchsia-600/60 via-purple-950/70 to-indigo-950/85",
};

// Page background behind the form card. bg-gray-50 auto-flips dark in bold;
// calm trades the cool gray for its warm-sand stone.
const PAGE_BG: Record<MotionVibe, string> = {
  playful: "bg-gray-50",
  calm: "bg-stone-50",
  bold: "bg-gray-50",
};

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  heroImageUrl,
  children,
  footer,
  className,
}) => {
  const { vibe } = useMotionVibe();

  return (
    <div
      className={cn(
        "relative isolate flex min-h-screen w-full overflow-hidden",
        PAGE_BG[vibe],
        className,
      )}
    >
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-100 lg:opacity-0"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80 lg:hidden"
        aria-hidden
      />

      <aside
        className="relative hidden flex-1 overflow-hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
        aria-hidden
      >
        <div className={cn("absolute inset-0", HERO_OVERLAY[vibe])} />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link
            href={ROUTES.home}
            className="inline-flex items-center gap-2 self-start"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Heart className="h-5 w-5 text-white" aria-hidden />
            </div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              {heroTitle}
            </h1>
            <p className="mt-4 text-base text-white/85">{heroSubtitle}</p>
          </div>
          {vibe === "bold" ? (
            <p className="font-mono text-xs tracking-wider text-cyan-300/80">
              {"// no money. just love."}
            </p>
          ) : (
            <p className="text-xs text-white/60">No money. Just love.</p>
          )}
        </div>
      </aside>

      <main className="flex w-full items-center justify-center px-4 py-12 lg:flex-1 lg:px-12">
        <div className="w-full max-w-md">
          <Link
            href={ROUTES.home}
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
              <Heart className="h-5 w-5 text-white" aria-hidden />
            </div>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </Link>
          <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1.5 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {children}
            {footer && <div className="mt-8">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
