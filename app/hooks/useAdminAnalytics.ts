import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import {
	analyticsApi,
	downloadAnalyticsReport,
	getExportFilename,
} from "~/api/analytics";
import type { ExportReportRequest } from "~/types/analytics";

const STALE_TIME = 1000 * 60 * 5;

export const analyticsKeys = {
	all: ["admin", "analytics"] as const,
	summary: () => [...analyticsKeys.all, "summary"] as const,
	monthlyGrowth: (year: number) =>
		[...analyticsKeys.all, "growth", year] as const,
	newUsersMonthly: (year: number) =>
		[...analyticsKeys.all, "users", year] as const,
	postsMonthly: (year: number) =>
		[...analyticsKeys.all, "posts", year] as const,
	topViewed: (limit: number) =>
		[...analyticsKeys.all, "top-viewed", limit] as const,
	topLiked: (limit: number) =>
		[...analyticsKeys.all, "top-liked", limit] as const,
	topPopular: (limit: number) =>
		[...analyticsKeys.all, "top-popular", limit] as const,
	topAuthors: (limit: number) =>
		[...analyticsKeys.all, "top-authors", limit] as const,
};

export const useAnalyticsSummary = () =>
	useQuery({
		queryKey: analyticsKeys.summary(),
		queryFn: analyticsApi.getSummary,
		staleTime: STALE_TIME,
		retry: 1,
		refetchOnWindowFocus: false,
	});

export const useTopViewedPosts = (limit = 5) =>
	useQuery({
		queryKey: analyticsKeys.topViewed(limit),
		queryFn: () => analyticsApi.getTopViewedPosts(limit),
		staleTime: STALE_TIME,
		retry: 1,
		refetchOnWindowFocus: false,
	});

export const useTopLikedPosts = (limit = 5) =>
	useQuery({
		queryKey: analyticsKeys.topLiked(limit),
		queryFn: () => analyticsApi.getTopLikedPosts(limit),
		staleTime: STALE_TIME,
		retry: 1,
		refetchOnWindowFocus: false,
	});

export const useTopPopularPosts = (limit = 10) =>
	useQuery({
		queryKey: analyticsKeys.topPopular(limit),
		queryFn: () => analyticsApi.getTopPopularPosts(limit),
		staleTime: STALE_TIME,
		retry: 1,
		refetchOnWindowFocus: false,
	});

export const useTopAuthors = (limit = 10) =>
	useQuery({
		queryKey: analyticsKeys.topAuthors(limit),
		queryFn: () => analyticsApi.getTopAuthors(limit),
		staleTime: STALE_TIME,
		retry: 1,
		refetchOnWindowFocus: false,
	});

export const useMonthlyGrowth = (year: number) =>
	useQuery({
		queryKey: analyticsKeys.monthlyGrowth(year),
		queryFn: () => analyticsApi.getMonthlyGrowth(year),
		staleTime: STALE_TIME,
		retry: 1,
		refetchOnWindowFocus: false,
		enabled: year > 2000,
	});

export const useAnalyticsDashboard = (year: number, topLimit = 10) => {
	const results = useQueries({
		queries: [
			{
				queryKey: analyticsKeys.summary(),
				queryFn: analyticsApi.getSummary,
				staleTime: STALE_TIME,
				retry: 1,
			},
			{
				queryKey: analyticsKeys.monthlyGrowth(year),
				queryFn: () => analyticsApi.getMonthlyGrowth(year),
				staleTime: STALE_TIME,
				retry: 1,
				enabled: year > 2000,
			},
			{
				queryKey: analyticsKeys.newUsersMonthly(year),
				queryFn: () => analyticsApi.getNewUsersMonthly(year),
				staleTime: STALE_TIME,
				retry: 1,
				enabled: year > 2000,
			},
			{
				queryKey: analyticsKeys.postsMonthly(year),
				queryFn: () => analyticsApi.getPostsMonthly(year),
				staleTime: STALE_TIME,
				retry: 1,
				enabled: year > 2000,
			},
			{
				queryKey: analyticsKeys.topPopular(topLimit),
				queryFn: () => analyticsApi.getTopPopularPosts(topLimit),
				staleTime: STALE_TIME,
				retry: 1,
			},
			{
				queryKey: analyticsKeys.topAuthors(topLimit),
				queryFn: () => analyticsApi.getTopAuthors(topLimit),
				staleTime: STALE_TIME,
				retry: 1,
			},
		],
	});

	const [
		summary,
		monthlyGrowth,
		newUsersMonthly,
		postsMonthly,
		topPopular,
		topAuthors,
	] = results;

	return {
		summary: summary.data,
		monthlyGrowth: monthlyGrowth.data ?? [],
		newUsersMonthly: newUsersMonthly.data ?? [],
		postsMonthly: postsMonthly.data ?? [],
		topPopular: topPopular.data ?? [],
		topAuthors: topAuthors.data ?? [],
		isLoading: results.some((r) => r.isLoading),
		isRefetching: results.some((r) => r.isFetching && !r.isLoading),
		error: results.find((r) => r.error)?.error ?? null,
		refetch: () => results.forEach((r) => r.refetch()),
	};
};

export const useExportAnalyticsReport = () =>
	useMutation({
		mutationFn: async (payload: ExportReportRequest) => {
			const blob = await analyticsApi.exportReport(payload);
			const filename = getExportFilename(
				payload.exportFormat,
				payload.reportType,
				payload.year,
				payload.month,
				payload.quarter,
			);
			downloadAnalyticsReport(blob, filename);
		},
	});
