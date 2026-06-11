import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Settings } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { seriesApi } from "~/api/series";
import { SeriesDetail } from "~/components/series";
import { Button } from "~/components/ui/button";

export default function SeriesDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: seriesData, isLoading } = useQuery({
		queryKey: ["series-detail", id],
		queryFn: () => seriesApi.getSeriesById(id!),
		enabled: !!id,
	});

	const series = seriesData?.data;

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
				<Link
					to="/dashboard/series"
					className="text-primary underline"
				>
					Quay lại danh sách
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header Actions */}
			<div className="flex items-center justify-between">
				<Link
					to="/dashboard/series"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Quay lại danh sách
				</Link>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate(`/dashboard/series/${id}/edit`)}
					>
						<Edit className="w-4 h-4 mr-2" />
						Chỉnh sửa
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate(`/dashboard/series/${id}/manage`)}
					>
						<Settings className="w-4 h-4 mr-2" />
						Quản lý
					</Button>
				</div>
			</div>

			{/* Series Detail Content */}
			<SeriesDetail series={series} backLink="/dashboard/series" />
		</div>
	);
}
