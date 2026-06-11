"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /**
   * ID of the element labelling the dialog (typically the title). Wire it
   * through if you have a `<h2 id={...}>` in `children`; the component will
   * generate a fallback ID for `aria-labelledby` otherwise.
   */
  labelledBy?: string;
  /** ID of the element describing the dialog (typically the body copy). */
  describedBy?: string;
  className?: string;
  /** When false, clicking the backdrop is a no-op (defaults to true). */
  closeOnBackdropClick?: boolean;
  /** When false, pressing Escape is a no-op (defaults to true). */
  closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  labelledBy,
  describedBy,
  className,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const fallbackLabelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Lock body scroll while open + restore on close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Capture the previously-focused element so we can restore it on close.
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    // Defer focus to next tick so the panel is mounted.
    const id = window.requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(id);
      triggerRef.current?.focus?.();
    };
  }, [open]);

  // ESC to close.
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEscape, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            aria-hidden
            onClick={closeOnBackdropClick ? onClose : undefined}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy ?? fallbackLabelId}
            aria-describedby={describedBy}
            tabIndex={-1}
            className={cn(
              "relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl outline-none sm:p-8",
              className,
            )}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Hidden fallback label so `aria-labelledby` always resolves. */}
            {!labelledBy && (
              <span id={fallbackLabelId} className="sr-only">
                Dialog
              </span>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
