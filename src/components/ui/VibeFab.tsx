"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Feather, PawPrint, X, Zap } from "lucide-react";
import {
  MOTION_VIBES,
  VIBE_LABEL,
  useMotionVibe,
  type MotionVibe,
} from "@/lib/motion";
import { cn } from "@/utils";

const VIBE_ICON: Record<
  MotionVibe,
  React.ComponentType<{ className?: string }>
> = {
  playful: PawPrint,
  calm: Feather,
  bold: Zap,
};

/** Quarter-arc offsets: up, diagonal, left. */
const POP_OFFSETS: Record<MotionVibe, { x: number; y: number }> = {
  playful: { x: 0, y: -68 },
  calm: { x: -50, y: -50 },
  bold: { x: -68, y: 0 },
};

/**
 * Floating vibe switcher. A single fixed-position button that fans out three
 * vibe options in a quarter-arc when tapped. Lives outside the navbar so it
 * never shifts layout, and never collides with the navbar's light/dark
 * appearance switching.
 */
const VibeFab: React.FC = () => {
  const { vibe, setVibe, reduced, hydrated } = useMotionVibe();
  const [open, setOpen] = useState(false);

  // Under prefers-reduced-motion all vibes behave identically — offering the
  // picker would be a lie. (Same rule as the old navbar toggle.)
  if (reduced) return null;

  const ActiveIcon = VIBE_ICON[vibe];

  const handleSelect = (v: MotionVibe) => {
    setVibe(v);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Invisible backdrop to close on outside click while open */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close animation style picker"
            className="fixed inset-0 -z-10 cursor-default"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div role="group" aria-label="Animation style">
        <AnimatePresence>
          {open &&
            MOTION_VIBES.map((v, i) => {
              const Icon = VIBE_ICON[v];
              const active = vibe === v;
              const offset = POP_OFFSETS[v];
              return (
                <motion.button
                  key={v}
                  type="button"
                  title={`${VIBE_LABEL[v]} animations`}
                  aria-label={`${VIBE_LABEL[v]} animations`}
                  aria-pressed={active}
                  onClick={() => handleSelect(v)}
                  className={cn(
                    "absolute inset-0 flex h-12 w-12 items-center justify-center rounded-full shadow-lg",
                    active
                      ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white ring-2 ring-white"
                      : "bg-white text-gray-700 ring-1 ring-gray-200 hover:text-pink-600 hover:ring-pink-300",
                  )}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  animate={{
                    x: offset.x,
                    y: offset.y,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 380,
                      damping: 22,
                      delay: i * 0.04,
                    },
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.4,
                    transition: { duration: 0.18 },
                  }}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </motion.button>
              );
            })}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={
            open
              ? "Close animation style picker"
              : `Animation style: ${VIBE_LABEL[vibe]}. Open picker`
          }
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-[0_8px_32px_-8px_rgba(236,72,153,0.55)]"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          <motion.span
            key={open ? "close" : vibe}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            className="flex items-center justify-center"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              // Until hydration resolves the stored vibe, the icon shows the
              // default — framer remounts it (keyed) the moment vibe updates.
              <ActiveIcon
                className={cn("h-5 w-5", !hydrated && "opacity-90")}
                aria-hidden
              />
            )}
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
};

export default VibeFab;
