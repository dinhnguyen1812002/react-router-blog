import { useCallback, useState } from "react";
import { authApi } from "~/api/auth";
import {
	resolveOAuthReturnTo,
	storeOAuthReturnTo,
	type OAuthProvider,
} from "~/lib/oauth";
import { useClientOnly, useWindow } from "~/hooks/useClientOnly";

export type { OAuthProvider } from "~/lib/oauth";

export { consumeOAuthReturnTo as getStoredOAuthReturnTo } from "~/lib/oauth";

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
					error: "Đăng nhập OAuth chỉ khả dụng trên trình duyệt",
				};
			}

			setIsLoading(true);
			setError(null);

			try {
				const returnTo = resolveOAuthReturnTo(
					windowRef.location.pathname,
					windowRef.location.search,
					windowRef.location.hash,
					options?.returnTo,
				);

				storeOAuthReturnTo(returnTo);
				windowRef.location.assign(authApi.getOAuthAuthorizationUrl(provider));

				return { success: true };
			} catch (cause) {
				const message =
					cause instanceof Error ? cause.message : "Đăng nhập OAuth thất bại";
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
