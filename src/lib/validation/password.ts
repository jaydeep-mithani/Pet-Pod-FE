// Pure password-strength scoring, shared by the zod schemas (must stay
// framework-free so validation can run anywhere) and the PasswordStrength meter
// (client). No React / motion imports here on purpose.

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Bucket a password into five tiers (1 Very weak → 5 Very strong). One point
 * each for reaching 8 and 12 characters, mixing upper- and lower-case,
 * including a digit, and including a symbol; the 0–5 total maps to a tier (0
 * and 1 both read as "very weak"). Returns 0 only for an empty password.
 */
export function scorePasswordStrength(password: string): PasswordStrengthLevel {
  if (!password) return 0;
  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;
  return Math.max(1, points) as PasswordStrengthLevel;
}

/** Minimum tier accepted at submit — "Medium" (3). */
export const MIN_PASSWORD_STRENGTH: PasswordStrengthLevel = 3;

/** Whether a password clears the minimum accepted tier. */
export function isPasswordStrongEnough(password: string): boolean {
  return scorePasswordStrength(password) >= MIN_PASSWORD_STRENGTH;
}
