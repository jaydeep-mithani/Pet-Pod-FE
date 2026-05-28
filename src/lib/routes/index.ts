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
  welcome: "/welcome",
} as const;

export const AUTH_FREE_ROUTES = [
  ROUTES.login,
  ROUTES.signup,
  ROUTES.forgotPassword,
] as const;

export const NAVBAR_HIDDEN_ROUTES = [
  ...AUTH_FREE_ROUTES,
  ROUTES.welcome,
] as const;
