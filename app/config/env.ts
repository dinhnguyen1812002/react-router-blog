// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  WS_URL: import.meta.env.VITE_WS_URL || "http://localhost:8080/ws",
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),

  // App Configuration
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,

  // Feature Flags (có thể thêm sau)
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true",

  // Upload Configuration
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || "10485760"), // 10MB default
  ALLOWED_IMAGE_TYPES: (
    import.meta.env.VITE_ALLOWED_IMAGE_TYPES ||
    "image/jpeg,image/png,image/gif,image/webp"
  ).split(","),
} as const;

// Type-safe environment variables
export type EnvConfig = typeof env;

// Helper functions
export const isDev = () => env.NODE_ENV === "development";
export const isProd = () => env.NODE_ENV === "production";

// API endpoints builder
export const buildApiUrl = (endpoint: string) => {
  const baseUrl = env.API_BASE_URL.replace(/\/$/, ""); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ""); // Remove leading slash
  return `${baseUrl}/${cleanEndpoint}`;
};
