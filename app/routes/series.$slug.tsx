import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { seriesApi } from "~/api/series";
import { AddPostToSeriesModal, SeriesDetail } from "~/components/series";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { useSeriesPostsActions } from "~/hooks/useSeriesPostsActions";
import { useAuthStore } from "~/store/authStore";
import { sortSeriesPosts } from "~/utils/series";

export default function SeriesDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const [isAddPostOpen, setIsAddPostOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const {
		data: seriesData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["series-slug", slug],
		queryFn: () => seriesApi.getSeriesBySlug(slug!),
		enabled: !!slug,
	});

	const series = seriesData?.data;
	const sortedInitial = sortSeriesPosts(series?.posts ?? []);
	const isOwner =
		!!user?.id &&
		(user.id === series?.author?.id || user.id === series?.userId);

	const {
		posts,
		syncPosts,
		removingPostId,
		mutations,
		handleMoveUp,
		handleMoveDown,
		handleRemovePost,
		handleAddPost,
	} = useSeriesPostsActions({
		seriesId: series?.id,
		slug,
		userId: user?.id,
		initialPosts: sortedInitial,
	});

	useEffect(() => {
		if (series?.posts) {
			syncPosts(series);
		}
	}, [series?.posts, series?.updatedAt]);

	const handleDeleteSeries = async () => {
		if (!series?.id) return;
		await mutations.deleteSeries.mutateAsync(series.id);
		navigate("/series");
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-6 max-w-4xl mx-auto">
					<div className="h-8 bg-muted rounded w-1/3" />
					<div className="h-64 bg-muted rounded" />
				</div>
			</div>
		);
	}

	if (error || !series) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-bold text-destructive mb-4">
					Không tìm thấy series
				</h1>
				<p className="text-muted-foreground">
					Series không tồn tại hoặc đã bị xóa.
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<SeriesDetail
				series={{ ...series, posts }}
				showActions={isOwner}
				backLink="/series"
				onEdit={
					isOwner
						? () => navigate(`/dashboard/series/${series.id}/edit`)
						: undefined
				}
				onDelete={isOwner ? () => setDeleteOpen(true) : undefined}
				onAddPost={isOwner ? () => setIsAddPostOpen(true) : undefined}
				posts={posts}
				onMovePostUp={isOwner ? handleMoveUp : undefined}
				onMovePostDown={isOwner ? handleMoveDown : undefined}
				onRemovePost={isOwner ? handleRemovePost : undefined}
				isReordering={mutations.reorderSeriesPosts.isPending}
				removingPostId={removingPostId}
			/>

			{isOwner ? (
				<>
					<AddPostToSeriesModal
						isOpen={isAddPostOpen}
						onClose={() => setIsAddPostOpen(false)}
						series={{ ...series, posts }}
						onAddPost={handleAddPost}
						loading={mutations.addPostToSeries.isPending}
					/>
					<ConfirmDialog
						open={deleteOpen}
						onOpenChange={setDeleteOpen}
						title="Xóa series"
						description={`Bạn có chắc muốn xóa series "${series.title}"?`}
						onConfirm={handleDeleteSeries}
						isPending={mutations.deleteSeries.isPending}
					/>
				</>
			) : null}
		</div>
	);
}
