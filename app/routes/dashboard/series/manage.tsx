import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { seriesApi } from "~/api/series";
import { AddPostToSeriesModal, SeriesDetail } from "~/components/series";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { useSeriesPostsActions } from "~/hooks/useSeriesPostsActions";
import { sortSeriesPosts } from "~/utils/series";

export default function ManageSeriesPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isAddPostOpen, setIsAddPostOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const { data: seriesData, isLoading } = useQuery({
		queryKey: ["series-detail", id],
		queryFn: () => seriesApi.getSeriesById(id!),
		enabled: !!id,
	});

	const series = seriesData?.data;
	const sortedInitial = sortSeriesPosts(series?.posts ?? []);

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
		seriesId: id,
		slug: series?.slug,
		initialPosts: sortedInitial,
	});

	useEffect(() => {
		if (series?.posts) {
			syncPosts(series);
		}
	}, [series?.posts, series?.updatedAt]);

	const handleDeleteSeries = async () => {
		if (!id) return;
		await mutations.deleteSeries.mutateAsync(id);
		navigate("/dashboard/series");
	};

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto animate-pulse space-y-4">
				<div className="h-8 bg-muted rounded w-1/3" />
				<div className="h-48 bg-muted rounded" />
				<div className="h-64 bg-muted rounded" />
			</div>
		);
	}

	if (!series) {
		return (
			<div className="max-w-4xl mx-auto text-center py-12">
				<h1 className="text-2xl font-bold text-destructive mb-4">
					Không tìm thấy series
				</h1>
				<button
					type="button"
					className="text-primary underline"
					onClick={() => navigate("/dashboard/series")}
				>
					Quay lại danh sách
				</button>
			</div>
		);
	}

	return (
		<>
			<SeriesDetail
			
				series={{ ...series, posts }}
				showActions
				backLink="/dashboard/series"
				backLabel="Quay lại danh sách"
				onEdit={() => navigate(`/dashboard/series/${id}/edit`)}
				onDelete={() => setDeleteOpen(true)}
				onAddPost={() => setIsAddPostOpen(true)}
				posts={posts}
				onMovePostUp={handleMoveUp}
				onMovePostDown={handleMoveDown}
				onRemovePost={handleRemovePost}
				isReordering={mutations.reorderSeriesPosts.isPending}
				removingPostId={removingPostId}
			/>

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
	);
}
