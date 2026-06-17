/**
 * Fire-and-forget celebration hook. Pages call `celebrate()` after happy
 * moments (listing created, email verified, …) and the active vibe's
 * effects layer decides how to render it — playful bursts hearts and paws.
 * No-ops when nothing is listening (calm vibe, reduced motion, SSR).
 */

export const CELEBRATE_EVENT = "pp:celebrate";

export interface CelebrateDetail {
  /** Viewport coords for the burst origin. Defaults to upper-center. */
  x?: number;
  y?: number;
}

export function celebrate(detail: CelebrateDetail = {}): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CelebrateDetail>(CELEBRATE_EVENT, { detail }),
  );
}
