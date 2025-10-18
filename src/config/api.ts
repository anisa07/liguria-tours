export const API_ENDPOINTS = {
  //   USERS_API:
  //     import.meta.env.PUBLIC_USERS_API_URL || "https://users-api.example.com/v1",
  //   BLOG_API:
  //     import.meta.env.PUBLIC_BLOG_API_URL || "https://blog-api.example.com/v1",
  //   AUTH_API:
  //     import.meta.env.PUBLIC_AUTH_API_URL || "https://auth-api.example.com/v1",
  //   INTERNAL_API: import.meta.env.PUBLIC_INTERNAL_API_URL || "/api/v1",
} as const;

export const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000,
  DEFAULT_RETRIES: 2,
  CACHE_TTL: 300, // 5 minutes
} as const;
