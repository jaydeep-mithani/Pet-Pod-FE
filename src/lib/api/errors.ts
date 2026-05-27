export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: string[];
  readonly data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.fieldErrors = extractFieldErrors(data);
  }
}

function extractFieldErrors(data: unknown): string[] {
  if (!data || typeof data !== "object") return [];
  const maybe = (data as { message?: unknown }).message;
  if (Array.isArray(maybe)) return maybe.filter((m): m is string => typeof m === "string");
  return [];
}
