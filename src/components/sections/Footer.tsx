import Link from "next/link";
import { Heart } from "lucide-react";
import { APP_NAME } from "@/constants";
import { ROUTES } from "@/lib/routes";

const FOOTER_LINKS = {
  platform: [
    { label: "Browse pets", href: ROUTES.pets },
    { label: "Rehome a pet", href: ROUTES.newListing },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Community", href: ROUTES.community },
  ],
  account: [
    { label: "Sign up", href: ROUTES.signup },
    { label: "Log in", href: ROUTES.login },
    { label: "Your profile", href: ROUTES.profile },
  ],
};

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href={ROUTES.home} className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
                <Heart className="h-5 w-5 text-white" aria-hidden />
              </div>
              <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-gray-600">
              A safe, money-free space where pets find new homes through honest
              conversations between people who care.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Platform</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-pink-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Account</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-pink-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {year} {APP_NAME}. Made with care for animals everywhere.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
