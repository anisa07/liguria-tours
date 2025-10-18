// Service-related type definitions

export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Email service types
export interface EmailRequest {
  name: string;
  email: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}
