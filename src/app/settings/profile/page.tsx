"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, Input, Textarea } from "@/components";
import AvatarUploader from "@/components/ui/AvatarUploader";
import SettingsSection from "../SettingsSection";
import { useAuth } from "@/lib/auth/AuthProvider";
import { usersService } from "@/lib/services/users.service";
import { ApiError } from "@/lib/api/errors";
import { profileSchema, type ProfileValues } from "@/lib/validation/profile";
import { celebrate } from "@/lib/motion";

export default function SettingsProfilePage() {
  const { user, status, refresh } = useAuth();

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
      celebrate();
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? (err.fieldErrors[0] ?? err.message)
          : "Couldn't save your profile.",
      );
    }
  };

  if (!user) return null;

  return (
    <>
      <SettingsSection
        title="Photo"
        description="Shown on your listings and in conversations."
      >
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
      </SettingsSection>

      <SettingsSection
        title="Public profile"
        description="This is what other Pet Pod members see when you start a conversation."
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
      </SettingsSection>
    </>
  );
}
