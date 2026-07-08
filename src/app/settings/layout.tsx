"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, Palette, PawPrint, UserCircle } from "lucide-react";
import { Footer } from "@/components";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { ROUTES } from "@/lib/routes";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

const NAV_ITEMS = [
  { label: "Profile", href: ROUTES.settingsProfile, icon: UserCircle },
  { label: "Account", href: ROUTES.settingsAccount, icon: KeyRound },
  { label: "Appearance", href: ROUTES.settingsAppearance, icon: Palette },
  { label: "Listings", href: ROUTES.settingsListings, icon: PawPrint },
] as const;

// Active/idle nav chrome per vibe — brand tint when active, quiet neutral
// otherwise. Records instead of remaps because these hues are identity hues.
const NAV_ACTIVE: Record<MotionVibe, string> = {
  playful: "bg-pink-50 text-pink-700",
  calm: "bg-teal-50 text-teal-800",
  bold: "border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300",
};

const NAV_IDLE: Record<MotionVibe, string> = {
  playful: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
  calm: "text-gray-600 hover:bg-stone-50 hover:text-gray-900",
  bold: "text-gray-400 hover:bg-white/5 hover:text-gray-200",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useRequireAuth();
  const pathname = usePathname();
  const { vibe } = useMotionVibe();

  if (status !== "authed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white pt-28">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-28 sm:pt-32">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {vibe === "bold" && (
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
              {"// settings"}
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Your account, preferences, and listings — all in one place.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Mobile: horizontal pills; desktop: sticky side rail. */}
            <nav
              aria-label="Settings sections"
              className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:block lg:w-52 lg:shrink-0 lg:space-y-1 lg:self-start lg:overflow-visible lg:px-0 lg:sticky lg:top-28"
            >
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                      active ? NAV_ACTIVE[vibe] : NAV_IDLE[vibe],
                    )}
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="min-w-0 flex-1 space-y-8">{children}</div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
