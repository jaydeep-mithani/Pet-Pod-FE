import { api } from "@/lib/api/client";
import type { User } from "@/types";

export interface UpdateMeInput {
  name?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
}

/** Public-facing user profile (no email). */
export interface PublicUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  createdAt: string;
}

export const usersService = {
  updateMe: (input: UpdateMeInput) => api.patch<User>("/users/me", input),
  getPublic: (id: string) => api.get<PublicUser>(`/users/${id}`),

  /**
   * Anonymize-delete the current account. Accounts with a password must
   * re-confirm it; Google-only accounts confirm in the UI instead. The BE
   * clears the auth cookies, so callers should reset local auth state after.
   */
  deleteMe: (password?: string) =>
    api.delete<{ ok: true }>("/users/me", password ? { password } : {}),
};
