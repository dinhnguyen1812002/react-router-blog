import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input";
import { SeriesList } from "~/components/series";
import { seriesApi } from "~/api/series";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router";

export default function SeriesIndexPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  const { data: seriesData, isLoading, error } = useQuery({
    queryKey: ["series", page, searchTerm, sortBy, sortDirection],
    queryFn: () => {
      if (searchTerm) {
        return seriesApi.searchSeries({
          keyword: searchTerm,
          page,
          size: 12,
          sortBy,
          sortDirection,
        });
      } else {
        return seriesApi.getAllSeries(page, 12, sortBy, sortDirection);
      }
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Có lỗi xảy ra khi tải danh sách series
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Series
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Khám phá các series bài viết thú vị
          </p>
        </div>
        
        <Button asChild>
          <Link to="/dashboard/series">
            <Plus className="h-4 w-4 mr-2" />
            Tạo Series
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
        </form>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy === "createdAt" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("createdAt")}
          >
            Mới nhất {sortBy === "createdAt" && (sortDirection === "DESC" ? "↓" : "↑")}
          </Button>
          <Button
            variant={sortBy === "title" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("title")}
          >
            Tên A-Z {sortBy === "title" && (sortDirection === "ASC" ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      {/* Series List */}
      <SeriesList 
        series={seriesData?.data?.content || []} 
        loading={isLoading}
      />

      {/* Pagination */}
      {seriesData?.data && seriesData.data.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Trước
            </Button>
            
            <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
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
    </div>
  );
}
