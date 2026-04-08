import { publicFetch, privateFetch, type HttpMethod, RequestWithBodyOptions } from "./api-client";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestInit["cache"];
  next?: NextFetchRequestConfig;
}

type Fetcher = <T>(
  endpoint: string,
  mathod: HttpMethod,
  options?: RequestWithBodyOptions,
  refreshToken?: string,
) => Promise<T>;


class ApiClient {
  constructor(private readonly fetcher: Fetcher) {}

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.fetcher<T>(endpoint, "GET", options);
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions, refreshToken?: string): Promise<T> {
    return this.fetcher<T>(endpoint, "POST", { ...options, body }, refreshToken);
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.fetcher<T>(endpoint, "PUT", { ...options, body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.fetcher<T>(endpoint, "PATCH", { ...options, body });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.fetcher<T>(endpoint, "DELETE", options);
  }
}

export const Api = new ApiClient(publicFetch);
export const PrivateApi = new ApiClient(privateFetch);
export { ApiError } from "./api-error";
