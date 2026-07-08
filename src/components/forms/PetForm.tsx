"use client";

import { useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components";
import ImageUploader, { type PhotoEntry } from "@/components/ui/ImageUploader";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { SIZE_OPTIONS, SPECIES_OPTIONS, STATUS_OPTIONS } from "@/constants";
import {
  ageMonthsFrom,
  ageToYearsMonths,
  petFormSchema,
  type PetFormValues,
} from "@/lib/validation/pet";
import type { CreatePetInput } from "@/lib/services";
import type { PetStatus } from "@/types";

export interface PetFormSubmitData extends CreatePetInput {
  status?: PetStatus;
}

interface PetFormProps {
  mode: "create" | "edit";
  initial?: Partial<{
    name: string | null;
    species: PetFormValues["species"];
    breed: string | null;
    ageMonths: number;
    size: PetFormValues["size"];
    status: PetStatus;
    shortDescription: string;
    story: string | null;
    reasonForRehoming: string | null;
    city: string;
    region: string | null;
    country: string;
    photos: PhotoEntry[];
  }>;
  onSubmit: (input: PetFormSubmitData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  /** Real-time photo management hooks for edit mode. */
  onPhotoAdd?: (uploaded: {
    url: string;
    publicId: string;
  }) => Promise<PhotoEntry>;
  onPhotoRemove?: (photo: PhotoEntry) => Promise<void>;
  onPhotoReorder?: (photos: PhotoEntry[]) => Promise<void>;
}

const PetForm: React.FC<PetFormProps> = ({
  mode,
  initial,
  onSubmit,
  onCancel,
  submitLabel,
  onPhotoAdd,
  onPhotoRemove,
  onPhotoReorder,
}) => {
  const { years, months } = ageToYearsMonths(initial?.ageMonths ?? 0);
  const [photos, setPhotos] = useState<PhotoEntry[]>(initial?.photos ?? []);
  const [cancelling, startCancelTransition] = useTransition();

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: initial?.name ?? undefined,
      species: initial?.species ?? "DOG",
      breed: initial?.breed ?? undefined,
      years,
      months,
      size: initial?.size ?? "MEDIUM",
      // REMOVED is system-only (account deletion) and never reaches this
      // form in practice — narrow it away for the user-settable field type.
      status:
        initial?.status && initial.status !== "REMOVED"
          ? initial.status
          : "AVAILABLE",
      shortDescription: initial?.shortDescription ?? "",
      story: initial?.story ?? undefined,
      reasonForRehoming: initial?.reasonForRehoming ?? undefined,
      city: initial?.city ?? "",
      region: initial?.region ?? undefined,
      country: initial?.country ?? "US",
    },
  });

  const handle: SubmitHandler<PetFormValues> = async (values) => {
    const payload: PetFormSubmitData = {
      name: values.name,
      species: values.species,
      breed: values.breed,
      ageMonths: ageMonthsFrom(values),
      size: values.size,
      shortDescription: values.shortDescription,
      story: values.story,
      reasonForRehoming: values.reasonForRehoming,
      city: values.city,
      region: values.region,
      country: values.country,
      photos: photos.map(({ url, publicId }) => ({ url, publicId })),
    };
    if (mode === "edit" && values.status) {
      payload.status = values.status;
    }
    await onSubmit(payload);
  };

  const handleCancel = () => {
    if (!onCancel) return;
    startCancelTransition(() => onCancel());
  };

  const labelForSubmit =
    submitLabel ?? (mode === "create" ? "Publish listing" : "Save changes");

  const submitting = form.formState.isSubmitting;
  const busy = submitting || cancelling;

  return (
    <form onSubmit={form.handleSubmit(handle)} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Pet's name (optional)"
          placeholder="e.g. Bailey — leave blank for unnamed litters or strays"
          maxLength={60}
          showCount
          {...form.register("name")}
          error={form.formState.errors.name?.message}
          containerClassName="sm:col-span-2"
        />
        <Select
          label="Species"
          options={SPECIES_OPTIONS}
          required
          {...form.register("species")}
          error={form.formState.errors.species?.message}
        />
        <Input
          label="Breed (optional)"
          placeholder="e.g. Golden Retriever mix"
          maxLength={100}
          showCount
          {...form.register("breed")}
          error={form.formState.errors.breed?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Input
          label="Years"
          type="number"
          min={0}
          max={30}
          required
          {...form.register("years", { valueAsNumber: true })}
          error={form.formState.errors.years?.message}
        />
        <Input
          label="Months"
          type="number"
          min={0}
          max={11}
          required
          {...form.register("months", { valueAsNumber: true })}
          error={form.formState.errors.months?.message}
        />
        <Select
          label="Size"
          options={SIZE_OPTIONS}
          required
          {...form.register("size")}
          error={form.formState.errors.size?.message}
        />
      </div>

      {mode === "edit" && (
        <Select
          label="Listing status"
          options={STATUS_OPTIONS}
          {...form.register("status")}
          error={form.formState.errors.status?.message}
          hint="Set to Pending while you're in talks; Adopted once the pet has gone to their new home."
          containerClassName="sm:max-w-xs"
        />
      )}

      <Textarea
        label="Short description"
        placeholder="A line or two that someone scrolling would stop to read."
        rows={2}
        required
        maxLength={280}
        showCount
        {...form.register("shortDescription")}
        error={form.formState.errors.shortDescription?.message}
        hint="Shown on the browse card."
      />

      <Textarea
        label="Full story (optional)"
        placeholder="Where they came from, what they love, what they're scared of."
        rows={5}
        maxLength={4000}
        showCount
        {...form.register("story")}
        error={form.formState.errors.story?.message}
      />

      <Textarea
        label="Reason for rehoming (optional)"
        placeholder="Adopters appreciate honesty about the situation."
        rows={3}
        maxLength={500}
        showCount
        {...form.register("reasonForRehoming")}
        error={form.formState.errors.reasonForRehoming?.message}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Input
          label="City"
          placeholder="e.g. Austin"
          required
          maxLength={100}
          {...form.register("city")}
          error={form.formState.errors.city?.message}
          containerClassName="sm:col-span-2"
        />
        <Input
          label="Region / state (optional)"
          placeholder="e.g. TX"
          maxLength={100}
          {...form.register("region")}
          error={form.formState.errors.region?.message}
        />
        <Input
          label="Country code"
          placeholder="US"
          required
          {...form.register("country")}
          error={form.formState.errors.country?.message}
          containerClassName="sm:col-span-3 sm:max-w-[12rem]"
          hint="Two-letter code, e.g. US, IN, GB."
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-800">
          Photos
          {mode === "edit" && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              Saved automatically as you add or remove.
            </span>
          )}
        </label>
        <ImageUploader
          value={photos}
          onChange={setPhotos}
          onAdd={onPhotoAdd}
          onRemove={onPhotoRemove}
          onReorder={onPhotoReorder}
          max={10}
          disabled={busy}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleCancel}
            disabled={busy}
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" disabled={busy}>
          {submitting ? "Saving…" : labelForSubmit}
        </Button>
      </div>
    </form>
  );
};

export default PetForm;
