import { apiClient } from "./client";

export type GlobalSearchItem = {
	title: string;
	slug: string;
	thumbnail: string;
	authorName: string;
	view: number;
	like: number;
};

export type GlobalSearchResponse = {
	posts: GlobalSearchItem[];
	series: GlobalSearchItem[];
	users: GlobalSearchItem[];
};

export const searchApi = {
	globalSearch: async (
		q: string,
		signal?: AbortSignal,
	): Promise<GlobalSearchResponse> => {
		const response = await apiClient.get<GlobalSearchResponse>("/search", {
			params: { q },
			signal,
		});
		return response.data;
	},
};
