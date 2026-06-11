import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { seriesApi } from "~/api/series";
import type {
	AddPostToSeriesRequest,
	CreateSeriesRequest,
	ReorderSeriesPostsRequest,
	UpdateSeriesRequest,
} from "~/types";

type InvalidateKeys = {
	seriesId?: string;
	slug?: string;
	userId?: string;
};

function invalidateSeriesQueries(
	queryClient: ReturnType<typeof useQueryClient>,
	keys: InvalidateKeys,
) {
	queryClient.invalidateQueries({ queryKey: ["user-series"] });
	queryClient.invalidateQueries({ queryKey: ["series"] });
	if (keys.seriesId) {
		queryClient.invalidateQueries({
			queryKey: ["series-detail", keys.seriesId],
		});
		queryClient.invalidateQueries({ queryKey: ["series", keys.seriesId] });
	}
	if (keys.slug) {
		queryClient.invalidateQueries({ queryKey: ["series-slug", keys.slug] });
	}
	if (keys.userId) {
		queryClient.invalidateQueries({ queryKey: ["user-series", keys.userId] });
	}
}

export function useSeriesMutations(keys: InvalidateKeys = {}) {
	const queryClient = useQueryClient();

	const createSeries = useMutation({
		mutationFn: (data: CreateSeriesRequest) => seriesApi.createSeries(data),
		onSuccess: () => {
			invalidateSeriesQueries(queryClient, keys);
			toast.success("Tạo series thành công!");
		},
		onError: () => toast.error("Có lỗi xảy ra khi tạo series"),
	});

	const updateSeries = useMutation({
		mutationFn: ({
			seriesId,
			data,
		}: {
			seriesId: string;
			data: UpdateSeriesRequest;
		}) => seriesApi.updateSeries(seriesId, data),
		onSuccess: () => {
			invalidateSeriesQueries(queryClient, keys);
			toast.success("Cập nhật series thành công!");
		},
		onError: () => toast.error("Có lỗi xảy ra khi cập nhật series"),
	});

	const deleteSeries = useMutation({
		mutationFn: (seriesId: string) => seriesApi.deleteSeries(seriesId),
		onSuccess: () => {
			invalidateSeriesQueries(queryClient, keys);
			toast.success("Xóa series thành công!");
		},
		onError: () => toast.error("Có lỗi xảy ra khi xóa series"),
	});

	const addPostToSeries = useMutation({
		mutationFn: ({
			seriesId,
			data,
		}: {
			seriesId: string;
			data: AddPostToSeriesRequest;
		}) => seriesApi.addPostToSeries(seriesId, data),
		onSuccess: () => {
			invalidateSeriesQueries(queryClient, keys);
			toast.success("Thêm bài viết vào series thành công!");
		},
		onError: () => toast.error("Có lỗi xảy ra khi thêm bài viết"),
	});

	const removePostFromSeries = useMutation({
		mutationFn: ({
			seriesId,
			postId,
		}: {
			seriesId: string;
			postId: string;
		}) => seriesApi.removePostFromSeries(seriesId, postId),
		onSuccess: () => {
			invalidateSeriesQueries(queryClient, keys);
			toast.success("Đã xóa bài viết khỏi series");
		},
		onError: () => toast.error("Có lỗi xảy ra khi xóa bài viết"),
	});

	const reorderSeriesPosts = useMutation({
		mutationFn: ({
			seriesId,
			data,
		}: {
			seriesId: string;
			data: ReorderSeriesPostsRequest;
		}) => seriesApi.reorderSeriesPosts(seriesId, data),
		onSuccess: () => {
			invalidateSeriesQueries(queryClient, keys);
		},
		onError: () => toast.error("Có lỗi xảy ra khi sắp xếp bài viết"),
	});

	return {
		createSeries,
		updateSeries,
		deleteSeries,
		addPostToSeries,
		removePostFromSeries,
		reorderSeriesPosts,
	};
}
