"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components";
import AvatarUploader from "@/components/ui/AvatarUploader";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { usersService } from "@/lib/services/users.service";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";
import { firstName } from "@/utils";

export default function WelcomePage() {
  const status = useRequireAuth();
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [continuing, setContinuing] = useState(false);

  // /welcome is the avatar-onboarding step; verification gates it. If a user
  // lands here unverified (e.g. via stale link or back button), push them
  // back to /verify-email.
  useEffect(() => {
    if (status === "authed" && user && !user.emailVerified) {
      router.replace(ROUTES.verifyEmail);
    }
  }, [status, user, router]);

  const handleUploaded = async (url: string) => {
    try {
      await usersService.updateMe({ avatarUrl: url });
      await refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Couldn't save your photo.";
      toast.error(msg);
    }
  };

  const handleCleared = async () => {
    try {
      await usersService.updateMe({ avatarUrl: null });
      await refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Couldn't remove your photo.";
      toast.error(msg);
    }
  };

  const handleContinue = async () => {
    setContinuing(true);
    router.push(ROUTES.home);
  };

  if (status !== "authed" || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100">
        <p className="text-sm text-gray-600">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">
            Welcome to Pet Pod
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Nice to meet you, {firstName(user)}.
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Add a photo so the people you message can put a face to your name.
            You can skip this and add one later.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <AvatarUploader
            initialUrl={user.avatarUrl}
            onUploaded={handleUploaded}
            onCleared={handleCleared}
            size={144}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => void handleContinue()}
            disabled={continuing}
            className="min-w-[200px]"
          >
            {continuing ? "Going home…" : "Continue to Pet Pod"}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-gray-500">
          You can add or change your photo any time from your profile.
        </p>
      </div>
    </main>
  );
}
