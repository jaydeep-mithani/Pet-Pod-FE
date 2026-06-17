"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadsService } from "@/lib/services/uploads.service";
import { ApiError } from "@/lib/api/errors";
import { useMotionVibe, type MotionVibe } from "@/lib/motion";
import { cn } from "@/utils";

// ring-pink-* / the pink-rose placeholder fill / hover:bg-gray-100 aren't
// remapped by the global theme layers, so the avatar chrome branches per vibe.
const AVATAR_CHROME: Record<
  MotionVibe,
  {
    idleRing: string;
    dragRing: string;
    placeholder: string;
    clearHover: string;
  }
> = {
  playful: {
    idleRing: "ring-2 ring-gray-200 hover:ring-pink-300",
    dragRing: "ring-4 ring-pink-300",
    placeholder: "bg-gradient-to-br from-pink-100 to-rose-200 text-pink-700",
    clearHover: "hover:bg-gray-100 hover:text-gray-900",
  },
  calm: {
    idleRing: "ring-2 ring-stone-200 hover:ring-teal-400",
    dragRing: "ring-4 ring-teal-400",
    placeholder: "bg-gradient-to-br from-teal-50 to-stone-200 text-teal-800",
    clearHover: "hover:bg-stone-100 hover:text-gray-900",
  },
  bold: {
    idleRing: "ring-2 ring-fuchsia-500/30 hover:ring-fuchsia-500/60",
    dragRing: "ring-4 ring-fuchsia-500/60",
    placeholder:
      "bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 text-fuchsia-300",
    clearHover: "hover:bg-white/5 hover:text-white",
  },
};

interface AvatarUploaderProps {
  initialUrl?: string | null;
  /** Called after a successful Cloudinary upload. */
  onUploaded: (url: string) => void | Promise<void>;
  /** Called when the user clears the current avatar. */
  onCleared?: () => void | Promise<void>;
  size?: number;
  disabled?: boolean;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPT = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
  "image/heic": [],
  "image/avif": [],
};

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  initialUrl,
  onUploaded,
  onCleared,
  size = 128,
  disabled,
}) => {
  const { vibe } = useMotionVibe();
  const chrome = AVATAR_CHROME[vibe];
  const [url, setUrl] = useState<string | null>(initialUrl ?? null);
  const [progress, setProgress] = useState<number | null>(null);
  const [previewBlob, setPreviewBlob] = useState<string | null>(null);
  const blobRef = useRef<string | null>(null);

  // Reset to a changed initialUrl prop via React's "adjust state during render"
  // pattern — avoids the extra paint a sync-in-effect would cause.
  const [prevInitialUrl, setPrevInitialUrl] = useState(initialUrl);
  if (initialUrl !== prevInitialUrl) {
    setPrevInitialUrl(initialUrl);
    setUrl(initialUrl ?? null);
  }

  useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
      const local = URL.createObjectURL(file);
      blobRef.current = local;
      setPreviewBlob(local);
      setProgress(0);
      try {
        const signature = await uploadsService.getSignature();
        const uploaded = await uploadsService.uploadToCloudinary(
          file,
          signature,
          (fraction) => setProgress(fraction),
        );
        setUrl(uploaded.url);
        await onUploaded(uploaded.url);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Upload failed";
        toast.error(`Couldn't upload photo: ${message}`);
      } finally {
        setProgress(null);
        if (blobRef.current) {
          URL.revokeObjectURL(blobRef.current);
          blobRef.current = null;
        }
        setPreviewBlob(null);
      }
    },
    [onUploaded],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      rejections.forEach((r) => {
        const reason = r.errors[0]?.message ?? "rejected";
        toast.error(`${r.file.name}: ${reason}`);
      });
      const file = acceptedFiles[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_FILE_BYTES,
    multiple: false,
    disabled: disabled || progress !== null,
    noClick: true,
    noKeyboard: true,
  });

  const handleClear = async () => {
    setUrl(null);
    if (onCleared) await onCleared();
  };

  const displayUrl = previewBlob ?? url;
  const uploading = progress !== null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        {...getRootProps()}
        style={{ width: size, height: size }}
        className={cn(
          "group relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-all",
          isDragActive ? chrome.dragRing : chrome.idleRing,
          (disabled || uploading) && "cursor-not-allowed opacity-80",
        )}
        onClick={!disabled && !uploading ? open : undefined}
      >
        <input {...getInputProps()} />
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Your profile photo"
            fill
            sizes={`${size}px`}
            className="object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center",
              chrome.placeholder,
            )}
          >
            <Camera className="h-7 w-7" aria-hidden />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/30 text-white">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            <span className="text-[10px] uppercase tracking-wider">
              {Math.round((progress ?? 0) * 100)}%
            </span>
          </div>
        )}
        {!uploading && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/55 to-transparent py-2 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            {displayUrl ? "Replace" : "Add photo"}
          </div>
        )}
      </div>
      {url && !uploading && (
        <button
          type="button"
          onClick={() => void handleClear()}
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-gray-600 disabled:opacity-60",
            chrome.clearHover,
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          Remove photo
        </button>
      )}
    </div>
  );
};

export default AvatarUploader;
