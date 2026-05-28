import { z } from "zod";

const species = z.enum(["DOG", "CAT", "RABBIT", "BIRD", "SMALL", "OTHER"]);
const size = z.enum(["SMALL", "MEDIUM", "LARGE"]);
const status = z.enum(["AVAILABLE", "PENDING", "ADOPTED"]);

const trimmedOptional = (max: number, msg = "Too long") =>
  z
    .string()
    .trim()
    .max(max, msg)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const petFormSchema = z
  .object({
    name: trimmedOptional(60),
    species,
    breed: trimmedOptional(100),
    years: z
      .number({ message: "Required" })
      .int("Whole numbers only")
      .min(0, "Cannot be negative")
      .max(30, "Seems unlikely"),
    months: z
      .number({ message: "Required" })
      .int("Whole numbers only")
      .min(0, "Cannot be negative")
      .max(11, "Use the years field for 12+ months"),
    size,
    status: status.optional(),
    shortDescription: z
      .string()
      .trim()
      .min(10, "At least 10 characters")
      .max(280, "Keep it under 280 characters"),
    story: trimmedOptional(4000),
    reasonForRehoming: trimmedOptional(500),
    city: z.string().trim().min(1, "Required").max(100, "Too long"),
    region: trimmedOptional(100),
    country: z
      .string()
      .trim()
      .length(2, "Use a 2-letter country code (e.g. US, IN)")
      .toUpperCase(),
  })
  .refine((data) => data.years > 0 || data.months > 0, {
    message: "Age can't be zero",
    path: ["months"],
  });

export type PetFormValues = z.infer<typeof petFormSchema>;

export function ageMonthsFrom(values: { years: number; months: number }): number {
  return values.years * 12 + values.months;
}

export function ageToYearsMonths(ageMonths: number): {
  years: number;
  months: number;
} {
  return { years: Math.floor(ageMonths / 12), months: ageMonths % 12 };
}
