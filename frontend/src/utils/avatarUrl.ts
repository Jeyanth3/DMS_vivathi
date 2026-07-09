/**
 * Converts a profile picture URL to an absolute URL that the browser can fetch.
 *
 * The backend stores the path as a relative URL like `/api/users/1/profile-picture`.
 * When used directly as <img src>, the browser resolves it against the FRONTEND origin
 * (e.g. localhost:5173 or vercel.app), which is wrong.
 *
 * This helper prepends the backend base URL for relative paths, leaving
 * blob://, data:, and already-absolute http(s):// URLs untouched.
 */
export function toAbsoluteAvatarUrl(url: string | undefined | null): string {
  if (!url) return '';
  // Already absolute — blob objects, data URIs, or a full http(s) URL
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  // Relative path → prepend the backend origin
  // VITE_API_BASE_URL is e.g. "https://dms-backend-api.azurewebsites.net/api"
  // We strip the trailing "/api" to get the root origin, then append the path.
  const backendBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api\/?$/, '');
  return `${backendBase}${url}`;
}
