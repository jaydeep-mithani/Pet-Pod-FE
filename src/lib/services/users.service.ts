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
};
