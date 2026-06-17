export const ROUTES = {
  home: "/",
  community: "/community",
  pets: "/pets",
  petDetail: (id: string) => `/pets/${id}`,
  newListing: "/pets/new",
  chat: "/chat",
  conversation: (id: string) => `/chat/${id}`,
  profile: "/profile",
  myListings: "/profile/listings",
  publicProfile: (id: string) => `/profile/${id}`,
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  welcome: "/welcome",
  verifyEmail: "/verify-email",
} as const;

export const AUTH_FREE_ROUTES = [
  ROUTES.login,
  ROUTES.signup,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
] as const;

export const NAVBAR_HIDDEN_ROUTES = [
  ...AUTH_FREE_ROUTES,
  ROUTES.welcome,
  ROUTES.verifyEmail,
] as const;

/**
 * Resolve where an authenticated user should land.
 *
 * Email verification gates everything (the trust signal) and applies on every
 * sign-in. The avatar-onboarding `/welcome` step, by contrast, is a FIRST-RUN
 * step only: it's shown once at the end of the signup → verify chain, never on
 * a returning login. Callers opt in with `firstRun`; login leaves it false so
 * a user who skipped their photo isn't nagged to /welcome on every sign-in.
 *
 * `firstRun` is carried across the verify-email hop via a `?welcome=1` query
 * flag, since the in-memory intent wouldn't survive the page navigation.
 */
interface PostAuthUser {
  emailVerified: boolean;
  avatarUrl: string | null;
}

export function postAuthRedirect(
  user: PostAuthUser,
  fallback: string = ROUTES.home,
  firstRun = false,
): string {
  if (!user.emailVerified) {
    return firstRun ? `${ROUTES.verifyEmail}?welcome=1` : ROUTES.verifyEmail;
  }
  if (firstRun && !user.avatarUrl) return ROUTES.welcome;
  return fallback;
}
