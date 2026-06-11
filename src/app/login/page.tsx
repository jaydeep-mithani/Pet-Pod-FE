"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ROUTES, postAuthRedirect } from "@/lib/routes";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api/errors";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80";

function LoginPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, status, user } = useAuth();

  const nextPath = params.get("next") ?? ROUTES.home;
  const oauthError = params.get("error") === "oauth";
  // Capture ?reset=1 synchronously via lazy state init so the banner
  // persists across the URL-cleanup effect below (which would otherwise
  // hide the banner on re-render).
  const [showResetBanner] = useState(() => params.get("reset") === "1");

  // Route through verify → welcome → next so an unverified user who logs
  // back in still gets pushed to /verify-email instead of straight home.
  useEffect(() => {
    if (status === "authed" && user) {
      router.replace(postAuthRedirect(user, nextPath));
    }
  }, [status, user, router, nextPath]);

  // Surface OAuth failures from the BE redirect (?error=oauth). One-shot —
  // we don't want the toast to re-fire on every render.
  useEffect(() => {
    if (oauthError) {
      toast.error("Couldn’t sign in with Google. Please try again.");
    }
  }, [oauthError]);

  // Strip ?reset=1 from the URL so a refresh doesn't replay the banner.
  // Local state already remembers we should be showing it this render.
  useEffect(() => {
    if (showResetBanner) {
      window.history.replaceState({}, "", ROUTES.login);
    }
  }, [showResetBanner]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const loggedIn = await login(values);
      toast.success(`Welcome back, ${loggedIn.name.split(" ")[0]}.`);
      router.replace(postAuthRedirect(loggedIn, nextPath));
    } catch (err) {
      if (err instanceof ApiError) {
        const code = (err.data as { code?: string } | null)?.code;
        toast.error(err.message || "Login failed");
        // Only mark the password field invalid for actual bad-password
        // errors. USE_GOOGLE_SIGNIN means the password was never wrong —
        // there isn't one — so the toast already explained the situation.
        if (err.status === 401 && code !== "USE_GOOGLE_SIGNIN") {
          form.setError("password", { message: "Incorrect email or password" });
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // Already-authed visitors will be redirected by the effect above; render
  // nothing in the meantime so the form doesn't flash.
  if (status === "authed") return null;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue helping pets find homes."
      heroTitle="Every pet has a story worth telling."
      heroSubtitle="Join the community giving animals a second chance — without a price tag."
      heroImageUrl={HERO_IMAGE}
      footer={
        <p className="text-center text-sm text-gray-600">
          New to Pet Pod?{" "}
          <Link
            href={ROUTES.signup}
            className="font-medium text-pink-600 hover:text-pink-700"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {showResetBanner && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
        >
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
            aria-hidden
          />
          <p>Password updated. Sign in with your new password to continue.</p>
        </div>
      )}

      <GoogleSignInButton label="Continue with Google" />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        <span>or use email</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={Mail}
          required
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          required
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />

        <div className="flex items-center justify-end text-sm">
          <Link
            href={ROUTES.forgotPassword}
            className="font-medium text-pink-600 hover:text-pink-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
