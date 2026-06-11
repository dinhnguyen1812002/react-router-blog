import type { Series, SeriesPost } from "~/types";

export function getSeriesPostId(post: SeriesPost): string {
	return post.postId;
}

export function sortSeriesPosts(posts: SeriesPost[]): SeriesPost[] {
	return [...posts].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getSeriesPostCount(series: Series): number {
	return series.totalPosts ?? series.postCount ?? series.posts?.length ?? 0;
}

/** Vị trí mới (1-based) khi di chuyển bài trong series. */
export function getReorderTargetIndex(
	currentIndex: number,
	direction: "up" | "down",
): number | null {
	if (direction === "up") {
		if (currentIndex <= 0) return null;
		return currentIndex;
	}
	return currentIndex + 2;
}
