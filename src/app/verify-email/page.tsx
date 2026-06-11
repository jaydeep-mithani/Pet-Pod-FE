"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Modal } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { authService } from "@/lib/services/auth.service";
import { ApiError } from "@/lib/api/errors";
import { ROUTES, postAuthRedirect } from "@/lib/routes";

const RESEND_COOLDOWN_SECONDS = 60;
const CODE_LENGTH = 6;

function VerifyEmailContent() {
  const status = useRequireAuth();
  const { user, logout, refresh } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const nextPath = params.get("next");

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newEmailError, setNewEmailError] = useState<string | null>(null);
  const [changingEmail, setChangingEmail] = useState(false);
  // Guard against double-firing the initial send under React strict mode.
  const initialSendFired = useRef(false);

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }, []);

  // Send the first code on mount (covers freshly-signed-up users who land
  // here via the post-auth redirect). The BE swallows duplicate sends within
  // the rate limit, so resilient against StrictMode double-mount.
  useEffect(() => {
    if (status !== "authed" || !user) return;
    if (user.emailVerified) return;
    if (initialSendFired.current) return;
    initialSendFired.current = true;

    void (async () => {
      try {
        await authService.sendVerificationCode();
        startCooldown();
      } catch (err) {
        // 429 here means the user already requested a code recently — that's
        // fine, they may have come back to /verify-email with one already in
        // their inbox. Don't toast.
        if (err instanceof ApiError && err.status === 429) {
          startCooldown();
          return;
        }
        const msg =
          err instanceof ApiError
            ? err.message
            : "Couldn't send the verification email.";
        toast.error(msg);
      }
    })();
  }, [status, user, startCooldown]);

  // Cooldown ticker for the resend button.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  // If the user is already verified (came here via stale link / refresh),
  // bounce them on. Use the centralised post-auth redirect.
  useEffect(() => {
    if (status !== "authed" || !user) return;
    if (user.emailVerified) {
      router.replace(postAuthRedirect(user, nextPath ?? ROUTES.home));
    }
  }, [status, user, router, nextPath]);

  const handleCodeChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) {
      toast.error(`Enter all ${CODE_LENGTH} digits.`);
      return;
    }
    setSubmitting(true);
    try {
      await authService.checkVerificationCode(code);
      await refresh();
      toast.success("Email verified.");
      // Route resolution happens via the verified-redirect effect above
      // once `refresh()` flips user.emailVerified.
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Couldn't verify the code.";
      toast.error(msg);
      setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await authService.sendVerificationCode();
      toast.success("New code sent — check your inbox.");
      startCooldown();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Couldn't resend the code.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      router.replace(ROUTES.login);
    } catch {
      setSigningOut(false);
    }
  };

  const openEditEmail = () => {
    setNewEmail(user?.email ?? "");
    setNewEmailError(null);
    setEditEmailOpen(true);
  };

  const closeEditEmail = () => {
    if (changingEmail) return;
    setEditEmailOpen(false);
    setNewEmailError(null);
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) {
      setNewEmailError("Email is required.");
      return;
    }
    if (trimmed === user?.email) {
      setNewEmailError("That’s your current email.");
      return;
    }
    setChangingEmail(true);
    setNewEmailError(null);
    try {
      const result = await authService.changeUnverifiedEmail(trimmed);
      await refresh();
      // Reset OTP input + cooldown — the old code is gone, a fresh one was
      // just sent to the new address.
      setCode("");
      startCooldown();
      toast.success(`Code sent to ${result.email}.`);
      setEditEmailOpen(false);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Couldn’t update the email.";
      setNewEmailError(msg);
    } finally {
      setChangingEmail(false);
    }
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <MailCheck className="h-7 w-7 text-white" aria-hidden />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-pink-600">
            One last step
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-900">{user.email}</span>.
            Enter it below to unlock listing pets and starting conversations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="otp" className="sr-only">
              6-digit verification code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={CODE_LENGTH}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="••••••"
              autoFocus
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5 text-center font-mono text-3xl font-bold tracking-[0.6em] text-gray-900 placeholder:text-gray-300 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-500/15"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting || code.length !== CODE_LENGTH}
            className="w-full"
          >
            {submitting ? "Verifying…" : "Verify email"}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={cooldown > 0 || resending}
            className="font-medium text-pink-600 hover:text-pink-700 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400"
          >
            {resending
              ? "Sending…"
              : cooldown > 0
                ? `Resend code in ${cooldown}s`
                : "Resend code"}
          </button>
          <p className="text-xs text-gray-500">
            Typo in your email?{" "}
            <button
              type="button"
              onClick={openEditEmail}
              className="font-medium text-gray-700 underline-offset-2 hover:underline"
            >
              Change it
            </button>
            <span className="mx-1.5 text-gray-300">·</span>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="font-medium text-gray-700 underline-offset-2 hover:underline disabled:cursor-not-allowed"
            >
              Sign out
            </button>
          </p>
        </div>
      </div>

      <Modal open={editEmailOpen} onClose={closeEditEmail}>
        <form onSubmit={handleChangeEmail} className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Change your email
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
              We’ll send a fresh verification code to the new address. The code
              we sent to{" "}
              <span className="font-medium text-gray-800">{user.email}</span>{" "}
              will stop working.
            </p>
          </div>

          <Input
            label="New email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={Mail}
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            error={newEmailError ?? undefined}
            autoFocus
          />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={closeEditEmail}
              disabled={changingEmail}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changingEmail || !newEmail.trim()}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-pink-600 hover:to-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingEmail ? "Updating…" : "Update and resend"}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100">
          <p className="text-sm text-gray-600">Loading…</p>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
