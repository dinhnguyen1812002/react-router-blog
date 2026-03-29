import { useCallback, useState } from "react";
import { authApi, type OAuthProvider } from "~/api/auth";
import { useClientOnly, useWindow } from "~/hooks/useClientOnly";

export type { OAuthProvider } from "~/api/auth";

const OAUTH_REDIRECT_STORAGE_KEY = "oauth:return-to";
const AUTH_ROUTES = new Set(["/login", "/register", "/oauth2/redirect"]);

const sanitizeReturnTo = (value: string | null | undefined): string => {
	if (!value || !value.startsWith("/") || value.startsWith("//")) {
		return "/";
	}

	return value;
};

export const getStoredOAuthReturnTo = (): string => {
	if (typeof window === "undefined") return "/";

	const value = window.sessionStorage.getItem(OAUTH_REDIRECT_STORAGE_KEY);
	window.sessionStorage.removeItem(OAUTH_REDIRECT_STORAGE_KEY);
	return sanitizeReturnTo(value);
};

export type OAuthLoginResult =
	| { success: true }
	| { success: false; error: string };

export const useOAuthLogin = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const isClient = useClientOnly();
	const windowRef = useWindow();

	const loginWithOAuth = useCallback(
		async (
			provider: OAuthProvider,
			options?: { returnTo?: string },
		): Promise<OAuthLoginResult> => {
			if (!isClient || !windowRef) {
				return {
					success: false,
					error: "OAuth login is only available in the browser",
				};
			}

			setIsLoading(true);
			setError(null);

			try {
				const currentPath = `${windowRef.location.pathname}${windowRef.location.search}${windowRef.location.hash}`;
				const returnTo = sanitizeReturnTo(
					options?.returnTo ??
						(AUTH_ROUTES.has(windowRef.location.pathname) ? "/" : currentPath),
				);

				windowRef.sessionStorage.setItem(OAUTH_REDIRECT_STORAGE_KEY, returnTo);
				windowRef.location.assign(authApi.getOAuthAuthorizationUrl(provider));

				return { success: true };
			} catch (cause) {
				const message =
					cause instanceof Error ? cause.message : "OAuth login failed";
				setError(message);
				setIsLoading(false);
				return { success: false, error: message };
			}
		},
		[isClient, windowRef],
	);

	return {
		loginWithOAuth,
		isLoading,
		error,
		isClient,
	};
};
