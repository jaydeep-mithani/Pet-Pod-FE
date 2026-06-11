"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Heart, PawPrint } from "lucide-react";
import {
  CELEBRATE_EVENT,
  useMotionVibe,
  type CelebrateDetail,
} from "@/lib/motion";

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
  if (vibe === "playful") {
    return (
      <>
        <PawStamps />
        <PawTrail />
        <CursorCompanion />
        <ScrollPawTrail />
        <CelebrationBursts />
      </>
    );
  }
  if (vibe === "bold") return <BoldCursorLayer />;
  return null;
};

/**
 * Slow-speed cursor effect: a tiny paw companion chases the cursor with
 * springy lag. At slow speeds the lag itself is the effect (it visibly
 * trails behind and catches up); at high speeds it stretches out and
 * brightens while the PawTrail handles the footprints.
 */
const CursorCompanion: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  // Soft spring = visible lag at walking pace.
  const sx = useSpring(mx, { stiffness: 140, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 140, damping: 16, mass: 0.6 });

  // Brightness/size react to how fast the companion itself is moving.
  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const speed = useTransform<number, number>([vx, vy], ([a, b]) =>
    Math.hypot(a ?? 0, b ?? 0),
  );
  const smoothSpeed = useSpring(speed, { stiffness: 200, damping: 30 });
  const opacity = useTransform(smoothSpeed, [0, 200, 1600], [0.25, 0.45, 0.9]);
  const scale = useTransform(smoothSpeed, [0, 1600], [0.85, 1.5]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let moved = false;
    const onMove = (e: PointerEvent) => {
      if (!moved) {
        moved = true;
        // Defer enabling to the next frame so the dot doesn't flash at its
        // offscreen origin.
        requestAnimationFrame(() => setEnabled(true));
      }
      mx.set(e.clientX + 14);
      my.set(e.clientY + 18);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[44]" aria-hidden>
      <motion.div
        style={{ x: sx, y: sy, opacity, scale }}
        className="absolute -left-2 -top-2 text-pink-500"
      >
        <PawPrint className="h-4 w-4 fill-pink-200" />
      </motion.div>
    </div>
  );
};

interface EdgePaw {
  id: number;
  y: number;
  xOffset: number;
  rotate: number;
  size: number;
  opacity: number;
}

let edgePawId = 0;
const EDGE_STEP = 150; // px of scroll between footprints — slow scrolls count
const EDGE_LANE_ADVANCE = 56; // how far each print advances along the lane
const MAX_EDGE_PAWS = 10;

/**
 * Scroll-distance paw trail along the right edge of the viewport: the page
 * gets "walked" as you scroll. Triggered by distance (so slow scrolling
 * leaves tracks too); print size and opacity scale with scroll velocity so
 * fast flicks stomp harder. Works on every page, mouse or touch.
 */
const ScrollPawTrail: React.FC = () => {
  const [paws, setPaws] = useState<EdgePaw[]>([]);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let travelled = 0;
    let lane = window.innerHeight * 0.3;
    let side = 1;

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const delta = y - lastY;
      const dt = Math.max(1, now - lastT);
      const speed = Math.abs(delta) / dt; // px/ms
      lastY = y;
      lastT = now;

      travelled += Math.abs(delta);
      if (travelled < EDGE_STEP) return;
      travelled = 0;

      // Walk the lane in the direction of scroll, wrapping within a band.
      const dir = delta >= 0 ? 1 : -1;
      lane += EDGE_LANE_ADVANCE * dir;
      const minLane = window.innerHeight * 0.15;
      const maxLane = window.innerHeight * 0.85;
      if (lane > maxLane) lane = minLane;
      if (lane < minLane) lane = maxLane;
      side = -side;

      // Faster scroll = bigger, bolder stomps.
      const intensity = Math.min(speed / 3, 1);
      setPaws((curr) => [
        ...curr.slice(-MAX_EDGE_PAWS + 1),
        {
          id: edgePawId++,
          y: lane,
          xOffset: 26 + side * 9,
          rotate: dir === 1 ? 180 : 0,
          size: 16 + intensity * 14,
          opacity: 0.35 + intensity * 0.45,
        },
      ]);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const removePaw = (id: number) => {
    setPaws((curr) => curr.filter((p) => p.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[44]" aria-hidden>
      <AnimatePresence>
        {paws.map((paw) => (
          <motion.div
            key={paw.id}
            className="absolute text-pink-400"
            style={{ right: paw.xOffset, top: paw.y, rotate: paw.rotate }}
            initial={{ opacity: paw.opacity, scale: 0.5 }}
            animate={{
              opacity: 0,
              scale: 1,
              transition: { duration: 1.1, ease: "easeOut" },
            }}
            onAnimationComplete={() => removePaw(paw.id)}
          >
            <PawPrint style={{ width: paw.size, height: paw.size }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface TrailPaw {
  id: number;
  x: number;
  y: number;
  angle: number;
}

let trailId = 0;
const TRAIL_SPEED_THRESHOLD = 1.0; // px per ms — a brisk move starts tracking
const TRAIL_STEP = 72; // px of travel between footprints
const MAX_TRAIL = 14;

/**
 * Cursor-momentum footprints: move the pointer fast and paw prints appear
 * along the path, alternating left/right of the travel line like an actual
 * trotting pet. Slow, deliberate movement leaves no tracks.
 */
const PawTrail: React.FC = () => {
  const [paws, setPaws] = useState<TrailPaw[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let lastX = -1;
    let lastY = -1;
    let lastT = 0;
    let travelled = 0;
    let stepSide = 1;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX < 0) {
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(1, now - lastT);
      const dist = Math.hypot(dx, dy);
      const speed = dist / dt;

      // Reset accumulated travel when the cursor slows to a stroll.
      travelled = speed >= TRAIL_SPEED_THRESHOLD ? travelled + dist : 0;

      if (travelled >= TRAIL_STEP) {
        travelled = 0;
        stepSide = -stepSide;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        // Offset each footprint perpendicular to the travel direction so
        // left/right steps alternate like a trot.
        const perp = Math.atan2(dy, dx) + Math.PI / 2;
        const offset = 12 * stepSide;
        setPaws((curr) => [
          ...curr.slice(-MAX_TRAIL + 1),
          {
            id: trailId++,
            x: e.clientX + Math.cos(perp) * offset,
            y: e.clientY + Math.sin(perp) * offset,
            angle,
          },
        ]);
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const removePaw = (id: number) => {
    setPaws((curr) => curr.filter((p) => p.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[44]" aria-hidden>
      <AnimatePresence>
        {paws.map((paw) => (
          <motion.div
            key={paw.id}
            className="absolute text-pink-400/60"
            style={{ left: paw.x, top: paw.y, rotate: paw.angle }}
            initial={{ opacity: 0.7, scale: 0.9, x: "-50%", y: "-50%" }}
            animate={{
              opacity: 0,
              scale: 0.7,
              transition: { duration: 0.7, ease: "easeOut" },
            }}
            onAnimationComplete={() => removePaw(paw.id)}
          >
            <PawPrint className="h-4 w-4" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface BurstParticle {
  id: number;
  originX: number;
  originY: number;
  dx: number;
  dy: number;
  rotate: number;
  scale: number;
  kind: "heart" | "paw";
}

let burstId = 0;
const BURST_SIZE = 12;

/** Heart/paw explosion fired via the celebrate() helper on happy moments. */
const CelebrationBursts: React.FC = () => {
  const [particles, setParticles] = useState<BurstParticle[]>([]);

  useEffect(() => {
    const onCelebrate = (e: Event) => {
      const detail = (e as CustomEvent<CelebrateDetail>).detail ?? {};
      const originX = detail.x ?? window.innerWidth / 2;
      const originY = detail.y ?? window.innerHeight * 0.35;

      const burst: BurstParticle[] = Array.from(
        { length: BURST_SIZE },
        (_, i) => {
          const angle = (i / BURST_SIZE) * Math.PI * 2 + Math.random() * 0.5;
          const distance = 70 + Math.random() * 90;
          return {
            id: burstId++,
            originX,
            originY,
            dx: Math.cos(angle) * distance,
            dy: Math.sin(angle) * distance - 40,
            rotate: Math.random() * 180 - 90,
            scale: 0.7 + Math.random() * 0.7,
            kind: Math.random() > 0.4 ? "heart" : "paw",
          };
        },
      );
      setParticles((curr) => [...curr.slice(-BURST_SIZE), ...burst]);
    };

    window.addEventListener(CELEBRATE_EVENT, onCelebrate);
    return () => window.removeEventListener(CELEBRATE_EVENT, onCelebrate);
  }, []);

  const removeParticle = (id: number) => {
    setParticles((curr) => curr.filter((p) => p.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" aria-hidden>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={
              p.kind === "heart"
                ? "absolute text-pink-500"
                : "absolute text-purple-500"
            }
            style={{ left: p.originX, top: p.originY }}
            initial={{
              opacity: 1,
              x: "-50%",
              y: "-50%",
              scale: 0.3,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              x: p.dx,
              y: p.dy,
              scale: p.scale,
              rotate: p.rotate,
              transition: { duration: 1, ease: "easeOut" },
            }}
            onAnimationComplete={() => removeParticle(p.id)}
          >
            {p.kind === "heart" ? (
              <Heart className="h-5 w-5 fill-current" />
            ) : (
              <PawPrint className="h-5 w-5" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
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
            <PawPrint className="h-11 w-11 drop-shadow-sm" />
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
