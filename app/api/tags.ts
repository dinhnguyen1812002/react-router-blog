import type { ApiResponse, Tag } from "~/types";
import { apiClient } from "./client";

const unwrap = <T>(data: unknown): T => {
	if (
		data &&
		typeof data === "object" &&
		"data" in data &&
		(data as { data: unknown }).data !== undefined &&
		(data as { data: unknown }).data !== null
	) {
		return (data as { data: T }).data;
	}
	return data as T;
};

export const tagsApi = {
	getAll: async (): Promise<Tag[]> => {
		const response = await apiClient.get<Tag[]>("/tags");
		return unwrap<Tag[]>(response.data) ?? [];
	},

	getById: async (id: string): Promise<ApiResponse<Tag>> => {
		const response = await apiClient.get(`/tags/${id}`);
		return unwrap<ApiResponse<Tag>>(response.data);
	},

	create: async (data: Partial<Tag>): Promise<ApiResponse<Tag>> => {
		const response = await apiClient.post("/tags", { name: data.name ?? "" });
		return unwrap<ApiResponse<Tag>>(response.data);
	},

	update: async (id: string, data: Partial<Tag>): Promise<ApiResponse<Tag>> => {
		const response = await apiClient.put(`/tags/${id}`, {
			name: data.name ?? "",
		});
		return unwrap<ApiResponse<Tag>>(response.data);
	},

	delete: async (id: string): Promise<void> => {
		await apiClient.delete(`/tags/${id}`);
	},
};
