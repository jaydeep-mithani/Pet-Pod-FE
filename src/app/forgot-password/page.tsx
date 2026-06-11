"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ROUTES } from "@/lib/routes";
import { authService } from "@/lib/services/auth.service";
import { ApiError } from "@/lib/api/errors";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validation/auth";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=1600&q=80";

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

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await authService.requestPasswordReset(values.email);
      setSentTo(values.email);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Couldn’t send the reset email. Please try again.";
      toast.error(msg);
    }
  };

  const handleTryAgain = () => {
    // Re-render the form pre-filled with the entered value so the user can
    // correct a typo without losing context.
    setSentTo(null);
  };

  if (sentTo) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="If an account exists, a reset link is on its way."
        heroTitle="Almost back in."
        heroSubtitle="Reset links expire after 30 minutes — and only the latest one works."
        heroImageUrl={HERO_IMAGE}
        footer={FOOTER}
      >
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center text-center"
        >
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <MailCheck className="h-7 w-7 text-white" aria-hidden />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            We’ve sent a reset link to{" "}
            <span className="text-pink-600">{sentTo}</span>
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            If an account exists with that email, you’ll see it in your inbox
            within a minute.
          </p>
        </div>

        <ul className="mt-7 space-y-2.5 rounded-2xl bg-gray-50 p-5 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-pink-500" aria-hidden>
              •
            </span>
            <span>Check your spam or junk folder.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-pink-500" aria-hidden>
              •
            </span>
            <span>
              Sure you typed it right?{" "}
              <button
                type="button"
                onClick={handleTryAgain}
                className="font-medium text-pink-600 underline-offset-2 hover:underline"
              >
                Try a different email
              </button>
              .
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-pink-500" aria-hidden>
              •
            </span>
            <span>
              If you signed up with Google, there’s no password to reset — use
              the button below.
            </span>
          </li>
        </ul>

        <div className="mt-5">
          <GoogleSignInButton label="Continue with Google" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email tied to your account and we’ll send you a link."
      heroTitle="Forgot? Happens to everyone."
      heroSubtitle="One click to set a new password. The link is good for 30 minutes."
      heroImageUrl={HERO_IMAGE}
      footer={FOOTER}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="you@example.com"
          icon={Mail}
          required
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
}
