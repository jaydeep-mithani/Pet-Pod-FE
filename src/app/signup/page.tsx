"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ROUTES, postAuthRedirect } from "@/lib/routes";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api/errors";
import { signupSchema, type SignupValues } from "@/lib/validation/auth";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=80";

export default function SignupPage() {
  const router = useRouter();
  const { signup, status, user } = useAuth();

  // Once authed, route through the verify → welcome → home chain. Centralised
  // in postAuthRedirect so signup / login / welcome all agree.
  useEffect(() => {
    if (status === "authed" && user) {
      router.replace(postAuthRedirect(user));
    }
  }, [status, user, router]);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupValues) => {
    try {
      const created = await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success(`Welcome, ${created.name.split(" ")[0]}.`);
      // The auto-redirect useEffect will route to /verify-email (we just
      // emailed them a code).
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || "Signup failed");
        if (err.status === 409) {
          form.setError("email", { message: "Email is already in use" });
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
      title="Create your account"
      subtitle="It takes 30 seconds. No payment info, ever."
      heroTitle="Open a door for a pet who needs one."
      heroSubtitle="Browse, message, and meet. The rest is just two people doing the right thing."
      heroImageUrl={HERO_IMAGE}
      footer={
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={ROUTES.login}
            className="font-medium text-pink-600 hover:text-pink-700"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <GoogleSignInButton label="Sign up with Google" />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        <span>or use email</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Your name"
          autoComplete="name"
          placeholder="Alex Morgan"
          icon={UserIcon}
          required
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Mix letters, numbers, and a symbol for a stronger password."
          required
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Type it again"
          required
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to be kind to animals and to other
          people on the platform.
        </p>
      </form>
    </AuthLayout>
  );
}
