"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, PawPrint, UserCircle } from "lucide-react";
import { toast } from "sonner";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useClickOutside } from "@/hooks";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/utils";

interface UserMenuProps {
  variant?: "light" | "dark";
}

const MENU_ITEMS = [
  { label: "Your profile", href: ROUTES.profile, icon: UserCircle },
  { label: "My listings", href: ROUTES.myListings, icon: PawPrint },
];

const UserMenu: React.FC<UserMenuProps> = ({ variant = "light" }) => {
  const { user, logout } = useAuth();
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
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5"
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
          <div className="my-1 h-px bg-gray-100" aria-hidden />
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
          <div className="my-1 h-px bg-gray-100" aria-hidden />
          <button
            type="button"
            onClick={handleLogout}
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700"
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
