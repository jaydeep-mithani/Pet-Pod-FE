"use client";

import { motion } from "framer-motion";
import { useMotionVibe } from "@/lib/motion";

/**
 * Route-level enter transition. Next.js remounts template.tsx on every
 * navigation, which is exactly the hook we need for a page-enter animation.
 * (Exit animations aren't supported by the App Router without heavy
 * workarounds — enter-only is the pragmatic choice.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const { tokens } = useMotionVibe();

  return (
    <motion.div
      initial={{
        opacity: tokens.page.duration === 0 ? 1 : 0,
        y: tokens.page.y,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: tokens.page.duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
