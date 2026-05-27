"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { ROUTES } from "@/lib/routes";

export function useRequireAuth() {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") {
      const next = encodeURIComponent(pathname);
      router.replace(`${ROUTES.login}?next=${next}`);
    }
  }, [status, router, pathname]);

  return status;
}
