import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	ArrowUpDown,
	Edit2,
	Eye,
	FileText,
	Heart,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { type AdminPostListItem, adminPostsApi } from "~/api/admin-posts";
import { FeaturedToggle } from "~/components/admin/FeaturedToggle";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { Category } from "~/types";

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	colorClass: string;
}

function StatCard({ label, value, icon, colorClass }: StatCardProps) {
	return (
		<div className="bg-card border border-border/50 rounded-lg p-4">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-xs font-medium text-muted-foreground">{label}</p>
					<p className="text-2xl font-bold text-foreground mt-1">{value}</p>
				</div>
				<div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
					{icon}
				</div>
			</div>
		</div>
	);
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function TableSkeleton() {
	return (
		<div className="bg-card border border-border/50 rounded-lg p-8">
			<div className="space-y-4">
				{Array.from({ length: 5 }, (_, i) => (
					<div key={i} className="flex items-center space-x-4">
						<div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
						<div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
						<div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
						<div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
					</div>
				))}
			</div>
		</div>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ArticlesContent() {
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [featuredFilter, setFeaturedFilter] = useState("all");

	const queryClient = useQueryClient();

	// ── Queries ──────────────────────────────────────────────────────────────

	const { data: postsData, isLoading } = useQuery({
		queryKey: ["admin-posts", page, size, categoryFilter, featuredFilter],
		queryFn: () =>
			adminPostsApi.getAdminPosts({
				page,
				size,
				categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
				featured:
					featuredFilter === "true"
						? true
						: featuredFilter === "false"
							? false
							: undefined,
			}),
		placeholderData: (prev) => prev,
	});

	// FIX: API trả về array trực tiếp, không có wrapper `.data`
	// Nếu API trả về { data: [...] } thì dùng: categoriesData?.data
	// Nếu API trả về [...] trực tiếp thì dùng: categoriesData
	const { data: categoriesData } = useQuery<Category[]>({
		queryKey: ["categories"],
		queryFn: () => adminPostsApi.getCategories(),
		staleTime: 5 * 60 * 1000, // categories ít thay đổi, cache 5 phút
	});

	// ── Mutations ─────────────────────────────────────────────────────────────

	const deletePostMutation = useMutation({
		mutationFn: (postId: string) => adminPostsApi.deletePost(postId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
			toast.success("Xóa bài viết thành công!");
		},
		onError: () => {
			toast.error("Có lỗi xảy ra khi xóa bài viết!");
		},
	});

	// ── Derived stats ─────────────────────────────────────────────────────────

	const posts = postsData?.content ?? [];

	const filteredPosts = useMemo(() => {
		if (!search.trim()) return posts;
		const q = search.toLowerCase();
		return posts.filter(
			(p) =>
				p.title?.toLowerCase().includes(q) ||
				p.slug?.toLowerCase().includes(q),
		);
	}, [posts, search]);
	const totalViews = posts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
	const totalLikes = posts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
	const publishedCount = posts.filter((p) => p.visibility === "PUBLISHED").length;

	// ── Handlers ──────────────────────────────────────────────────────────────

	const handleDelete = useCallback(
		(post: AdminPostListItem) => {
			if (confirm(`Bạn có chắc chắn muốn xóa "${post.title}"?`)) {
				deletePostMutation.mutate(post.id);
			}
		},
		[deletePostMutation],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			setPage(Math.max(0, Math.min(postsData?.totalPages ?? 1 - 1, newPage)));
		},
		[postsData?.totalPages],
	);

	// ── Columns ───────────────────────────────────────────────────────────────

	const columns: ColumnDef<AdminPostListItem>[] = [
		{
			accessorKey: "author",
			header: "Tác giả",
			cell: ({ row }) => {
				const { username = "Unknown", avatar } = row.original.author ?? {};
				return (
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							<AvatarImage src={avatar ?? "/placeholder.svg"} alt={username} />
							<AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium">{username}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "title",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-transparent"
				>
					Tiêu đề
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const { title, slug } = row.original;
				return (
					<div className="max-w-[300px]">
						<div className="font-semibold text-sm truncate">{title}</div>
						<div className="text-xs text-muted-foreground truncate">/{slug}</div>
					</div>
				);
			},
		},
		{
			accessorKey: "categories",
			header: "Danh mục",
			cell: ({ row }) => {
				const categories = row.original.categories;
				if (!categories?.length) {
					return <span className="text-xs text-muted-foreground">Không có</span>;
				}
				return (
					<div className="flex flex-wrap gap-1">
						{categories.slice(0, 2).map((cat) => (
							<Badge key={cat.id} variant="secondary" className="text-xs">
								{cat.category}
							</Badge>
						))}
						{categories.length > 2 && (
							<Badge variant="outline" className="text-xs">
								+{categories.length - 2}
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "likeCount",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-transparent"
				>
					Thích
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div className="text-sm font-medium text-center">{row.original.likeCount}</div>
			),
		},
		{
			accessorKey: "viewCount",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-transparent"
				>
					Xem
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div className="text-sm font-medium text-center">{row.original.viewCount}</div>
			),
		},
		{
			accessorKey: "visibility",
			header: "Trạng thái",
			cell: ({ row }) => {
				const isPublished = row.original.visibility === "PUBLISHED";
				return (
					<Badge variant={isPublished ? "outline" : "secondary"} className="text-xs">
						{isPublished ? "Published" : "Draft"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "featured",
			header: "Nổi bật",
			cell: ({ row }) => (
				<FeaturedToggle postId={row.original.id} initialFeatured={row.original.featured} />
			),
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-transparent"
				>
					Ngày tạo
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div className="text-xs">
					{format(new Date(row.original.createdAt), "dd/MM/yyyy")}
				</div>
			),
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => {
				const post = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<span className="sr-only">Mở menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel className="text-xs font-semibold">
								Thao tác
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-xs">
								<Eye className="h-3 w-3 mr-2" />
								Xem bài viết
							</DropdownMenuItem>
							<DropdownMenuItem className="text-xs">
								<Edit2 className="h-3 w-3 mr-2" />
								Chỉnh sửa
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-xs text-destructive focus:text-destructive"
								onClick={() => handleDelete(post)}
								disabled={deletePostMutation.isPending}
							>
								<Trash2 className="h-3 w-3 mr-2" />
								Xóa
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
				<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold text-foreground">
								Quản lý bài viết
							</h1>
							<p className="text-sm text-muted-foreground mt-1">
								Quản lý tất cả bài viết trong hệ thống
							</p>
						</div>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Bài viết mới
						</Button>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="border-b border-border/50">
				<div className="container mx-auto px-4 sm:px-6 py-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatCard
							label="Tổng bài viết"
							value={postsData?.totalElements ?? 0}
							icon={<FileText className="h-5 w-5 text-primary" />}
							colorClass="bg-primary/10"
						/>
						<StatCard
							label="Công khai"
							value={publishedCount}
							icon={<Eye className="h-5 w-5 text-green-600" />}
							colorClass="bg-green-500/10"
						/>
						<StatCard
							label="Tổng lượt xem"
							value={totalViews.toLocaleString()}
							icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
							colorClass="bg-blue-500/10"
						/>
						<StatCard
							label="Tổng lượt thích"
							value={totalLikes.toLocaleString()}
							icon={<Heart className="h-5 w-5 text-pink-600" />}
							colorClass="bg-pink-500/10"
						/>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="border-b border-border/50">
				<div className="container mx-auto px-4 sm:px-6 py-4">
					<div className="flex flex-wrap gap-3 items-center">
						<div className="relative flex-1 min-w-[200px] max-w-sm">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
								}}
								className="pl-10"
							/>
						</div>

						{/* FIX: Sử dụng categoriesData trực tiếp (không qua .data)
						    Nếu API của bạn trả về { data: [...] } thì đổi thành categoriesData?.data */}
						<Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(0); }}>
							<SelectTrigger className="w-44">
								<SelectValue placeholder="Chọn danh mục" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả danh mục</SelectItem>
								{categoriesData?.map((category: Category) => (
									<SelectItem key={category.id} value={category.id.toString()}>
										{category.category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={featuredFilter} onValueChange={(v) => { setFeaturedFilter(v); setPage(0); }}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Lọc nổi bật" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tất cả</SelectItem>
								<SelectItem value="true">Nổi bật</SelectItem>
								<SelectItem value="false">Không nổi bật</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={size.toString()}
							onValueChange={(v) => { setSize(Number(v)); setPage(0); }}
						>
							<SelectTrigger className="w-28">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{[10, 20, 50, 100].map((n) => (
									<SelectItem key={n} value={n.toString()}>
										{n} mục
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="container mx-auto px-4 sm:px-6 py-6">
				{isLoading ? (
					<TableSkeleton />
				) : (
					<div className="bg-card border border-border/50 rounded-lg overflow-hidden">
						<DataTable
							columns={columns}
							data={filteredPosts}
						/>
					</div>
				)}

				{/* Pagination */}
				{postsData && !isLoading && (
					<div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-sm text-muted-foreground">
							Hiển thị {posts.length} trong {postsData.totalElements} bài viết
						</p>
						<div className="flex items-center gap-2 flex-wrap justify-center">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(page - 1)}
								disabled={page === 0}
							>
								Trước
							</Button>
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground">Trang</span>
								<Select
									value={(page + 1).toString()}
									onValueChange={(v) => handlePageChange(Number(v) - 1)}
								>
									<SelectTrigger className="w-16">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Array.from({ length: postsData.totalPages }, (_, i) => (
											<SelectItem key={i} value={(i + 1).toString()}>
												{i + 1}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<span className="text-xs text-muted-foreground">
									/ {postsData.totalPages}
								</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(page + 1)}
								disabled={page >= postsData.totalPages - 1}
							>
								Sau
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}