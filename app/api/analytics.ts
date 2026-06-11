import type {
	AnalyticsSummary,
	ExportReportRequest,
	MonthlyCountStat,
	MonthlyGrowthStat,
	TopAuthorStat,
	TopPostStat,
} from "~/types/analytics";
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

const analyticsBase = "/admin/analytics";

export const analyticsApi = {
	getSummary: async (): Promise<AnalyticsSummary> => {
		const response = await apiClient.get(`${analyticsBase}/summary`);
		return unwrap<AnalyticsSummary>(response.data);
	},

	getMonthlyGrowth: async (year: number): Promise<MonthlyGrowthStat[]> => {
		const response = await apiClient.get(
			`${analyticsBase}/growth/monthly?year=${year}`,
		);
		return unwrap<MonthlyGrowthStat[]>(response.data) ?? [];
	},

	getNewUsersMonthly: async (year: number): Promise<MonthlyCountStat[]> => {
		const response = await apiClient.get(
			`${analyticsBase}/users/monthly?year=${year}`,
		);
		return unwrap<MonthlyCountStat[]>(response.data) ?? [];
	},

	getPostsMonthly: async (year: number): Promise<MonthlyCountStat[]> => {
		const response = await apiClient.get(
			`${analyticsBase}/posts/monthly?year=${year}`,
		);
		return unwrap<MonthlyCountStat[]>(response.data) ?? [];
	},

	getTopViewedPosts: async (limit = 10): Promise<TopPostStat[]> => {
		const response = await apiClient.get(
			`${analyticsBase}/posts/top-viewed?limit=${limit}`,
		);
		return unwrap<TopPostStat[]>(response.data) ?? [];
	},

	getTopLikedPosts: async (limit = 10): Promise<TopPostStat[]> => {
		const response = await apiClient.get(
			`${analyticsBase}/posts/top-liked?limit=${limit}`,
		);
		return unwrap<TopPostStat[]>(response.data) ?? [];
	},

	getTopPopularPosts: async (limit = 10): Promise<TopPostStat[]> => {
		const response = await apiClient.get(
			`${analyticsBase}/posts/top-popular?limit=${limit}`,
		);
		return unwrap<TopPostStat[]>(response.data) ?? [];
	},

	getTopAuthors: async (limit = 10): Promise<TopAuthorStat[]> => {
		const response = await apiClient.get(
			`${analyticsBase}/authors/top?limit=${limit}`,
		);
		return unwrap<TopAuthorStat[]>(response.data) ?? [];
	},

	exportReport: async (payload: ExportReportRequest): Promise<Blob> => {
		const response = await apiClient.post(
			`${analyticsBase}/export`,
			payload,
			{ responseType: "blob" },
		);
		return response.data;
	},
};

export const downloadAnalyticsReport = (
	blob: Blob,
	filename: string,
): void => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

export const getExportFilename = (
	format: ExportReportRequest["exportFormat"],
	reportType: ExportReportRequest["reportType"],
	year: number,
	month?: number | null,
	quarter?: number | null,
): string => {
	const ext = format === "PDF" ? "pdf" : "xlsx";
	const period =
		reportType === "MONTH" && month
			? `${year}_${String(month).padStart(2, "0")}`
			: reportType === "QUARTER" && quarter
				? `${year}_Q${quarter}`
				: `${year}`;
	return `analytics_report_${period}.${ext}`;
};
