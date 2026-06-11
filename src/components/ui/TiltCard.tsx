"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. Scaled up slightly in bold vibe. */
  maxTilt?: number;
}

/**
 * Pointer-tracking 3D tilt wrapper for feature cards. Renders a plain div in
 * calm vibe and under prefers-reduced-motion — tilt is a flourish, and calm
 * explicitly opts out of flourishes.
 */
const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  maxTilt = 6,
}) => {
  const { tokens, vibe } = useMotionVibe();
  const ref = useRef<HTMLDivElement | null>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 240, damping: 22 });
  const sy = useSpring(py, { stiffness: 240, damping: 22 });

  const tilt = vibe === "bold" ? maxTilt * 1.5 : maxTilt;
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);

  const enabled = tokens.flourish;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (!enabled) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: tokens.hover.y }}
      transition={tokens.interactive}
      className={cn("h-full will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
