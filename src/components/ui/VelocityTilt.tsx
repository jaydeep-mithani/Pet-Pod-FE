"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useMotionVibe } from "@/lib/motion";

interface VelocityTiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max skew in degrees at full scroll velocity. */
  maxSkew?: number;
}

/**
 * Scroll-momentum wrapper: children lean into a scroll flick and spring back
 * to rest — pure physics reaction, idle when the user is idle. Playful-vibe
 * flourish; renders a plain div otherwise.
 */
const VelocityTilt: React.FC<VelocityTiltProps> = ({
  children,
  className,
  maxSkew = 1.6,
}) => {
  const { vibe, tokens } = useMotionVibe();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothed = useSpring(velocity, { stiffness: 180, damping: 28 });
  const skewY = useTransform(
    smoothed,
    [-1800, 0, 1800],
    [maxSkew, 0, -maxSkew],
    { clamp: true },
  );

  if (vibe !== "playful" || !tokens.flourish) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ skewY }} className={className}>
      {children}
    </motion.div>
  );
};

export default VelocityTilt;
