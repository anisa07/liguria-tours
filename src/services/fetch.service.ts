import { API_CONFIG } from "@/config/api";

// Import types from separate files
import type { FetchOptions, ServiceResponse } from "@/types";

export class FetchService {
  private static async fetchWithTimeout(
    url: string,
    options: FetchOptions
  ): Promise<Response> {
    const { timeout = API_CONFIG.DEFAULT_TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private static async fetchWithRetry(
    url: string,
    options: FetchOptions
  ): Promise<Response> {
    const {
      retries = API_CONFIG.DEFAULT_RETRIES,
      retryDelay = 1000,
      ...fetchOptions
    } = options;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.fetchWithTimeout(url, fetchOptions);
      } catch (error) {
        if (attempt === retries) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1))
        );
      }
    }

    throw new Error("All retry attempts failed");
  }

  static async request<T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await this.fetchWithRetry(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null, success: true };
    } catch (error) {
      // ✅ Log detailed error server-side
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      // eslint-disable-next-line no-console
      console.error(`Fetch failed for ${url}:`, errorMessage);

      // ✅ Return generic error message for client
      return {
        data: null,
        error: "Request failed. Please try again later.",
        success: false,
      };
    }
  }

  static async get<T>(
    url: string,
    options?: FetchOptions
  ): Promise<ServiceResponse<T>> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  static async post<T>(
    url: string,
    data?: any,
    options?: FetchOptions
  ): Promise<ServiceResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(
    url: string,
    data?: any,
    options?: FetchOptions
  ): Promise<ServiceResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}
