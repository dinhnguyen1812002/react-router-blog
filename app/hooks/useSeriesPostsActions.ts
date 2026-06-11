import { useState } from "react";
import type { Series, SeriesPost } from "~/types";
import {
	getReorderTargetIndex,
	getSeriesPostId,
	sortSeriesPosts,
} from "~/utils/series";
import { useSeriesMutations } from "./useSeriesMutations";

interface UseSeriesPostsActionsOptions {
	seriesId: string | undefined;
	slug?: string;
	userId?: string;
	initialPosts?: SeriesPost[];
}

export function useSeriesPostsActions({
	seriesId,
	slug,
	userId,
	initialPosts = [],
}: UseSeriesPostsActionsOptions) {
	const [localPosts, setLocalPosts] = useState<SeriesPost[] | null>(null);
	const mutations = useSeriesMutations({ seriesId, slug, userId });
	const [removingPostId, setRemovingPostId] = useState<string | null>(null);

	const posts = sortSeriesPosts(localPosts ?? initialPosts);

	const syncPosts = (series?: Series | null) => {
		if (series?.posts) {
			setLocalPosts(sortSeriesPosts(series.posts));
		}
	};

	const handleMove = async (index: number, direction: "up" | "down") => {
		if (!seriesId) return;
		const post = posts[index];
		if (!post) return;

		const newOrderIndex = getReorderTargetIndex(index, direction);
		if (newOrderIndex == null) return;

		try {
			const result = await mutations.reorderSeriesPosts.mutateAsync({
				seriesId,
				data: {
					postId: getSeriesPostId(post),
					newOrderIndex,
				},
			});
			if (result.data?.posts) {
				setLocalPosts(sortSeriesPosts(result.data.posts));
			}
		} catch {
			setLocalPosts(sortSeriesPosts(initialPosts));
		}
	};

	const handleRemovePost = async (postId: string) => {
		if (!seriesId || !confirm("Xóa bài viết này khỏi series?")) return;
		setRemovingPostId(postId);
		try {
			const result = await mutations.removePostFromSeries.mutateAsync({
				seriesId,
				postId,
			});
			if (result.data?.posts) {
				setLocalPosts(sortSeriesPosts(result.data.posts));
			} else {
				setLocalPosts(posts.filter((p) => getSeriesPostId(p) !== postId));
			}
		} finally {
			setRemovingPostId(null);
		}
	};

	const handleAddPost = async (postId: string) => {
		if (!seriesId) return;
		const result = await mutations.addPostToSeries.mutateAsync({
			seriesId,
			data: { postId },
		});
		if (result.data?.posts) {
			setLocalPosts(sortSeriesPosts(result.data.posts));
		}
	};

	return {
		posts,
		localPosts,
		setLocalPosts,
		syncPosts,
		removingPostId,
		mutations,
		handleMoveUp: (index: number) => handleMove(index, "up"),
		handleMoveDown: (index: number) => handleMove(index, "down"),
		handleRemovePost,
		handleAddPost,
	};
}
