"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ChevronDown, Heart, PawPrint, Zap } from "lucide-react";
import Button from "../ui/Button";
import { ROUTES } from "@/lib/routes";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=2000&q=80";

const HEADLINE_LINE_1 = ["Every", "pet", "deserves"];
const HEADLINE_LINE_2 = ["a", "second", "home."];

/** Per-vibe word entrance — structurally different, not just retimed. */
function wordVariants(vibe: MotionVibe, reducedLike: boolean): Variants {
  if (reducedLike) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }
  switch (vibe) {
    case "playful":
      return {
        hidden: { opacity: 0, y: 22, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 380, damping: 16 },
        },
      };
    case "bold":
      return {
        hidden: { opacity: 0, y: 56, rotateX: 35 },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          transition: {
            type: "spring",
            stiffness: 160,
            damping: 22,
            mass: 1.2,
          },
        },
      };
    case "calm":
    default:
      return {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        },
      };
  }
}

/** Decorative floating shapes — playful/bold only, themed per vibe. */
const PLAYFUL_FLOURISHES = [
  { Icon: PawPrint, className: "left-[8%] top-[22%] h-8 w-8", delay: 0 },
  { Icon: Heart, className: "right-[12%] top-[30%] h-6 w-6", delay: 1.2 },
  {
    Icon: PawPrint,
    className: "right-[20%] bottom-[24%] h-10 w-10",
    delay: 0.6,
  },
] as const;

const BOLD_FLOURISHES = [
  { Icon: Zap, className: "left-[10%] top-[18%] h-10 w-10", delay: 0 },
  { Icon: Zap, className: "right-[14%] top-[36%] h-7 w-7", delay: 0.9 },
  { Icon: Zap, className: "right-[26%] bottom-[30%] h-12 w-12", delay: 0.4 },
] as const;

const HeroSection: React.FC = () => {
  const { tokens, vibe, reduced } = useMotionVibe();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const words = wordVariants(vibe, reduced);
  const stagger = tokens.reveal.stagger;
  // Calm gets an editorial, left-aligned hero; bold gets a bottom-anchored
  // poster; playful stays centered.
  const editorial = vibe === "calm";
  const poster = vibe === "bold";
  const flourishes = poster ? BOLD_FLOURISHES : PLAYFUL_FLOURISHES;

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: 0.1 } },
  };

  return (
    <section
      ref={ref}
      className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-gray-950"
    >
      <motion.div
        style={{ y: reduced ? 0 : imageY }}
        className="absolute inset-0 z-0"
        aria-hidden
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80"
        aria-hidden
      />

      {/*
        Editorial (calm) and poster (bold) anchor text to the left, where the
        vertical overlay is lightest — a left-to-right scrim keeps that column
        legible over bright photos without darkening the whole image.
      */}
      {(editorial || poster) && (
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-gradient-to-r from-black/65 via-black/20 to-transparent"
        />
      )}

      {tokens.flourish && (
        <div className="absolute inset-0 z-10 overflow-hidden" aria-hidden>
          {flourishes.map(({ Icon, className, delay }, i) => (
            <motion.div
              key={i}
              className={`absolute ${poster ? "text-fuchsia-400/25" : "text-white/15"} ${className}`}
              animate={{
                y: [0, -18, -6, 0],
                rotate: [0, 8, -6, 0],
              }}
              transition={{
                duration: 7 + i * 1.5,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        style={{ y: reduced ? 0 : contentY, opacity: contentOpacity }}
        className={
          editorial
            ? "relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col items-start justify-center px-6 text-left text-white sm:px-10 lg:px-16"
            : poster
              ? "relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col items-start justify-end px-6 pb-28 text-left text-white sm:px-10 lg:px-16"
              : "relative z-20 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6 lg:px-8"
        }
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className={
            editorial || poster
              ? "flex flex-col items-start"
              : "flex flex-col items-center"
          }
        >
          {editorial ? (
            <motion.span
              variants={words}
              className="text-xs font-medium uppercase tracking-[0.25em] text-teal-100/90"
            >
              No money. Just love.
            </motion.span>
          ) : poster ? (
            <motion.span
              variants={words}
              className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300"
            >
              {"// no money. just love."}
            </motion.span>
          ) : (
            <motion.div
              variants={words}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur"
            >
              <PawPrint className="h-3.5 w-3.5" aria-hidden />
              <span>No money. Just love.</span>
            </motion.div>
          )}

          <h1
            className={
              poster
                ? "mt-5 max-w-5xl -rotate-1 text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
                : "mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            }
            style={{ perspective: 800 }}
          >
            <span className="block">
              {HEADLINE_LINE_1.map((word) => (
                <motion.span
                  key={word}
                  variants={words}
                  className="inline-block whitespace-pre"
                >
                  {word}{" "}
                </motion.span>
              ))}
            </span>
            {/*
              bg-clip-text lives on each word, NOT the parent: clipping on an
              ancestor of composited (animated) children breaks in Chromium —
              the text turns invisible. Same-element clip + transform is safe.
              Bold skips the gradient for hollow outline-stroke poster type.
            */}
            <span className="block">
              {HEADLINE_LINE_2.map((word) => (
                <motion.span
                  key={word}
                  variants={words}
                  className={
                    poster
                      ? "inline-block whitespace-pre text-transparent"
                      : "inline-block whitespace-pre bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent"
                  }
                  style={
                    poster ? { WebkitTextStroke: "2px #e879f9" } : undefined
                  }
                >
                  {word}{" "}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            variants={words}
            className="mt-6 max-w-2xl text-base text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] sm:text-lg md:text-xl"
          >
            Pet Pod connects people who can&apos;t keep their pets with people
            who can. No marketplace, no fees — just honest conversations and
            safe rehoming.
          </motion.p>

          <motion.div
            variants={words}
            className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Link href={ROUTES.pets} className="w-full sm:w-auto">
              <Button
                size="lg"
                icon={<Heart className="h-5 w-5" />}
                className="w-full sm:w-auto sm:min-w-[200px]"
              >
                Browse pets
              </Button>
            </Link>
            <Link href={ROUTES.newListing} className="w-full sm:w-auto">
              <Button
                variant="floating"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px]"
              >
                Rehome a pet
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/70"
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5" aria-hidden />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
