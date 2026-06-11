import type { ApiResponse, Category } from "~/types";
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

const toApiName = (data: Partial<Category>): { name: string } => ({
	name: data.category ?? (data as { name?: string }).name ?? "",
});

export const categoriesApi = {
	getAll: async (): Promise<Category[]> => {
		const response = await apiClient.get("/categories");
		return unwrap<Category[]>(response.data) ?? [];
	},

	getById: async (id: string): Promise<ApiResponse<Category>> => {
		const response = await apiClient.get(`/categories/${id}`);
		return unwrap<ApiResponse<Category>>(response.data);
	},

	create: async (data: Partial<Category>): Promise<ApiResponse<Category>> => {
		const response = await apiClient.post("/categories", toApiName(data));
		return unwrap<ApiResponse<Category>>(response.data);
	},

	update: async (
		id: string,
		data: Partial<Category>,
	): Promise<ApiResponse<Category>> => {
		const response = await apiClient.put(`/categories/${id}`, toApiName(data));
		return unwrap<ApiResponse<Category>>(response.data);
	},

	delete: async (id: string): Promise<void> => {
		await apiClient.delete(`/categories/${id}`);
	},
};
