import { env } from "~/config/env";

/**
 * Convert a relative image URL to an absolute URL pointing to the backend server
 * This is needed because the backend returns relative URLs like /uploads/avatars/...
 * but the frontend runs on a different port (5173) than the backend (8080)
 */
export const resolveImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;

    // If already an absolute URL (http:// or https://), return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // If it's a data URL (base64), return as-is
    if (url.startsWith('data:')) {
        return url;
    }

    // If it's a relative URL starting with /uploads, convert to absolute backend URL
    if (url.startsWith('/uploads')) {
        // Get the base URL without the /api/v1 suffix
        const backendBaseUrl = env.API_BASE_URL.replace(/\/api\/v1\/?$/, '');
        return `${backendBaseUrl}${url}`;
    }

    // For other relative URLs, return as-is (they'll be relative to the current origin)
    return url;
};

/**
 * Resolve avatar URL specifically
 */
export const resolveAvatarUrl = (avatarUrl: string | null | undefined): string | undefined => {
    return resolveImageUrl(avatarUrl);
};
