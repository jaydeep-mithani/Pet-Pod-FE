"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDropzone, type FileRejection } from "react-dropzone";
import { GripVertical, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadsService, type UploadedPhoto } from "@/lib/services/uploads.service";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/utils";

export interface PhotoEntry {
  url: string;
  publicId: string;
  /** Server-side Photo.id, set in edit/live mode after persisting. */
  id?: string;
}

type Updater = (curr: PhotoEntry[]) => PhotoEntry[];

interface ImageUploaderProps {
  value: PhotoEntry[];
  /**
   * Accepts a new array or an updater function. Pass a setState-style setter
   * to avoid races when multiple uploads complete in parallel.
   */
  onChange: (next: PhotoEntry[] | Updater) => void;
  onAdd?: (uploaded: { url: string; publicId: string }) => Promise<PhotoEntry>;
  onRemove?: (photo: PhotoEntry) => Promise<void>;
  /**
   * Fires exactly once per drag gesture, with the new order. Persist to the
   * server here — drag-end is the only point at which we send a request.
   */
  onReorder?: (next: PhotoEntry[]) => Promise<void>;
  max?: number;
  disabled?: boolean;
  className?: string;
}

interface PendingUpload {
  localId: string;
  file: File;
  previewUrl: string;
  progress: number;
  error?: string;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPT = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
  "image/heic": [],
  "image/avif": [],
};

const keyFor = (photo: PhotoEntry) =>
  photo.id ?? photo.publicId ?? photo.url;

interface SortableTileProps {
  photo: PhotoEntry;
  reorderable: boolean;
  removing: boolean;
  onRemove: () => void;
}

const SortableTile: React.FC<SortableTileProps> = ({
  photo,
  reorderable,
  removing,
  onRemove,
}) => {
  const sortableKey = keyFor(photo);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableKey, disabled: !reorderable });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200 bg-gray-100 touch-none",
        reorderable && "cursor-grab active:cursor-grabbing",
        isDragging && "shadow-xl ring-2 ring-pink-400",
      )}
    >
      <Image
        src={photo.url}
        alt=""
        fill
        sizes="20vw"
        className="object-cover pointer-events-none select-none"
        draggable={false}
      />
      {reorderable && (
        <span className="pointer-events-none absolute left-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          <GripVertical className="h-3.5 w-3.5" aria-hidden />
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        disabled={removing}
        aria-label="Remove photo"
        className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 disabled:opacity-60"
      >
        {removing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <X className="h-4 w-4" aria-hidden />
        )}
      </button>
    </li>
  );
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onAdd,
  onRemove,
  onReorder,
  max = 10,
  disabled,
  className,
}) => {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [removing, setRemoving] = useState<Set<string>>(new Set());
  const pendingRef = useRef<PendingUpload[]>([]);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  const usedSlots = value.length + pending.length;
  const slotsLeft = Math.max(0, max - usedSlots);

  const setPendingProgress = useCallback(
    (localId: string, patch: Partial<PendingUpload>) => {
      setPending((curr) =>
        curr.map((p) => (p.localId === localId ? { ...p, ...patch } : p)),
      );
    },
    [],
  );

  const removePending = useCallback((localId: string) => {
    setPending((curr) => {
      const target = curr.find((p) => p.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return curr.filter((p) => p.localId !== localId);
    });
  }, []);

  const uploadOne = useCallback(
    async (entry: PendingUpload) => {
      try {
        const signature = await uploadsService.getSignature();
        const uploaded: UploadedPhoto = await uploadsService.uploadToCloudinary(
          entry.file,
          signature,
          (fraction) => setPendingProgress(entry.localId, { progress: fraction }),
        );

        const finalEntry: PhotoEntry = onAdd
          ? await onAdd({ url: uploaded.url, publicId: uploaded.publicId })
          : { url: uploaded.url, publicId: uploaded.publicId };

        onChange((curr) => [...curr, finalEntry]);
        removePending(entry.localId);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Upload failed";
        setPendingProgress(entry.localId, { error: message, progress: 0 });
        toast.error(`Couldn't upload ${entry.file.name}: ${message}`);
      }
    },
    [onAdd, onChange, removePending, setPendingProgress],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      rejections.forEach((r) => {
        const reason = r.errors[0]?.message ?? "rejected";
        toast.error(`${r.file.name}: ${reason}`);
      });
      const accepted = acceptedFiles.slice(0, slotsLeft);
      if (accepted.length < acceptedFiles.length) {
        toast.error(`Max ${max} photos — extras ignored.`);
      }
      const newPending: PendingUpload[] = accepted.map((file) => ({
        localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
      }));
      setPending((curr) => [...curr, ...newPending]);
      newPending.forEach((entry) => void uploadOne(entry));
    },
    [max, slotsLeft, uploadOne],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_FILE_BYTES,
    multiple: true,
    disabled: disabled || slotsLeft === 0,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemoveExisting = async (photo: PhotoEntry) => {
    const key = keyFor(photo);
    if (removing.has(key)) return;
    setRemoving((curr) => new Set(curr).add(key));
    try {
      if (onRemove) await onRemove(photo);
      onChange((curr) => curr.filter((p) => keyFor(p) !== key));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove";
      toast.error(message);
    } finally {
      setRemoving((curr) => {
        const next = new Set(curr);
        next.delete(key);
        return next;
      });
    }
  };

  const reorderable = Boolean(onReorder) && value.length > 1;

  // 5px activation distance so a click on the remove button (no movement)
  // doesn't accidentally start a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.findIndex((p) => keyFor(p) === active.id);
    const newIndex = value.findIndex((p) => keyFor(p) === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(value, oldIndex, newIndex);
    onChange(next);
    if (onReorder) {
      void onReorder(next).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Reorder failed";
        toast.error(msg);
      });
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          isDragActive
            ? "border-pink-400 bg-pink-50/60"
            : "border-gray-300 bg-gray-50 hover:border-pink-300 hover:bg-pink-50/40",
          (disabled || slotsLeft === 0) && "opacity-60",
        )}
      >
        <input {...getInputProps()} />
        <ImagePlus className="h-7 w-7 text-pink-500" aria-hidden />
        <div className="text-sm font-medium text-gray-800">
          {slotsLeft === 0
            ? `Maximum ${max} photos`
            : isDragActive
              ? "Drop to upload"
              : "Drag photos here, or"}
        </div>
        {slotsLeft > 0 && (
          <button
            type="button"
            onClick={open}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-full bg-pink-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-700 disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden />
            Choose files
          </button>
        )}
        <p className="text-xs text-gray-500">
          JPG, PNG, WebP, HEIC, AVIF · up to 5 MB · {slotsLeft} of {max} slots
          left
        </p>
        {reorderable && (
          <p className="text-xs text-gray-400">
            Drag the photos below to reorder.
          </p>
        )}
      </div>

      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={value.map(keyFor)}
            strategy={rectSortingStrategy}
          >
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {value.map((photo) => {
                const key = keyFor(photo);
                return (
                  <SortableTile
                    key={key}
                    photo={photo}
                    reorderable={reorderable}
                    removing={removing.has(key)}
                    onRemove={() => void handleRemoveExisting(photo)}
                  />
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {pending.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {pending.map((p) => (
            <li
              key={p.localId}
              className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200 bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, next/image can't optimize blob: URLs */}
              <img
                src={p.previewUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 text-white">
                {p.error ? (
                  <>
                    <span className="px-2 text-center text-[10px] uppercase tracking-wider">
                      {p.error}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePending(p.localId)}
                      className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-800"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    <span className="text-[10px] uppercase tracking-wider">
                      {Math.round(p.progress * 100)}%
                    </span>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImageUploader;
