import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ROUTES } from "@/lib/routes";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=1600&q=80";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We're still building this out. In the meantime, reach out and we'll help."
      heroTitle="Sometimes a little help is all it takes."
      heroSubtitle="Email-based password reset is coming with our launch. Apologies for the detour."
      heroImageUrl={HERO_IMAGE}
      footer={
        <p className="text-center text-sm text-gray-600">
          Remembered it?{" "}
          <Link
            href={ROUTES.login}
            className="font-medium text-pink-600 hover:text-pink-700"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Password reset isn&apos;t live yet. For early access, sign up again with
        a new email or contact us directly.
      </div>
    </AuthLayout>
  );
}
