"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils";
import { usePrefersReducedMotion } from "@/hooks";

export interface CarouselPhoto {
  id?: string;
  url: string;
}

interface PhotoCarouselProps {
  photos: CarouselPhoto[];
  alt: string;
  className?: string;
  /** ms between auto-advance. 0 (default) = no autoplay. */
  autoplayMs?: number;
  /** ms to pause auto-advance after a manual interaction. */
  manualPauseMs?: number;
  /** Pause autoplay on hover. */
  pauseOnHover?: boolean;
  /** Controlled active index. If omitted, the carousel manages its own. */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** next/image priority on the active slide. */
  priority?: boolean;
  /** next/image sizes attribute. */
  sizes?: string;
  /** Show dot indicators bottom-center. */
  showDots?: boolean;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  alt,
  className,
  autoplayMs = 0,
  manualPauseMs = 6000,
  pauseOnHover = true,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  priority,
  sizes,
  showDots,
}) => {
  const reduced = usePrefersReducedMotion();
  const [internalIndex, setInternalIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const lastManual = useRef<number>(0);

  const isControlled = typeof controlledIndex === "number";
  const rawIndex = isControlled ? controlledIndex : internalIndex;
  // Clamp at read time so a shrinking `photos` array can't point past the end.
  const index =
    photos.length > 0 ? Math.min(rawIndex ?? 0, photos.length - 1) : 0;

  const setIndex = useCallback(
    (next: number) => {
      if (!isControlled) setInternalIndex(next);
      onActiveIndexChange?.(next);
    },
    [isControlled, onActiveIndexChange],
  );

  // Auto-advance
  useEffect(() => {
    if (!autoplayMs || photos.length <= 1 || reduced) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      const recentlyTouched = now - lastManual.current < manualPauseMs;
      if (recentlyTouched) return;
      if (pauseOnHover && hovering) return;
      const next =
        ((isControlled ? (controlledIndex ?? 0) : internalIndex) + 1) %
        photos.length;
      setIndex(next);
    }, autoplayMs);
    return () => window.clearInterval(timer);
  }, [
    autoplayMs,
    photos.length,
    hovering,
    pauseOnHover,
    manualPauseMs,
    reduced,
    isControlled,
    controlledIndex,
    internalIndex,
    setIndex,
  ]);

  if (photos.length === 0) return null;

  const active = photos[index] ?? photos[0];

  const handleDotClick = (i: number) => {
    // Date.now() in an event handler is allowed; the compiler rule can't tell
    // this plain function is only ever called from onClick.
    // eslint-disable-next-line react-hooks/purity
    lastManual.current = Date.now();
    setIndex(i);
  };

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={active.url}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduced ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={active.url}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {showDots && photos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {photos.map((p, i) => (
            <button
              key={p.id ?? p.url}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDotClick(i);
              }}
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/60 hover:bg-white/90",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoCarousel;
