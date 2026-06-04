import { z } from "zod";

const trimmedOptional = (max: number, msg = "Too long") =>
  z
    .string()
    .trim()
    .max(max, msg)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const profileSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(60, "Too long"),
  bio: trimmedOptional(500),
  city: trimmedOptional(100),
  region: trimmedOptional(100),
  country: z
    .string()
    .trim()
    .toUpperCase()
    .refine(
      (v) => v.length === 0 || v.length === 2,
      "Use a 2-letter country code",
    )
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type ProfileValues = z.infer<typeof profileSchema>;
