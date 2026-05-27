"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadsService } from "@/lib/services/uploads.service";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/utils";

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
          isDragActive
            ? "ring-4 ring-pink-300"
            : "ring-2 ring-gray-200 hover:ring-pink-300",
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
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200 text-pink-700">
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
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-60"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          Remove photo
        </button>
      )}
    </div>
  );
};

export default AvatarUploader;
