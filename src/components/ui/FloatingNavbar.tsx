"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Heart,
  Home,
  LogOut,
  Users,
  Info,
  MessageCircle,
  PawPrint,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "./Button";
import UserMenu from "./UserMenu";
import { useScrolled } from "@/hooks";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useChat } from "@/lib/chat/ChatProvider";
import { cn } from "@/utils";
import { NAVBAR_HIDDEN_ROUTES, ROUTES } from "@/lib/routes";
import { APP_NAME } from "@/constants";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PUBLIC_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: ROUTES.home, icon: Home },
  { name: "Browse", href: ROUTES.pets, icon: PawPrint },
  { name: "How it works", href: "/#how-it-works", icon: Info },
  { name: "Community", href: ROUTES.community, icon: Users },
];

const AUTHED_EXTRA_NAV_ITEMS: NavItem[] = [
  { name: "Chat", href: ROUTES.chat, icon: MessageCircle },
];

interface FloatingNavbarProps {
  className?: string;
}

// Scrolled-state surface per vibe. Each is a frosted bar pinned to the top.
// Playful and calm both go light so the bar sits cleanly over the soft page
// palette instead of dropping a stark near-black slab over pastel content;
// playful keeps a pink hairline + brand accents, calm a stone hairline. Bold
// stays a dark slab with a neon underline glow to match its electric-night
// identity. (The per-vibe strings only ever apply under their own vibe, so
// the brand-hue borders here aren't subject to the other layers' remaps.)
const SCROLLED_SURFACE: Record<MotionVibe, string> = {
  playful:
    "bg-white/85 border-b border-pink-100 shadow-sm top-0 left-0 right-0 py-3 backdrop-blur-md",
  calm: "bg-white/90 border-b border-stone-200 top-0 left-0 right-0 py-3 backdrop-blur-md",
  bold: "bg-gray-950/90 border-b border-fuchsia-500/40 shadow-[0_6px_24px_-8px_rgba(217,70,239,0.45)] top-0 left-0 right-0 py-3 backdrop-blur-md",
};

// Whether the scrolled bar reads as light (dark ink) for that vibe. Playful and
// calm are light surfaces; only bold keeps a dark slab.
const SCROLLED_IS_LIGHT: Record<MotionVibe, boolean> = {
  playful: true,
  calm: true,
  bold: false,
};

// Mobile logout leans destructive-red, which isn't remapped and reads harsh on
// bold's dark mobile card — cool it to a fuchsia hover there.
const MOBILE_LOGOUT: Record<MotionVibe, string> = {
  playful: "text-gray-700 bg-red-100 hover:bg-red-200 hover:text-red-700",
  calm: "text-gray-700 bg-red-100 hover:bg-red-200 hover:text-red-700",
  bold: "text-gray-300 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 hover:text-fuchsia-200",
};

const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ className }) => {
  const pathname = usePathname();
  const isScrolled = useScrolled(50);
  const { vibe } = useMotionVibe();
  const { status, user, logout } = useAuth();
  const { totalUnread } = useChat();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLogout = async () => {
    await logout();
    toast.success("Signed out.");
    router.push(ROUTES.home);
  };

  const shouldHide = (NAVBAR_HIDDEN_ROUTES as readonly string[]).includes(
    pathname,
  );

  if (shouldHide) return null;

  const navItems =
    status === "authed"
      ? [...PUBLIC_NAV_ITEMS, ...AUTHED_EXTRA_NAV_ITEMS]
      : PUBLIC_NAV_ITEMS;

  // The floating (top) bar is always a light surface; only the scrolled bar's
  // lightness varies by vibe (calm flips light). `darkChrome` drives the ink.
  const darkChrome = isScrolled && !SCROLLED_IS_LIGHT[vibe];

  const navAppearance = isScrolled
    ? cn(SCROLLED_SURFACE[vibe], darkChrome ? "text-white" : "text-gray-900")
    : "bg-white/90 text-gray-900 shadow-xl rounded-2xl top-4 left-4 right-4 backdrop-blur-lg";

  const linkTextClasses = darkChrome
    ? "text-white/90 hover:text-pink-200 hover:bg-white/10"
    : "text-gray-700 hover:text-pink-600 hover:bg-pink-50";

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={cn(
        "fixed z-50 transition-all duration-500 ease-in-out",
        navAppearance,
        className,
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
              <Heart className="h-5 w-5 text-white" aria-hidden />
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-colors",
                darkChrome ? "text-white" : "text-gray-900",
              )}
            >
              {APP_NAME}
            </span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  linkTextClasses,
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
                {item.href === ROUTES.chat && totalUnread > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] font-semibold text-white">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {status === "loading" ? (
              <div
                className={cn(
                  "h-8 w-20 animate-pulse rounded-full",
                  darkChrome ? "bg-white/10" : "bg-gray-100",
                )}
                aria-hidden
              />
            ) : status === "authed" && user ? (
              <UserMenu variant={darkChrome ? "dark" : "light"} />
            ) : (
              <>
                <Link href={ROUTES.login}>
                  <Button
                    variant={darkChrome ? "ghost" : "secondary"}
                    size="sm"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href={ROUTES.signup}>
                  <Button
                    variant={darkChrome ? "floating" : "primary"}
                    size="sm"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className={cn(
              "rounded-md p-2 transition-all lg:hidden",
              linkTextClasses,
            )}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
          isMobileMenuOpen ? "max-h-[520px]" : "max-h-0",
        )}
      >
        <div className="space-y-1 border-t border-black/5 px-3 pb-4 pt-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobile}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium transition-all",
                linkTextClasses,
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.href === ROUTES.chat && totalUnread > 0 && (
                <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] font-semibold text-white">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </Link>
          ))}
          <div className="space-y-2 pt-3">
            {status === "authed" && user ? (
              <div className="rounded-xl bg-pink-50 p-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={ROUTES.profile}
                    onClick={closeMobile}
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Link
                    href={ROUTES.myListings}
                    onClick={closeMobile}
                    className="flex-1"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      My listings
                    </Button>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    void handleMobileLogout();
                  }}
                  className={cn(
                    "mt-3 flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
                    MOBILE_LOGOUT[vibe],
                  )}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Log out
                </button>
              </div>
            ) : status === "guest" ? (
              <>
                <Link
                  href={ROUTES.signup}
                  onClick={closeMobile}
                  className="block"
                >
                  <Button
                    variant={darkChrome ? "floating" : "primary"}
                    size="md"
                    className="w-full"
                  >
                    Sign up
                  </Button>
                </Link>
                <Link
                  href={ROUTES.login}
                  onClick={closeMobile}
                  className="block"
                >
                  <Button
                    variant={darkChrome ? "ghost" : "secondary"}
                    size="md"
                    className="w-full"
                  >
                    Log in
                  </Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FloatingNavbar;
