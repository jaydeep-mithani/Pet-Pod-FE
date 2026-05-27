import Link from "next/link";
import { Heart } from "lucide-react";
import { APP_NAME } from "@/constants";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/utils";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  heroImageUrl,
  children,
  footer,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative isolate flex min-h-screen w-full overflow-hidden bg-gray-50",
        className,
      )}
    >
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-100 lg:opacity-0"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80 lg:hidden" aria-hidden />

      <aside
        className="relative hidden flex-1 overflow-hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/70 via-rose-600/50 to-purple-700/80" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link
            href={ROUTES.home}
            className="inline-flex items-center gap-2 self-start"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Heart className="h-5 w-5 text-white" aria-hidden />
            </div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              {heroTitle}
            </h1>
            <p className="mt-4 text-base text-white/85">{heroSubtitle}</p>
          </div>
          <p className="text-xs text-white/60">
            No money. Just love.
          </p>
        </div>
      </aside>

      <main className="flex w-full items-center justify-center px-4 py-12 lg:flex-1 lg:px-12">
        <div className="w-full max-w-md">
          <Link
            href={ROUTES.home}
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
              <Heart className="h-5 w-5 text-white" aria-hidden />
            </div>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </Link>
          <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1.5 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {children}
            {footer && <div className="mt-8">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
