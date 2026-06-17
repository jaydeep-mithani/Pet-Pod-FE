/**
 * Motion design tokens. Every animated component reads these through
 * useMotionVibe() instead of hardcoding springs/durations, so the whole
 * app's motion personality swaps from one place.
 *
 * Three user-selectable vibes:
 *   playful — springy overshoot, slight rotation, decorative flourishes
 *   calm    — tweened ease-out, no overshoot, no flourishes
 *   bold    — heavy springs, bigger travel, magnetic buttons
 *
 * A fourth internal preset, REDUCED, is applied automatically whenever the
 * OS reports prefers-reduced-motion — it wins over the stored vibe.
 */

export type MotionVibe = "playful" | "calm" | "bold";

export const MOTION_VIBES: MotionVibe[] = ["playful", "calm", "bold"];

interface SpringTransition {
  type: "spring";
  stiffness: number;
  damping: number;
  mass?: number;
}

interface TweenTransition {
  type: "tween";
  duration: number;
  ease: [number, number, number, number];
}

export type MotionTransition = SpringTransition | TweenTransition;

export interface MotionTokens {
  /** Transition used for hover/press feedback on interactive elements. */
  interactive: MotionTransition;
  /** Transition used for element entrances (reveals, mounts). */
  entrance: MotionTransition;
  /** Hover pose for cards and large interactive surfaces. */
  hover: { y: number; scale: number; rotate: number };
  /** Pressed pose for buttons. */
  press: { scale: number };
  /** Scroll-reveal geometry. */
  reveal: { distance: number; stagger: number };
  /** Route-change transition. */
  page: { y: number; duration: number };
  /** Hover zoom factor for imagery inside cards (applied via CSS class). */
  imageZoom: "none" | "subtle" | "medium" | "dramatic";
  /** Whether decorative flourishes (floating shapes, particles) render. */
  flourish: boolean;
  /** Whether magnetic-pull buttons are enabled (bold only). */
  magnetic: boolean;
  /** Entrances de-blur instead of travel (calm's signature). */
  blurEntrance: boolean;
}

export const MOTION_PRESETS: Record<MotionVibe, MotionTokens> = {
  playful: {
    interactive: { type: "spring", stiffness: 420, damping: 17 },
    entrance: { type: "spring", stiffness: 260, damping: 22 },
    hover: { y: -6, scale: 1.03, rotate: -0.75 },
    press: { scale: 0.94 },
    reveal: { distance: 24, stagger: 0.08 },
    page: { y: 12, duration: 0.35 },
    imageZoom: "medium",
    flourish: true,
    magnetic: false,
    blurEntrance: false,
  },
  calm: {
    interactive: { type: "tween", duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    entrance: { type: "tween", duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    hover: { y: -4, scale: 1, rotate: 0 },
    press: { scale: 0.98 },
    reveal: { distance: 10, stagger: 0.07 },
    page: { y: 0, duration: 0.45 },
    imageZoom: "subtle",
    flourish: false,
    magnetic: false,
    blurEntrance: true,
  },
  bold: {
    interactive: { type: "spring", stiffness: 300, damping: 22, mass: 1.1 },
    entrance: { type: "spring", stiffness: 170, damping: 24, mass: 1.2 },
    hover: { y: -8, scale: 1.05, rotate: 0 },
    press: { scale: 0.92 },
    reveal: { distance: 40, stagger: 0.1 },
    page: { y: 24, duration: 0.5 },
    imageZoom: "dramatic",
    flourish: true,
    magnetic: true,
    blurEntrance: false,
  },
};

/** Applied when prefers-reduced-motion is set, regardless of stored vibe. */
export const REDUCED_TOKENS: MotionTokens = {
  interactive: { type: "tween", duration: 0, ease: [0, 0, 1, 1] },
  entrance: { type: "tween", duration: 0, ease: [0, 0, 1, 1] },
  hover: { y: 0, scale: 1, rotate: 0 },
  press: { scale: 1 },
  reveal: { distance: 0, stagger: 0 },
  page: { y: 0, duration: 0 },
  imageZoom: "none",
  flourish: false,
  magnetic: false,
  blurEntrance: false,
};

export const VIBE_LABEL: Record<MotionVibe, string> = {
  playful: "Playful",
  calm: "Calm",
  bold: "Bold",
};

/** Image hover-zoom CSS classes, keyed by the imageZoom token. Static
 * strings so Tailwind's scanner picks them up. */
export const IMAGE_ZOOM_CLASS: Record<MotionTokens["imageZoom"], string> = {
  none: "",
  subtle: "transition-transform duration-500 ease-out group-hover:scale-[1.04]",
  medium: "transition-transform duration-500 ease-out group-hover:scale-[1.07]",
  dramatic:
    "transition-transform duration-700 ease-out group-hover:scale-[1.12]",
};
