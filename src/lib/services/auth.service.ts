import { api } from "@/lib/api/client";
import type { AuthUserSummary, User } from "@/types";

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

interface AuthEnvelope {
  user: AuthUserSummary;
}

export const authService = {
  signup: (input: SignupInput) => api.post<AuthEnvelope>("/auth/signup", input),
  login: (input: LoginInput) => api.post<AuthEnvelope>("/auth/login", input),
  logout: () => api.post<{ ok: true }>("/auth/logout"),
  me: () => api.get<User>("/users/me"),
};
