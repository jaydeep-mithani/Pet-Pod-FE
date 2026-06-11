"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { PawPrint } from "lucide-react";
import { useMotionVibe } from "@/lib/motion";

/**
 * Vibe-aware scroll progress tracker.
 *
 *   playful — top gradient bar + a paw "walker" that leans and hops
 *   bold    — a neon snake: percentage-chip head with glowing segments
 *             slithering after it on staggered springs
 *   calm    — vertical reading line on the right edge
 *   reduced — slim static-styled bar (position is informational)
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
  // Serpentine wiggle amplitude: flat when idle, wavy while scrolling.
  const wiggleAmp = useSpring(
    useTransform(velocity, (v) => Math.min(Math.abs(v) * 16, 11)),
    { stiffness: 180, damping: 22 },
  );

  const showWalker = tokens.flourish && !reduced;
  // Live percentage readout for bold's snake head — rendered as a motion
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

  // Bold: no bar at all — a neon snake slithers across the top edge. The
  // percentage chip is the head; segments chase it via chained springs.
  if (vibe === "bold" && showWalker) {
    return (
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-12"
        aria-hidden
      >
        <SnakeSegment leader={scaleX} amp={wiggleAmp} index={1} remaining={7} />
        <SnakeHead
          headLeft={headLeft}
          progress={scaleX}
          amp={wiggleAmp}
          lean={lean}
          hop={hop}
          pctText={pctText}
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
        className={`origin-left bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 ${
          vibe === "bold"
            ? "h-1.5 shadow-[0_0_14px_rgba(217,70,239,0.8)]"
            : "h-1"
        }`}
      />

      {showWalker && vibe === "playful" && (
        <motion.div
          style={{ left: headLeft }}
          className="absolute top-0 -translate-x-1/2"
        >
          <motion.div
            style={{ rotate: lean, scale: hop }}
            className="mt-0.5 rounded-full bg-white p-1 text-pink-600 shadow-md ring-1 ring-pink-200"
          >
            <PawPrint className="h-3.5 w-3.5" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

interface SnakeHeadProps {
  headLeft: MotionValue<string>;
  progress: MotionValue<number>;
  amp: MotionValue<number>;
  lean: MotionValue<number>;
  hop: MotionValue<number>;
  pctText: MotionValue<string>;
}

const SnakeHead: React.FC<SnakeHeadProps> = ({
  headLeft,
  progress,
  amp,
  lean,
  hop,
  pctText,
}) => {
  // Head bobs on the same sine path the body follows (phase 0).
  const y = useTransform([progress, amp], (values) => {
    const [p, a] = values as [number, number];
    return Math.sin(p * 60) * a + 6;
  });

  return (
    <motion.div
      style={{ left: headLeft, top: y }}
      className="absolute -translate-x-1/2"
    >
      <motion.div
        style={{ rotate: lean, scale: hop }}
        className="rounded border border-fuchsia-500/60 bg-black/85 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.7)]"
      >
        <motion.span>{pctText}</motion.span>
      </motion.div>
    </motion.div>
  );
};

interface SnakeSegmentProps {
  leader: MotionValue<number>;
  amp: MotionValue<number>;
  index: number;
  remaining: number;
}

/**
 * One body segment of the bold scroll snake. Each segment springs toward
 * the one ahead of it (chained lag = slither) and renders the next segment
 * recursively, passing its own smoothed position down the chain.
 */
const SnakeSegment: React.FC<SnakeSegmentProps> = ({
  leader,
  amp,
  index,
  remaining,
}) => {
  // Successively softer springs down the body — the tail lags the most.
  const follow = useSpring(leader, {
    stiffness: 320 - index * 26,
    damping: 26,
    restDelta: 0.0005,
  });
  const left = useTransform(follow, (v) => `${v * 100}%`);
  const y = useTransform([follow, amp], (values) => {
    const [p, a] = values as [number, number];
    return Math.sin(p * 60 - index * 1.05) * a + 10;
  });

  const size = Math.max(11 - index, 4);
  const cyan = index % 2 === 0;

  return (
    <>
      <motion.div
        style={{ left, top: y, width: size, height: size }}
        className={
          cyan
            ? "absolute -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
            : "absolute -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.9)]"
        }
        // Tail fades toward the end of the body.
        initial={false}
        animate={{ opacity: 1 - index * 0.09 }}
      />
      {remaining > 1 && (
        <SnakeSegment
          leader={follow}
          amp={amp}
          index={index + 1}
          remaining={remaining - 1}
        />
      )}
    </>
  );
};

export default ScrollTracker;
