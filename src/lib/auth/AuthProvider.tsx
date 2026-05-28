"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError } from "@/lib/api/errors";
import { authService } from "@/lib/services/auth.service";
import { disconnectSocket } from "@/lib/realtime/socket";
import type { LoginInput, SignupInput } from "@/lib/services/auth.service";
import type { User } from "@/types";

type AuthStatus = "loading" | "authed" | "guest";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signup: (input: SignupInput) => Promise<User>;
  login: (input: LoginInput) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser(me);
      setStatus("authed");
    } catch (err) {
      setUser(null);
      setStatus("guest");
      if (!(err instanceof ApiError) || err.status !== 401) {
        console.error("[AuthProvider] Session check failed:", err);
      }
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const me = await authService.me();
        setUser(me);
        setStatus("authed");
      } catch (err) {
        setUser(null);
        setStatus("guest");
        if (!(err instanceof ApiError) || err.status !== 401) {
          console.error("[AuthProvider] Session check failed:", err);
        }
      }
    })();
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    await authService.signup(input);
    const me = await authService.me();
    setUser(me);
    setStatus("authed");
    return me;
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    await authService.login(input);
    const me = await authService.me();
    setUser(me);
    setStatus("authed");
    return me;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setStatus("guest");
    disconnectSocket();
    try {
      await authService.logout();
    } catch {
      // Even if the BE call fails, the local session is cleared.
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signup, login, logout, refresh }),
    [user, status, signup, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
