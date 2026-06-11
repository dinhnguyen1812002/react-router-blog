import { useQuery } from "@tanstack/react-query";
import { Flame, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { seriesApi } from "~/api/series";
import { SeriesList } from "~/components/series";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAuthStore } from "~/store/authStore";

type SeriesTab = "all" | "popular";

export default function SeriesIndexPage() {
	const { user } = useAuthStore();
	const [page, setPage] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
	const [activeTab, setActiveTab] = useState<SeriesTab>("all");

	const {
		data: seriesData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["series", activeTab, page, searchTerm, sortBy, sortDirection],
		queryFn: () => {
			if (searchTerm) {
				return seriesApi.searchSeries({
					keyword: searchTerm,
					page,
					size: 12,
					sortBy,
					sortDirection,
				});
			}
			if (activeTab === "popular") {
				return seriesApi.getPopularSeries(page, 12);
			}
			return seriesApi.getAllSeries(page, 12, sortBy, sortDirection);
		},
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setPage(0);
	};

	const handleSortChange = (newSortBy: string) => {
		if (sortBy === newSortBy) {
			setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
		} else {
			setSortBy(newSortBy);
			setSortDirection("DESC");
		}
		setPage(0);
	};

	const handleTabChange = (tab: string) => {
		setActiveTab(tab as SeriesTab);
		setPage(0);
	};

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<h1 className="text-2xl font-bold text-destructive mb-4">
					Có lỗi xảy ra khi tải danh sách series
				</h1>
				<p className="text-muted-foreground">Vui lòng thử lại sau.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Series</h1>
					<p className="text-muted-foreground mt-2">
						Khám phá các series bài viết thú vị
					</p>
				</div>

				{user && (
					<Button asChild>
						<Link to="/dashboard/series">
							<Plus className="h-4 w-4 mr-2" />
							Tạo Series
						</Link>
					</Button>
				)}
			</div>

			<Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
				<TabsList>
					<TabsTrigger value="all">Tất cả</TabsTrigger>
					<TabsTrigger value="popular" className="gap-1.5">
						<Flame className="h-4 w-4" />
						Phổ biến
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="mt-6 space-y-6">
					<form onSubmit={handleSearch} className="flex gap-2">
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

					{activeTab === "all" && !searchTerm && (
						<div className="flex flex-wrap gap-2">
							<Button
								variant={sortBy === "createdAt" ? "default" : "outline"}
								size="sm"
								onClick={() => handleSortChange("createdAt")}
							>
								Mới nhất{" "}
								{sortBy === "createdAt" &&
									(sortDirection === "DESC" ? "↓" : "↑")}
							</Button>
							<Button
								variant={sortBy === "title" ? "default" : "outline"}
								size="sm"
								onClick={() => handleSortChange("title")}
							>
								Tên A-Z{" "}
								{sortBy === "title" && (sortDirection === "ASC" ? "↑" : "↓")}
							</Button>
						</div>
					)}

					<SeriesList
						series={seriesData?.data?.content || []}
						loading={isLoading}
					/>

					{seriesData?.data && seriesData.data.totalPages > 1 && (
						<div className="flex justify-center">
							<div className="flex gap-2">
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
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
