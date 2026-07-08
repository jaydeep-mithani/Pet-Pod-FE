"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, LogOut, MailWarning } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrength from "@/components/ui/PasswordStrength";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SettingsSection from "../SettingsSection";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authService } from "@/lib/services/auth.service";
import { usersService } from "@/lib/services/users.service";
import { ApiError } from "@/lib/api/errors";
import { ROUTES } from "@/lib/routes";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import {
  makeChangePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validation/auth";
import { cn } from "@/utils";

// Status chips. emerald/amber aren't remapped by the theme layers (they'd
// clash on bold's dark card), so they branch per vibe like elsewhere.
const VERIFIED_CHIP: Record<MotionVibe, string> = {
  playful: "bg-emerald-50 text-emerald-700",
  calm: "bg-teal-50 text-teal-800",
  bold: "bg-cyan-500/10 text-cyan-300",
};

const UNVERIFIED_CHIP: Record<MotionVibe, string> = {
  playful: "bg-amber-50 text-amber-700",
  calm: "bg-stone-100 text-stone-700",
  bold: "bg-fuchsia-500/15 text-fuchsia-300",
};

export default function SettingsAccountPage() {
  const { user, refresh, logout } = useAuth();
  const router = useRouter();
  const { vibe } = useMotionVibe();

  const hasPassword = user?.hasPassword ?? true;

  // --- Change / set password -------------------------------------------
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(makeChangePasswordSchema(hasPassword)),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const newPw = useWatch({ control: form.control, name: "newPassword" });

  const onChangePassword = async (values: ChangePasswordValues) => {
    try {
      await authService.changePassword({
        currentPassword: hasPassword ? values.currentPassword : undefined,
        newPassword: values.newPassword,
      });
      form.reset();
      await refresh(); // Google-only accounts flip hasPassword → true
      toast.success(
        hasPassword
          ? "Password updated. Other devices were signed out."
          : "Password set. You can now sign in with email too.",
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        form.setError("currentPassword", {
          message: "Current password is incorrect",
        });
      } else {
        toast.error(
          err instanceof ApiError
            ? err.message
            : "Couldn't update your password.",
        );
      }
    }
  };

  // --- Sessions ----------------------------------------------------------
  const [signingOutOthers, setSigningOutOthers] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out.");
    router.push(ROUTES.home);
  };

  const handleLogoutAll = async () => {
    setSigningOutOthers(true);
    try {
      const { revoked } = await authService.logoutAll();
      toast.success(
        revoked > 0
          ? `Signed out ${revoked} other ${revoked === 1 ? "session" : "sessions"}.`
          : "No other active sessions.",
      );
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't sign out sessions.",
      );
    } finally {
      setSigningOutOthers(false);
    }
  };

  // --- Danger zone --------------------------------------------------------
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteAck, setDeleteAck] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteArmed = hasPassword
    ? deletePassword.length > 0
    : deleteAck.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await usersService.deleteMe(hasPassword ? deletePassword : undefined);
      await logout(); // clears local auth state; BE cookies are already gone
      toast.success("Your account has been deleted. Take care out there.");
      router.replace(ROUTES.home);
    } catch (err) {
      setConfirmOpen(false);
      toast.error(
        err instanceof ApiError && err.status === 401
          ? "That password is incorrect."
          : err instanceof ApiError
            ? err.message
            : "Couldn't delete your account.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <SettingsSection
        title="Email"
        description="Used to sign in and for account notifications."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 truncate text-sm font-medium text-gray-900">
            {user.email}
          </p>
          {user.emailVerified ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                VERIFIED_CHIP[vibe],
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Verified
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                UNVERIFIED_CHIP[vibe],
              )}
            >
              <MailWarning className="h-3.5 w-3.5" aria-hidden />
              Not verified
            </span>
          )}
        </div>
        {!user.emailVerified && (
          <div className="mt-4">
            <Link href={ROUTES.verifyEmail}>
              <Button type="button" variant="primary" size="sm">
                Verify email
              </Button>
            </Link>
          </div>
        )}
        <p className="mt-4 text-xs text-gray-500">
          {user.emailVerified
            ? "Changing a verified email isn't supported yet — contact us if you need to."
            : "You can change this address on the verification screen."}
        </p>
      </SettingsSection>

      <SettingsSection
        title={hasPassword ? "Password" : "Set a password"}
        description={
          hasPassword
            ? "Changing your password signs you out on every other device."
            : "You signed up with Google. Set a password to also sign in with email — this signs out other devices."
        }
      >
        <form
          onSubmit={form.handleSubmit(onChangePassword)}
          className="max-w-md space-y-5"
        >
          {/* Helps password managers bind the new credential to the account. */}
          <input
            type="email"
            name="username"
            autoComplete="username"
            className="hidden"
            aria-hidden
            tabIndex={-1}
            readOnly
            value={user.email}
          />

          {hasPassword && (
            <PasswordInput
              label="Current password"
              autoComplete="current-password"
              placeholder="Your current password"
              icon={KeyRound}
              required
              {...form.register("currentPassword")}
              error={form.formState.errors.currentPassword?.message}
            />
          )}
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            placeholder="At least 10 characters"
            required
            {...form.register("newPassword")}
            error={form.formState.errors.newPassword?.message}
            footer={<PasswordStrength value={newPw ?? ""} />}
          />
          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Type it again"
            required
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Saving…"
                : hasPassword
                  ? "Update password"
                  : "Set password"}
            </Button>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Connected accounts"
        description="Sign-in methods linked to this account."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Google</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {user.googleLinked
                ? "You can sign in with your Google account."
                : "Sign in with Google using this email and it will link automatically."}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              user.googleLinked ? VERIFIED_CHIP[vibe] : UNVERIFIED_CHIP[vibe],
            )}
          >
            {user.googleLinked ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Connected
              </>
            ) : (
              "Not connected"
            )}
          </span>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Sessions"
        description={`Signed in as ${user.email}.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={<LogOut className="h-4 w-4" />}
            onClick={() => void handleLogout()}
          >
            Sign out
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={signingOutOthers}
            onClick={() => void handleLogoutAll()}
          >
            {signingOutOthers ? "Signing out…" : "Sign out other devices"}
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Danger zone"
        tone="danger"
        description="Deleting your account removes your profile, takes down your listings, and signs you out everywhere. Your conversations stay readable for the people you talked to, attributed to “Deleted user”. This can't be undone."
      >
        <div className="max-w-md space-y-4">
          {hasPassword ? (
            <PasswordInput
              label="Confirm your password"
              autoComplete="current-password"
              placeholder="Required to delete"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          ) : (
            <div>
              <label
                htmlFor="delete-ack"
                className="block text-sm font-medium text-gray-800"
              >
                Type <span className="font-semibold">DELETE</span> to confirm
              </label>
              <input
                id="delete-ack"
                type="text"
                value={deleteAck}
                onChange={(e) => setDeleteAck(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="DELETE"
              />
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={!deleteArmed || deleting}
            onClick={() => setConfirmOpen(true)}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Delete my account
          </Button>
        </div>
      </SettingsSection>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        tone="danger"
        title="Delete your account?"
        description="This permanently removes your profile and listings and signs you out everywhere. People you've talked to keep the conversation, shown as “Deleted user”. There's no way back."
        confirmLabel="Delete my account"
        cancelLabel="Keep my account"
      />
    </>
  );
}
