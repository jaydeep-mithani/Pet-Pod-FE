"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  PawPrint,
  Settings,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useClickOutside } from "@/hooks";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/utils";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";

interface UserMenuProps {
  variant?: "light" | "dark";
}

const MENU_ITEMS = [
  { label: "Your profile", href: ROUTES.settingsProfile, icon: UserCircle },
  { label: "My listings", href: ROUTES.myListings, icon: PawPrint },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];

// The dropdown surface auto-flips dark in bold (bg-white is remapped) but its
// hairline + ring don't, so they branch: playful keeps the soft gray edge,
// calm a stone hairline, bold a neon fuchsia rim + glow.
const MENU_SURFACE: Record<MotionVibe, string> = {
  playful: "border-gray-100 ring-1 ring-black/5",
  calm: "border-stone-200 ring-1 ring-stone-200/60",
  bold: "border-fuchsia-500/40 ring-1 ring-fuchsia-500/20 shadow-[0_0_24px_-2px_rgba(217,70,239,0.45)]",
};

// Divider hairline matching the surface edge per vibe.
const MENU_DIVIDER: Record<MotionVibe, string> = {
  playful: "bg-gray-100",
  calm: "bg-stone-200",
  bold: "bg-fuchsia-500/20",
};

// Destructive logout row — red leaks (not remapped) and reads harsh on the
// bold dark surface, so it cools to a fuchsia hover there.
const LOGOUT_HOVER: Record<MotionVibe, string> = {
  playful: "text-gray-700 hover:bg-red-50 hover:text-red-700",
  calm: "text-gray-700 hover:bg-red-50 hover:text-red-700",
  bold: "text-gray-300 hover:bg-fuchsia-500/10 hover:text-fuchsia-200",
};

const UserMenu: React.FC<UserMenuProps> = ({ variant = "light" }) => {
  const { user, logout } = useAuth();
  const { vibe } = useMotionVibe();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);

  const handleLogout = useCallback(async () => {
    setOpen(false);
    await logout();
    toast.success("Signed out.");
    router.push(ROUTES.home);
  }, [logout, router]);

  if (!user) return null;

  const triggerClasses =
    variant === "dark"
      ? "text-white hover:bg-white/10"
      : "text-gray-700 hover:bg-pink-50";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors",
          triggerClasses,
        )}
      >
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
        <span className="hidden text-sm font-medium sm:inline">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border bg-white p-2 shadow-xl",
            MENU_SURFACE[vibe],
          )}
        >
          <div className="flex items-center gap-3 px-3 py-3">
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className={cn("my-1 h-px", MENU_DIVIDER[vibe])} aria-hidden />
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-pink-50 hover:text-pink-700"
              role="menuitem"
            >
              <item.icon className="h-4 w-4" aria-hidden />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className={cn("my-1 h-px", MENU_DIVIDER[vibe])} aria-hidden />
          <button
            type="button"
            onClick={handleLogout}
            role="menuitem"
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              LOGOUT_HOVER[vibe],
            )}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
