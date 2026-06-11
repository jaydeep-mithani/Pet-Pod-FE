"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePrefersReducedMotion } from "@/hooks";
import {
  MOTION_PRESETS,
  MOTION_VIBES,
  REDUCED_TOKENS,
  type MotionTokens,
  type MotionVibe,
} from "./tokens";

const STORAGE_KEY = "pp-motion-vibe";
const DEFAULT_VIBE: MotionVibe = "playful";

interface MotionVibeContextValue {
  /** The user's selected vibe (persisted). */
  vibe: MotionVibe;
  setVibe: (vibe: MotionVibe) => void;
  /** Resolved tokens — REDUCED_TOKENS when the OS asks for reduced motion. */
  tokens: MotionTokens;
  /** True when prefers-reduced-motion is overriding the selected vibe. */
  reduced: boolean;
  /**
   * False during SSR + first client render. UI that visually depends on the
   * stored vibe (e.g. the toggle's active indicator) should render a neutral
   * state until this flips, to avoid hydration mismatches.
   */
  hydrated: boolean;
}

const MotionVibeContext = createContext<MotionVibeContextValue | undefined>(
  undefined,
);

function readStoredVibe(): MotionVibe {
  if (typeof window === "undefined") return DEFAULT_VIBE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return MOTION_VIBES.includes(stored as MotionVibe)
    ? (stored as MotionVibe)
    : DEFAULT_VIBE;
}

// Canonical no-setState way to know we're past hydration: the server
// snapshot is false, the client snapshot is true.
const emptySubscribe = () => () => {};
function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function MotionThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vibe, setVibeState] = useState<MotionVibe>(readStoredVibe);
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();

  const setVibe = useCallback((next: MotionVibe) => {
    setVibeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable (private mode); the choice just won't
      // persist across reloads.
    }
  }, []);

  const value = useMemo<MotionVibeContextValue>(
    () => ({
      vibe,
      setVibe,
      tokens: reduced ? REDUCED_TOKENS : MOTION_PRESETS[vibe],
      reduced,
      hydrated,
    }),
    [vibe, setVibe, reduced, hydrated],
  );

  return (
    <MotionVibeContext.Provider value={value}>
      {children}
    </MotionVibeContext.Provider>
  );
}

export function useMotionVibe(): MotionVibeContextValue {
  const ctx = useContext(MotionVibeContext);
  if (!ctx) {
    throw new Error("useMotionVibe must be used inside <MotionThemeProvider>");
  }
  return ctx;
}
