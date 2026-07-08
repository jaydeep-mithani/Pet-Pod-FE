"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrength from "@/components/ui/PasswordStrength";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authService } from "@/lib/services/auth.service";
import { ApiError } from "@/lib/api/errors";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validation/auth";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=1600&q=80";

// amber isn't remapped (it would stay light-warm on bold's dark card and clash
// with calm's teal), so the warning surfaces branch per vibe. calm keeps a
// quiet sand-amber, bold goes neon-fuchsia warning.
const WARN_ICON: Record<MotionVibe, string> = {
  playful: "bg-amber-100 text-amber-700",
  calm: "bg-stone-100 text-stone-600",
  bold: "bg-fuchsia-500/15 text-fuchsia-300",
};

const WARN_BANNER: Record<MotionVibe, string> = {
  playful: "border-amber-200 bg-amber-50 text-amber-900",
  calm: "border-stone-200 bg-stone-50 text-stone-700",
  bold: "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-100",
};

// hover:bg-gray-50 isn't remapped in bold (it would flash light-on-dark), so
// the Cancel link's neutral hover branches per vibe.
const NEUTRAL_HOVER: Record<MotionVibe, string> = {
  playful: "hover:bg-gray-50",
  calm: "hover:bg-stone-50",
  bold: "hover:border-fuchsia-500/40 hover:bg-white/5",
};

// "Passwords match" affirmation. emerald isn't remapped, so it keys per vibe.
const MATCH_TEXT: Record<MotionVibe, string> = {
  playful: "text-emerald-600",
  calm: "text-teal-700",
  bold: "text-cyan-300",
};

const FOOTER = (
  <p className="text-center text-sm text-gray-600">
    Remembered it?{" "}
    <Link
      href={ROUTES.login}
      className="font-medium text-pink-600 hover:text-pink-700"
    >
      Back to sign in
    </Link>
  </p>
);

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, status } = useAuth();
  const { vibe } = useMotionVibe();

  // Capture token from the URL synchronously, once, via lazy state init.
  // The empty string means "no token in URL"; a non-empty string is the
  // captured plaintext. We never re-read params afterwards, so navigating
  // away and back with a different token is intentionally a no-op.
  const [token] = useState<string>(() => params.get("token") ?? "");

  // Logged-in users need to acknowledge that proceeding will sign them out
  // everywhere. We don't auto-proceed.
  const [ackProceed, setAckProceed] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  // Live "passwords match" feedback. useWatch subscribes to changes without
  // the compiler-rule issues that `form.watch()` triggers.
  const watchedPw = useWatch({ control: form.control, name: "password" });
  const watchedConfirm = useWatch({
    control: form.control,
    name: "confirmPassword",
  });
  const passwordsMatch =
    (watchedPw ?? "").length > 0 &&
    (watchedConfirm ?? "").length > 0 &&
    watchedPw === watchedConfirm;

  // Strip the token from the URL on mount so it doesn't leak via Referer
  // headers, browser history, or any future analytics on this page. We
  // already have it in component state — the URL no longer needs it.
  useEffect(() => {
    if (token) {
      window.history.replaceState({}, "", ROUTES.resetPassword);
    }
  }, [token]);

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) return;
    try {
      await authService.resetPassword(token, values.password);
      toast.success(
        "Password updated. We’ve signed you out everywhere for safety.",
      );
      router.replace(`${ROUTES.login}?reset=1`);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(msg);
      // Clear the password fields so a re-submit doesn't accidentally
      // double-submit with a token that's now consumed/invalid.
      form.reset({ password: "", confirmPassword: "" });
    }
  };

  // Missing token (link malformed, or this page was reloaded after we
  // stripped the token from the URL — we can't recover the token in either
  // case, so the user has to request a fresh link).
  if (!token) {
    return (
      <AuthLayout
        title="This link looks broken"
        subtitle="The reset link is missing its token — most likely it expired or was used."
        heroTitle="Need a fresh start?"
        heroSubtitle="Request a new reset link and try again."
        heroImageUrl={HERO_IMAGE}
        footer={FOOTER}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${WARN_ICON[vibe]}`}
          >
            <ShieldAlert className="h-7 w-7" aria-hidden />
          </div>
          <p className="text-sm text-gray-600">
            Reset links expire after 30 minutes and can only be used once.
          </p>
        </div>
        <div className="mt-7">
          <Link href={ROUTES.forgotPassword} className="block">
            <Button type="button" size="lg" className="w-full">
              Request a new link
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Logged-in interstitial — make the side-effect (force-logout) explicit
  // before the user submits.
  if (status === "authed" && user && !ackProceed) {
    return (
      <AuthLayout
        title="You’re already signed in"
        subtitle="Continuing will reset your password and sign you out everywhere."
        heroTitle="Resetting from a signed-in session."
        heroSubtitle="For your security, we’ll end all active sessions on this account."
        heroImageUrl={HERO_IMAGE}
        footer={FOOTER}
      >
        <div className={`rounded-2xl border p-4 text-sm ${WARN_BANNER[vibe]}`}>
          You’re signed in as <span className="font-medium">{user.email}</span>.
          After you set a new password, you’ll be signed out on every device —
          including this one — and asked to log back in.
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={ROUTES.home}
            className={`inline-flex flex-1 items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors ${NEUTRAL_HOVER[vibe]}`}
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => setAckProceed(true)}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-md"
          >
            Continue
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Use at least 10 characters. Pick something you’ll actually remember."
      heroTitle="One step to get back in."
      heroSubtitle="Setting a new password also signs you out everywhere else, for safety."
      heroImageUrl={HERO_IMAGE}
      footer={FOOTER}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/*
          Hidden username field bound to autocomplete so password managers
          associate the new credential with the correct account. We don't
          know the user's email here (we only have a token), so leave empty
          — managers will still group by site origin.
        */}
        <input
          type="email"
          name="username"
          autoComplete="username"
          className="hidden"
          aria-hidden
          tabIndex={-1}
          readOnly
          value=""
        />

        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="At least 10 characters"
          icon={KeyRound}
          required
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />
        <PasswordStrength value={watchedPw ?? ""} />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Type it again"
          required
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        {passwordsMatch && (
          <p
            className={`flex items-center gap-1.5 text-xs font-medium ${MATCH_TEXT[vibe]}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Passwords match
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? "Updating…" : "Update password"}
        </Button>

        <p className="text-center text-xs text-gray-500">
          This link expires 30 minutes after it was sent.
        </p>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          title="Reset your password"
          subtitle="Loading…"
          heroTitle="Almost there."
          heroSubtitle="Just verifying your link."
          heroImageUrl={HERO_IMAGE}
          footer={FOOTER}
        >
          <p className="text-sm text-gray-500">Loading…</p>
        </AuthLayout>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
