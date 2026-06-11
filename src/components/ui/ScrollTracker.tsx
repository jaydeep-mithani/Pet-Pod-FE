"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { PawPrint } from "lucide-react";
import { useMotionVibe } from "@/lib/motion";

/**
 * Vibe-aware scroll progress tracker pinned to the top edge.
 *
 *   playful — gradient bar + a paw "walker" that tilts with scroll velocity
 *   bold    — thicker bar + glowing comet head
 *   calm    — slim, clean gradient bar
 *   reduced — slim bar (scroll-linked position is informational, not motion)
 */
const ScrollTracker: React.FC = () => {
  const { vibe, tokens, reduced } = useMotionVibe();
  const { scrollYProgress } = useScroll();

  // Smooth the raw progress a touch so the head doesn't jitter.
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 36,
    restDelta: 0.001,
  });

  const scaleX = reduced ? scrollYProgress : progress;
  const headLeft = useTransform(scaleX, (v) => `${v * 100}%`);

  // The walker leans into the direction of travel and "hops" (scales up)
  // with scroll speed — pure reaction to the user's scrolling, idle when
  // they're idle.
  const velocity = useVelocity(scrollYProgress);
  const lean = useSpring(useTransform(velocity, [-2, 0, 2], [-24, 0, 24]), {
    stiffness: 300,
    damping: 24,
  });
  const hop = useSpring(
    useTransform(velocity, (v) => 1 + Math.min(Math.abs(v) * 0.35, 0.45)),
    { stiffness: 320, damping: 18 },
  );

  const showWalker = tokens.flourish && !reduced;
  const barHeight = vibe === "bold" ? "h-1.5" : "h-1";
  // Live percentage readout for bold's HUD chip — rendered as a motion
  // value child so it updates without React re-renders.
  const pctText = useTransform(scaleX, (v) => `${Math.round(v * 100)}%`);

  // Calm: a vertical reading line along the right edge (print-magazine
  // pattern) instead of the top bar — structurally distinct, not recolored.
  if (vibe === "calm") {
    return (
      <div
        className="pointer-events-none fixed bottom-0 right-0 top-0 z-[60] w-[3px]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-stone-200/60" />
        <motion.div
          style={{ scaleY: scaleX }}
          className="absolute inset-0 origin-top bg-teal-700"
        />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
      aria-hidden
    >
      <motion.div
        style={{ scaleX }}
        className={`origin-left bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 ${barHeight} ${
          vibe === "bold" ? "shadow-[0_0_14px_rgba(217,70,239,0.8)]" : ""
        }`}
      />

      {showWalker && (
        <motion.div
          style={{ left: headLeft }}
          className="absolute top-0 -translate-x-1/2"
        >
          {vibe === "playful" ? (
            <motion.div
              style={{ rotate: lean, scale: hop }}
              className="mt-0.5 rounded-full bg-white p-1 text-pink-600 shadow-md ring-1 ring-pink-200"
            >
              <PawPrint className="h-3.5 w-3.5" />
            </motion.div>
          ) : (
            // Bold: HUD chip with a live percentage readout.
            <motion.div
              style={{ rotate: lean, scale: hop }}
              className="mt-1 rounded border border-fuchsia-500/60 bg-black/85 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.6)]"
            >
              <motion.span>{pctText}</motion.span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ScrollTracker;
