"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";
import { useMotionVibe } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  /** Overrides the vibe's reveal distance when provided. */
  distance?: number;
  /** Legacy prop — kept for API compatibility; vibes own their durations. */
  duration?: number;
  className?: string;
  once?: boolean;
}

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  distance,
  className,
  once = true,
}) => {
  const { tokens } = useMotionVibe();
  const travel = distance ?? tokens.reveal.distance;
  // Calm's signature: content de-blurs into place instead of travelling.
  const blur = tokens.blurEntrance;

  const variants: Variants = {
    hidden: {
      opacity: travel === 0 && !blur ? 1 : 0,
      ...(blur ? { filter: "blur(10px)" } : {}),
      ...offsetFor(direction, travel),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: "blur(0px)" } : {}),
      transition: { ...tokens.entrance, delay },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
