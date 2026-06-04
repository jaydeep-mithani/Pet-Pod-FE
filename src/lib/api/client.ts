import { config } from "@/config";
import { ApiError } from "./errors";

const REFRESH_PATH = "/auth/refresh";

let refreshPromise: Promise<void> | null = null;

const fullUrl = (path: string) => {
  if (!config.apiBaseUrl) {
    throw new ApiError(0, "NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return `${config.apiBaseUrl}${path}`;
};

async function refreshTokens(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(fullUrl(REFRESH_PATH), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new ApiError(res.status, "Session expired");
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

interface RequestInitJson extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  headers?: Record<string, string>;
}

async function rawFetch(
  path: string,
  init: RequestInitJson,
): Promise<Response> {
  const { body, headers, ...rest } = init;
  return fetch(fullUrl(path), {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function apiFetch(
  path: string,
  init: RequestInitJson = {},
  isRetry = false,
): Promise<Response> {
  const res = await rawFetch(path, init);

  if (res.status === 401 && !isRetry && path !== REFRESH_PATH) {
    try {
      await refreshTokens();
      return apiFetch(path, init, true);
    } catch {
      return res;
    }
  }

  return res;
}

export async function apiJson<T>(
  path: string,
  init: RequestInitJson = {},
): Promise<T> {
  const res = await apiFetch(path, init);
  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data as { message?: unknown })?.message instanceof Array
        ? ((data as { message: string[] }).message[0] ?? res.statusText)
        : typeof (data as { message?: unknown })?.message === "string"
          ? (data as { message: string }).message
          : res.statusText;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => apiJson<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    apiJson<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    apiJson<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => apiJson<T>(path, { method: "DELETE" }),
};
