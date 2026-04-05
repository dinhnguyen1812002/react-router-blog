import { apiClient } from "./client";

export interface ApiKeyCreated {
	id: string;
	apiKey: string;
	apiSecret: string;
	name: string;
	createdAt: string;
}

export interface ApiKeyListItem {
	id: string;
	apiKey: string;
	name: string;
	createdAt: string;
}

function normalizeList(data: unknown): ApiKeyListItem[] {
	if (Array.isArray(data)) return data as ApiKeyListItem[];
	if (
		data &&
		typeof data === "object" &&
		"content" in data &&
		Array.isArray((data as { content: unknown }).content)
	) {
		return (data as { content: ApiKeyListItem[] }).content;
	}
	return [];
}

const handleError = (error: unknown, action: string): never => {
	const message =
		(error as { response?: { data?: { message?: string } } })?.response?.data
			?.message ??
		(error as Error)?.message ??
		`Không thể ${action}. Vui lòng thử lại.`;
	throw new Error(message);
};

export const apiKeysApi = {
	list: async (): Promise<ApiKeyListItem[]> => {
		try {
			const { data } = await apiClient.get<unknown>("/api-keys");
			return normalizeList(data);
		} catch (error) {
			return handleError(error, "tải danh sách khóa API");
		}
	},

	create: async (name: string): Promise<ApiKeyCreated> => {
		try {
			const { data } = await apiClient.post<ApiKeyCreated>("/api-keys", {
				name,
			});
			return data;
		} catch (error) {
			return handleError(error, "tạo khóa API");
		}
	},

	revoke: async (id: string): Promise<void> => {
		try {
			await apiClient.delete(`/api-keys/${id}`);
		} catch (error) {
			return handleError(error, "thu hồi khóa API");
		}
	},
} as const;
