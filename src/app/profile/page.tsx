"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button, Footer, Input, Textarea } from "@/components";
import AvatarUploader from "@/components/ui/AvatarUploader";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { usersService } from "@/lib/services/users.service";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";
import { profileSchema, type ProfileValues } from "@/lib/validation/profile";

export default function ProfilePage() {
  const status = useRequireAuth();
  const { user, refresh, logout } = useAuth();
  const router = useRouter();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      bio: user?.bio ?? undefined,
      city: user?.city ?? undefined,
      region: user?.region ?? undefined,
      country: user?.country ?? undefined,
    },
    values:
      status === "authed" && user
        ? {
            name: user.name,
            bio: user.bio ?? undefined,
            city: user.city ?? undefined,
            region: user.region ?? undefined,
            country: user.country ?? undefined,
          }
        : undefined,
  });

  const handleAvatarUploaded = async (url: string) => {
    try {
      await usersService.updateMe({ avatarUrl: url });
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't save your photo.",
      );
    }
  };

  const handleAvatarCleared = async () => {
    try {
      await usersService.updateMe({ avatarUrl: null });
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't remove your photo.",
      );
    }
  };

  const onSubmit = async (values: ProfileValues) => {
    try {
      await usersService.updateMe(values);
      await refresh();
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? (err.fieldErrors[0] ?? err.message)
          : "Couldn't save your profile.",
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out.");
    router.push(ROUTES.home);
  };

  if (status !== "authed" || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white pt-28">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-28 sm:pt-32">
      <section className="bg-gradient-to-b from-rose-50/60 to-white pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            This is what other Pet Pod members see when you start a
            conversation.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-2">
              <AvatarUploader
                initialUrl={user.avatarUrl}
                onUploaded={handleAvatarUploaded}
                onCleared={handleAvatarCleared}
                size={128}
              />
              <p className="text-xs text-gray-500">
                JPG, PNG, WebP, HEIC or AVIF · up to 5 MB
              </p>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <Input
              label="Your name"
              required
              maxLength={60}
              showCount
              {...form.register("name")}
              error={form.formState.errors.name?.message}
            />
            <Textarea
              label="Bio (optional)"
              placeholder="A line or two about you and the kind of home you can offer or are looking for."
              rows={3}
              maxLength={500}
              showCount
              {...form.register("bio")}
              error={form.formState.errors.bio?.message}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Input
                label="City"
                placeholder="e.g. Austin"
                maxLength={100}
                {...form.register("city")}
                error={form.formState.errors.city?.message}
                containerClassName="sm:col-span-2"
              />
              <Input
                label="Region / state"
                placeholder="e.g. TX"
                maxLength={100}
                {...form.register("region")}
                error={form.formState.errors.region?.message}
              />
              <Input
                label="Country code"
                placeholder="US"
                {...form.register("country")}
                error={form.formState.errors.country?.message}
                containerClassName="sm:col-span-3 sm:max-w-[12rem]"
                hint="Two-letter code, e.g. US, IN, GB. Leave blank to skip."
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Session
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Signed in as {user.email}.
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="md"
                icon={<LogOut className="h-4 w-4" />}
                onClick={() => void handleLogout()}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
