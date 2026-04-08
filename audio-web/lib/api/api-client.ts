"use server";
import { auth } from "@/services/auth";
import { ApiError } from "./api-error";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3333";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestInit["cache"];
  next?: NextFetchRequestConfig;
}

export interface RequestWithBodyOptions extends RequestOptions {
  body?: unknown;
}

async function coreFetch<T>(
  endpoint: string,
  method: HttpMethod,
  options: RequestWithBodyOptions = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let url = `${BACKEND_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const config: RequestInit = {
    method,
    headers,
    cache: options.cache,
    next: options.next,
    ...(method !== "GET" && method !== "DELETE" && options.body !== undefined
      ? { body: isFormData ? (options.body as FormData) : JSON.stringify(options.body) }
      : {}),
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {}
    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function resolveToken(): Promise<string> {
  const session = await auth();
  const token = session?.accessToken;
  if (!token) throw new ApiError("Unauthorized", 401);
  return token;
}

export async function publicFetch<T>(
  endpoint: string,
  method: HttpMethod,
  options?: RequestWithBodyOptions
): Promise<T> {
  return coreFetch<T>(endpoint, method, options);
}

export async function privateFetch<T>(
  endpoint: string,
  method: HttpMethod,
  options?: RequestWithBodyOptions,
  refreshToken?: string,
): Promise<T> {
  if(refreshToken) return coreFetch<T>(endpoint, method, options, refreshToken);
  const token = await resolveToken();
  return coreFetch<T>(endpoint, method, options, token);
}
