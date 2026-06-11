"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { PawPrint, Zap } from "lucide-react";
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

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
      aria-hidden
    >
      <motion.div
        style={{ scaleX }}
        className={`origin-left bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 ${barHeight}`}
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
            <motion.div
              style={{ rotate: lean, scale: hop }}
              className="mt-0.5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1 text-white shadow-[0_0_16px_rgba(236,72,153,0.8)]"
            >
              <Zap className="h-3.5 w-3.5" />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ScrollTracker;
