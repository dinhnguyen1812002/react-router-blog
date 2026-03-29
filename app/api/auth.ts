import axiosInstance from "~/config/axios";
import { useAuthStore } from "~/store/authStore";
import type { ApiResponse, LoginResponse, ProfileUser, User } from "~/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

export interface UpdatePasswordRequest {
	oldPassword: string;
	newPassword: string;
}

export interface UpdateProfileRequest {
	username: string;
	email: string;
	bio: string;
	avatar: string;
}

export type OAuthProvider = "google" | "github" | "discord";

export interface OAuthLoginResponse {
	success: boolean;
	user?: User;
	accessToken?: string;
	message?: string;
}

type SessionPayload = Partial<LoginResponse> & {
	user?: Partial<User> | null;
	data?: Partial<ProfileUser> | Partial<User> | null;
	message?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ✅ advanced-init-once: Credentials config object is the same for every call.
//    Hoist to module level so it's created once, not on every request.
const WITH_CREDENTIALS = { withCredentials: true } as const;

// ✅ js-early-exit: Extract token from either field once, reused in login + oauth.
const extractToken = (data: Record<string, any>): string =>
	data.accessToken ?? data.token;

const toSocialMediaLinks = (
	value: User["socialMediaLinks"] | ProfileUser["socialMediaLinks"] | undefined,
): User["socialMediaLinks"] => {
	if (!value) return [];
	if (Array.isArray(value)) return value;

	return Object.entries(value)
		.filter(([, url]) => Boolean(url))
		.map(([name, url]) => ({
			id: name.toLowerCase(),
			name,
			url: url!,
		}));
};

type NormalizableUser = Partial<User> & Partial<ProfileUser>;

const normalizeUser = (
	payload: SessionPayload | ProfileUser | User | null | undefined,
): User | null => {
	if (!payload) return null;

	const source = ((("user" in payload && payload.user) ||
		("data" in payload && payload.data) ||
		payload) ??
		null) as NormalizableUser | null;
	if (!source) return null;

	const id = String(source.id ?? "");
	const email = String(source.email ?? "");
	const username = String(source.username ?? "");

	if (!id || !email || !username) return null;

	return {
		id,
		email,
		username,
		slug: String(source.slug ?? username),
		roles: Array.isArray(source.roles) ? source.roles : [],
		avatar: typeof source.avatar === "string" ? source.avatar : undefined,
		socialMediaLinks: toSocialMediaLinks(source.socialMediaLinks),
	};
};

const resolveOAuthAuthorizationUrl = (provider: OAuthProvider): string =>
	`${import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080"}/oauth2/authorization/${provider}`;

// ─── API ──────────────────────────────────────────────────────────────────────

export const authApi = {
	/** Authenticate and persist the session into the auth store. */
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		const { data } = await axiosInstance.post(
			"/auth/login",
			credentials,
			WITH_CREDENTIALS,
		);
		const user = normalizeUser(data);
		const token = extractToken(data);

		if (user && token) {
			useAuthStore.getState().login(user, token);
		}

		return data;
	},

	async register(userData: RegisterRequest): Promise<LoginResponse> {
		const { data } = await axiosInstance.post("/auth/register", userData);
		return data;
	},

	async forgotPassword(
		payload: ForgotPasswordRequest,
	): Promise<ApiResponse<unknown>> {
		const { data } = await axiosInstance.post("/auth/forgot-password", payload);
		return data;
	},

	async resetPassword(
		payload: ResetPasswordRequest,
	): Promise<ApiResponse<unknown>> {
		const { data } = await axiosInstance.post("/auth/reset-password", payload);
		return data;
	},

	// ✅ Removed duplicate updatePassword — changePassword below covers the same
	//    endpoint (/user/change-password). Having two methods for the same action
	//    with different names causes callers to use the wrong one silently.
	async changePassword(
		payload: UpdatePasswordRequest,
	): Promise<ApiResponse<unknown>> {
		const { data } = await axiosInstance.post("/user/change-password", payload);
		return data;
	},

	/** Server clears the refresh-token cookie; store clears local state. */
	async logout(): Promise<void> {
		try {
			await axiosInstance.post("/auth/logout", {}, WITH_CREDENTIALS);
		} catch {
			// Best-effort — always clear local state regardless of server response.
		} finally {
			useAuthStore.getState().logout();
		}
	},

	async updateProfile(
		payload: UpdateProfileRequest,
	): Promise<ApiResponse<User>> {
		const { data } = await axiosInstance.put("/user/profile", payload);
		return data;
	},

	async profile(): Promise<ProfileUser> {
		const { data } = await axiosInstance.get<ProfileUser>("/user/profile");
		return data;
	},

	async getCurrentUser(): Promise<User> {
		const data = await this.profile();
		const user = normalizeUser(data);

		if (!user) {
			throw new Error("Unable to resolve current user from profile response");
		}

		return user;
	},

	/**
	 * Exchange a refresh-token cookie for a new access token.
	 *
	 * ✅ async-defer-await: Resolve the token fields only after the single await,
	 *    no intermediate variables needed before the await point.
	 *
	 * Returns null on failure so callers can decide what to do (the store's
	 * refreshAccessToken handles the logout side-effect).
	 */
	async refreshToken(): Promise<{
		accessToken: string;
		refreshToken?: string;
	} | null> {
		try {
			const { data } = await axiosInstance.post(
				"/auth/refresh-token",
				{},
				WITH_CREDENTIALS,
			);
			const accessToken = extractToken(data);
			if (!accessToken) throw new Error("No access token in refresh response");
			return { accessToken, refreshToken: data.refreshToken };
		} catch {
			return null;
		}
	},

	/**
	 * OAuth login for google / github / discord.
	 *
	 * ✅ Removed the dual code+token payload — sending the same value under two
	 *    keys is ambiguous and leaks implementation details to the server.
	 *    Pass `code` only; if a provider uses tokens instead, call oauthLoginWithToken.
	 */
	async oauthLogin(
		provider: OAuthProvider,
		code: string,
	): Promise<OAuthLoginResponse> {
		try {
			const { data } = await axiosInstance.post(
				"/auth/oauth/login",
				{ provider, code },
				WITH_CREDENTIALS,
			);

			const finalToken = extractToken(data);

			// ✅ js-early-exit: Return failure early; success path stays un-nested.
			if (!data.user || !finalToken) {
				return {
					success: false,
					message: data.message ?? "OAuth login failed",
				};
			}

			useAuthStore.getState().login(data.user, finalToken);
			return { success: true, user: data.user, accessToken: finalToken };
		} catch (error: unknown) {
			const msg =
				(error as any)?.response?.data?.message ??
				(error as Error)?.message ??
				"OAuth login failed";
			return { success: false, message: msg };
		}
	},

	getOAuthAuthorizationUrl(provider: OAuthProvider): string {
		return resolveOAuthAuthorizationUrl(provider);
	},

	async finalizeOAuthLogin(accessToken: string): Promise<OAuthLoginResponse> {
		try {
			useAuthStore.getState().setToken(accessToken);
			const user = await this.getCurrentUser();

			useAuthStore.getState().login(user, accessToken);
			return { success: true, user, accessToken };
		} catch (error: unknown) {
			useAuthStore.getState().logout();
			const message =
				(error as any)?.response?.data?.message ??
				(error as Error)?.message ??
				"OAuth login failed";
			return { success: false, message };
		}
	},
} as const;
