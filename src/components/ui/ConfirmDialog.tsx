"use client";

import { useId } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import { cn } from "@/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual tone of the confirm button. */
  tone?: "primary" | "danger";
  /** Disables both buttons and shows a "…" suffix on the confirm label. */
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  loading = false,
}) => {
  const titleId = useId();
  const descId = useId();

  const isDanger = tone === "danger";

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      labelledBy={titleId}
      describedBy={descId}
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            isDanger ? "bg-red-50 text-red-600" : "bg-pink-50 text-pink-600",
          )}
        >
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <p
            id={descId}
            className="mt-1.5 text-sm leading-relaxed text-gray-600"
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={loading}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
            isDanger
              ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 hover:shadow-md focus:ring-red-500"
              : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:shadow-md focus:ring-pink-500",
          )}
        >
          {loading ? `${confirmLabel}…` : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
