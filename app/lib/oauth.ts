export type OAuthProvider = "google" | "github" | "discord";

export const OAUTH_PROVIDERS: readonly OAuthProvider[] = [
	"google",
	"github",
	"discord",
] as const;

export const OAUTH_REDIRECT_PATH = "/oauth2/redirect";
export const OAUTH_RETURN_TO_STORAGE_KEY = "oauth:return-to";

const AUTH_ROUTES = new Set(["/login", "/register", OAUTH_REDIRECT_PATH]);

const backendBaseUrl =
	import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

export const getOAuthAuthorizationUrl = (provider: OAuthProvider): string =>
	`${backendBaseUrl}/oauth2/authorization/${provider}`;

export const sanitizeOAuthReturnTo = (
	value: string | null | undefined,
): string => {
	if (!value || !value.startsWith("/") || value.startsWith("//")) {
		return "/";
	}

	return value;
};

export const resolveOAuthReturnTo = (
	pathname: string,
	search: string,
	hash: string,
	explicitReturnTo?: string,
): string => {
	if (explicitReturnTo) {
		return sanitizeOAuthReturnTo(explicitReturnTo);
	}

	const currentPath = `${pathname}${search}${hash}`;
	return sanitizeOAuthReturnTo(
		AUTH_ROUTES.has(pathname) ? "/" : currentPath,
	);
};

export const storeOAuthReturnTo = (returnTo: string): void => {
	if (typeof window === "undefined") return;
	window.sessionStorage.setItem(
		OAUTH_RETURN_TO_STORAGE_KEY,
		sanitizeOAuthReturnTo(returnTo),
	);
};

export const consumeOAuthReturnTo = (): string => {
	if (typeof window === "undefined") return "/";

	const value = window.sessionStorage.getItem(OAUTH_RETURN_TO_STORAGE_KEY);
	window.sessionStorage.removeItem(OAUTH_RETURN_TO_STORAGE_KEY);
	return sanitizeOAuthReturnTo(value);
};

export const sanitizeOAuthErrorMessage = (value: string | null): string =>
	value?.trim() || "Xác thực OAuth thất bại";
