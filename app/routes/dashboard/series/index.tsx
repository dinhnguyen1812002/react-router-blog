import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { seriesApi } from "~/api/series";
import {
	AddPostToSeriesModal,
	SeriesList,
	SeriesModal,
} from "~/components/series";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useSeriesMutations } from "~/hooks/useSeriesMutations";
import { useAuthStore } from "~/store/authStore";
import type { Series } from "~/types";

export default function DashboardSeriesPage() {
	const navigate = useNavigate();
	const { user } = useAuthStore();

	const [page, setPage] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
	const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);

	const mutations = useSeriesMutations({ userId: user?.id });

	const { data: seriesData, isLoading } = useQuery({
		queryKey: ["user-series", user?.id, page, searchTerm],
		queryFn: () => {
			if (searchTerm) {
				return seriesApi.searchSeries({
					keyword: searchTerm,
					authorId: user?.id,
					page,
					size: 12,
				});
			}
			return seriesApi.getSeriesByUser(user?.id!, page, 12);
		},
		enabled: !!user?.id,
	});

	const handleCreateSeries = async (
		data: Parameters<typeof mutations.createSeries.mutateAsync>[0],
	) => {
		const result = await mutations.createSeries.mutateAsync(data);
		setIsCreateModalOpen(false);
		if (result.data?.id) {
			navigate(`/dashboard/series/${result.data.id}/manage`);
		}
	};

	const handleUpdateSeries = async (
		data: Parameters<typeof mutations.updateSeries.mutateAsync>[0]["data"],
	) => {
		if (!selectedSeries) return;
		await mutations.updateSeries.mutateAsync({
			seriesId: selectedSeries.id,
			data,
		});
		setIsEditModalOpen(false);
		setSelectedSeries(null);
	};

	const handleDeleteSeries = async (series: Series) => {
		if (!confirm(`Xóa series "${series.title}"?`)) return;
		await mutations.deleteSeries.mutateAsync(series.id);
	};

	const handleAddPost = async (postId: string) => {
		if (!selectedSeries) return;
		await mutations.addPostToSeries.mutateAsync({
			seriesId: selectedSeries.id,
			data: { postId },
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Quản lý Series</h1>
					<p className="text-muted-foreground mt-1">
						Tạo và quản lý các series bài viết của bạn
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" asChild>
						<Link to="/dashboard/series/new">Tạo mới</Link>
					</Button>
					<Button onClick={() => setIsCreateModalOpen(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Tạo nhanh
					</Button>
				</div>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					setPage(0);
				}}
				className="flex gap-2"
			>
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm series..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Button type="submit">Tìm kiếm</Button>
			</form>

			<SeriesList
				series={seriesData?.data?.content || []}
				loading={isLoading}
				showActions
				onManage={(s) => navigate(`/dashboard/series/${s.id}/manage`)}
				onEdit={(s) => {
					setSelectedSeries(s);
					setIsEditModalOpen(true);
				}}
				onDelete={handleDeleteSeries}
				onAddPost={(s) => {
					setSelectedSeries(s);
					setIsAddPostModalOpen(true);
				}}
			/>

			{seriesData?.data && seriesData.data.totalPages > 1 && (
				<div className="flex justify-center gap-2">
					<Button
						variant="outline"
						onClick={() => setPage(page - 1)}
						disabled={page === 0}
					>
						Trước
					</Button>
					<span className="flex items-center px-4 text-sm text-muted-foreground">
						Trang {page + 1} / {seriesData.data.totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() => setPage(page + 1)}
						disabled={page >= seriesData.data.totalPages - 1}
					>
						Sau
					</Button>
				</div>
			)}

			<SeriesModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmitCreate={handleCreateSeries}
				onSubmitUpdate={handleUpdateSeries}
				loading={mutations.createSeries.isPending}
			/>

			<SeriesModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedSeries(null);
				}}
				onSubmitCreate={handleCreateSeries}
				onSubmitUpdate={handleUpdateSeries}
				series={selectedSeries}
				loading={mutations.updateSeries.isPending}
			/>

			<AddPostToSeriesModal
				isOpen={isAddPostModalOpen}
				onClose={() => {
					setIsAddPostModalOpen(false);
					setSelectedSeries(null);
				}}
				series={selectedSeries}
				onAddPost={handleAddPost}
				loading={mutations.addPostToSeries.isPending}
			/>
		</div>
	);
}
