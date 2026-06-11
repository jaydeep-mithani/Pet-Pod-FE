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
 * Resolve where an authenticated user should land based on their onboarding
 * state. Order matters: verification gates everything (it's the trust
 * signal); avatar onboarding follows; then the requested destination (or
 * home if none).
 */
interface PostAuthUser {
  emailVerified: boolean;
  avatarUrl: string | null;
}

export function postAuthRedirect(
  user: PostAuthUser,
  fallback: string = ROUTES.home,
): string {
  if (!user.emailVerified) return ROUTES.verifyEmail;
  if (!user.avatarUrl) return ROUTES.welcome;
  return fallback;
}
