"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components";
import PasswordInput from "@/components/ui/PasswordInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api/errors";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80";

function LoginPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, status } = useAuth();

  const nextPath = params.get("next") ?? ROUTES.home;

  useEffect(() => {
    if (status === "authed") router.replace(nextPath);
  }, [status, router, nextPath]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      router.replace(nextPath);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || "Login failed");
        if (err.status === 401) {
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
