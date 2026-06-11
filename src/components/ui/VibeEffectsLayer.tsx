"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { PawPrint } from "lucide-react";
import { useMotionVibe } from "@/lib/motion";

interface Stamp {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

const MAX_STAMPS = 16;
let stampId = 0;

/**
 * Vibe-exclusive, fully reactive effects. Nothing here loops on its own —
 * every animation is a direct response to a user action:
 *
 *   playful — paw prints stamp where you click/tap, pop in and fade out
 *   bold    — a soft spotlight trails the cursor; clicks fire a shockwave
 *   calm    — renders nothing (stillness is the point)
 *
 * Cursor-follow effects are skipped for coarse pointers (touch devices).
 */
const VibeEffectsLayer: React.FC = () => {
  const { vibe, tokens } = useMotionVibe();

  if (!tokens.flourish) return null;
  if (vibe === "playful") return <PawStamps />;
  if (vibe === "bold") return <BoldCursorLayer />;
  return null;
};

const PawStamps: React.FC = () => {
  const [stamps, setStamps] = useState<Stamp[]>([]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      // Ignore clicks on obvious controls so the stamp doesn't visually
      // fight with button feedback.
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select, [role=dialog]"))
        return;

      const stamp: Stamp = {
        id: stampId++,
        x: e.clientX,
        y: e.clientY,
        rotate: Math.random() * 60 - 30,
        scale: 0.85 + Math.random() * 0.4,
      };
      setStamps((curr) => [...curr.slice(-MAX_STAMPS + 1), stamp]);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const removeStamp = (id: number) => {
    setStamps((curr) => curr.filter((s) => s.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden>
      <AnimatePresence>
        {stamps.map((stamp) => (
          <motion.div
            key={stamp.id}
            className="absolute text-pink-500/70"
            style={{ left: stamp.x, top: stamp.y }}
            initial={{
              opacity: 0.9,
              scale: 0.3,
              rotate: stamp.rotate,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              opacity: 0,
              scale: stamp.scale,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
            onAnimationComplete={() => removeStamp(stamp.id)}
          >
            <PawPrint className="h-7 w-7" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface Shockwave {
  id: number;
  x: number;
  y: number;
}

let waveId = 0;

const BoldCursorLayer: React.FC = () => {
  const [waves, setWaves] = useState<Shockwave[]>([]);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const sx = useSpring(mx, { stiffness: 120, damping: 22 });
  const sy = useSpring(my, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      // Lazy-enable the spotlight only for mouse/trackpad users.
      // (setState inside the effect body is intentional and one-shot: it
      // depends on a media query we can only read on the client.)
      setTimeout(() => setHasFinePointer(true), 0);
    }

    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onDown = (e: PointerEvent) => {
      const wave: Shockwave = { id: waveId++, x: e.clientX, y: e.clientY };
      setWaves((curr) => [...curr.slice(-7), wave]);
    };

    if (fine) window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [mx, my]);

  const removeWave = (id: number) => {
    setWaves((curr) => curr.filter((w) => w.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden>
      {hasFinePointer && (
        <motion.div
          style={{ x: sx, y: sy }}
          className="absolute -left-48 -top-48 h-96 w-96 rounded-full opacity-60"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.14) 0%, rgba(168,85,247,0.07) 40%, transparent 70%)",
            }}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {waves.map((wave) => (
          <motion.div
            key={wave.id}
            className="absolute h-10 w-10 rounded-full border-2 border-pink-400/70"
            style={{ left: wave.x, top: wave.y, x: "-50%", y: "-50%" }}
            initial={{ opacity: 0.8, scale: 0.4 }}
            animate={{
              opacity: 0,
              scale: 3.2,
              transition: { duration: 0.6, ease: "easeOut" },
            }}
            onAnimationComplete={() => removeWave(wave.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default VibeEffectsLayer;
