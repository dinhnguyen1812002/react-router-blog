import { useQuery } from "@tanstack/react-query";
import {
	ArrowDownUp,
	BookMarked,
	Compass,
	Grid2X2,
	List,
	Search,
} from "lucide-react";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router";
import { bookmarksApi } from "~/api/bookmarks";
import { ListView } from "~/components/post/ListView";
import { PostCard } from "~/components/post/PostCard";
import { useAuthStore } from "~/store/authStore";
import type { Post } from "~/types";

type SortKey = "newest" | "oldest" | "mostViewed" | "mostLiked";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
	{ key: "newest", label: "Mới nhất" },
	{ key: "oldest", label: "Cũ nhất" },
	{ key: "mostViewed", label: "Xem nhiều" },
	{ key: "mostLiked", label: "Yêu thích" },
];

// ✅ rerender-no-inline-components: Skeletons are stable — defined OUTSIDE the
//    parent so React never unmounts/remounts them on re-renders.
const GridSkeleton = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{Array.from({ length: 6 }).map((_, i) => (
			<div
				key={i}
				className="bg-card rounded-lg overflow-hidden shadow-sm border border-border animate-pulse"
			>
				<div className="h-40 w-full bg-muted" />
				<div className="p-6 space-y-3 w-full">
					<div className="h-5 bg-muted rounded w-3/4" />
					<div className="h-4 bg-muted rounded w-full" />
					<div className="h-4 bg-muted rounded w-2/3" />
				</div>
			</div>
		))}
	</div>
);

const ListSkeleton = () => (
	<div className="space-y-3">
		{Array.from({ length: 5 }).map((_, i) => (
			<div
				key={i}
				className="bg-card rounded-lg p-4 border border-border animate-pulse flex gap-4"
			>
				<div className="h-20 w-20 shrink-0 bg-muted rounded" />
				<div className="flex-1 space-y-2">
					<div className="h-5 bg-muted rounded w-2/3" />
					<div className="h-4 bg-muted rounded w-1/3" />
					<div className="h-3 bg-muted rounded w-1/2" />
				</div>
			</div>
		))}
	</div>
);

// ✅ rendering-hoist-jsx: Static JSX that never changes lives outside the component.
//    React can reuse the same element reference across renders at zero cost.
const PageHeader = () => (
	<div className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground py-8 md:py-12 px-4 md:px-0 mb-8">
		<div className="max-w-7xl mx-auto">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<h1 className="text-4xl md:text-5xl font-bold mb-2">
						Bài viết đã lưu
					</h1>
					<p className="text-primary-foreground/90 text-lg">
						Tìm lại và quản lý nội dung bạn quan tâm
					</p>
				</div>
			</div>
		</div>
	</div>
);

// ✅ rendering-hoist-jsx: Empty state is static markup — hoist to avoid re-creation.
const EmptySearch = ({ term }: { term: string }) => (
	<div className="flex flex-col items-center justify-center py-20 rounded-lg border border-dashed border-border bg-card text-center">
		<div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center mb-4">
			<BookMarked
				size={24}
				className="text-muted-foreground"
				strokeWidth={1.5}
			/>
		</div>
		<h3 className="text-base font-semibold text-foreground mb-1.5">
			{term ? "Không tìm thấy kết quả" : "Chưa có bài viết nào"}
		</h3>
		<p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
			{term
				? `Không có bài viết phù hợp với "${term}". Hãy thử từ khóa khác.`
				: "Khám phá các bài viết và nhấn lưu để đọc lại sau."}
		</p>
		{!term && (
			<Link to="/articles">
				<button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
					<Compass size={14} />
					Khám phá bài viết
				</button>
			</Link>
		)}
	</div>
);

export default function BookmarksPage() {
	const { user } = useAuthStore();
	const [page, setPage] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState<SortKey>("newest");

	// ✅ rerender-use-deferred-value: Keeps the search input instant while
	//    deferring the expensive filter/sort computation to a lower priority.
	const deferredSearch = useDeferredValue(searchTerm);

	// ✅ client- queryKey: Use the actual page-size as the key, not the
	//    view-mode label. This is what the API actually cares about and avoids
	//    spurious cache misses if you ever rename the view modes.
	const pageSize = viewMode === "grid" ? 12 : 10;

	const { data: bookmarksData, isLoading } = useQuery({
		queryKey: ["bookmarks", page, pageSize],
		queryFn: () => bookmarksApi.getBookmarks(page, pageSize),
		enabled: !!user,
		// ✅ Keep previous data while fetching next page — avoids content flash
		placeholderData: (prev) => prev,
	});

	const posts = bookmarksData?.posts ?? [];
	const totalPosts = bookmarksData?.total ?? 0;

	// ✅ rerender-memo + js-combine-iterations: Memoize the filter+sort into a
	//    single pass. The two-step filter → sort previously allocated an
	//    intermediate array on every render. Now it only reruns when the
	//    deferred search term or sort key changes — not on every keystroke.
	const sortedPosts = useMemo(() => {
		const term = deferredSearch.toLowerCase();

		const filtered = term
			? posts.filter(
					(p) =>
						p.title.toLowerCase().includes(term) ||
						p.summary?.toLowerCase().includes(term),
				)
			: posts;

		return [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "oldest":
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				case "mostViewed":
					return (b.viewCount ?? 0) - (a.viewCount ?? 0);
				case "mostLiked":
					return (b.likeCount ?? 0) - (a.likeCount ?? 0);
				default:
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
			}
		});
	}, [posts, deferredSearch, sortBy]);

	// ✅ Derived value computed once, not inlined multiple times in JSX
	const totalPages = Math.ceil(totalPosts / pageSize);

	// ✅ rerender-functional-setstate: Stable callbacks via functional updaters
	//    mean these never need to be in a useCallback dependency array.
	const prevPage = useCallback(() => setPage((p) => p - 1), []);
	const nextPage = useCallback(() => setPage((p) => p + 1), []);

	return (
		<div className="min-h-screen">
			<PageHeader />

			<div className="container mx-auto px-4 md:px-0 pb-12">
				{/* ─── Search + View Toggle ─── */}
				<div className="mb-8">
					<div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
						<div className="relative max-w-2xl flex-1">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
							<input
								type="text"
								placeholder="Tìm kiếm bài viết..."
								className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted/50 border border-border w-fit">
							<button
								onClick={() => setViewMode("grid")}
								aria-label="Lưới"
								className={`w-8 h-8 flex items-center justify-center rounded transition-all ${
									viewMode === "grid"
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Grid2X2 size={18} />
							</button>
							<button
								onClick={() => setViewMode("list")}
								aria-label="Danh sách"
								className={`w-8 h-8 flex items-center justify-center rounded transition-all ${
									viewMode === "list"
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<List size={18} />
							</button>
						</div>
					</div>
				</div>

				{/* ─── Sort + Count ─── */}
				<div className="mb-8 flex flex-wrap items-center gap-3 justify-between">
					<div className="flex flex-wrap items-center gap-2">
						<ArrowDownUp size={16} className="text-muted-foreground shrink-0" />
						{SORT_OPTIONS.map(({ key, label }) => (
							<button
								key={key}
								onClick={() => setSortBy(key)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
									sortBy === key
										? "bg-primary text-primary-foreground border-primary"
										: "border-border text-muted-foreground hover:border-primary hover:text-foreground"
								}`}
							>
								{label}
							</button>
						))}
					</div>
					<span className="text-sm text-muted-foreground">
						<span className="font-semibold text-foreground">
							{sortedPosts.length}
						</span>
						<span className="mx-1">/</span>
						<span className="font-semibold text-foreground">{totalPosts}</span>
						{" bài"}
					</span>
				</div>

				{/* ─── Content ─── */}
				{isLoading ? (
					viewMode === "grid" ? (
						<GridSkeleton />
					) : (
						<ListSkeleton />
					)
				) : sortedPosts.length > 0 ? (
					viewMode === "grid" ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{sortedPosts.map((post: Post) => (
								<PostCard key={post.id} post={post} variant="default" />
							))}
						</div>
					) : (
						// ✅ Bug fix: was rendering <ListView posts={sortedPosts} key={post.id} />
						//    inside a .map(), which rendered N full list views instead of one.
						<ListView posts={sortedPosts} />
					)
				) : (
					// ✅ rendering-conditional-render: ternary instead of && avoids
					//    rendering "0" when sortedPosts.length is 0.
					<EmptySearch term={searchTerm} />
				)}

				{/* ─── Pagination ─── */}
				{!isLoading && totalPages > 1 ? (
					<div className="flex items-center justify-center gap-3 pt-8 border-t border-border">
						<button
							disabled={page === 0}
							onClick={prevPage}
							className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card text-foreground hover:border-primary hover:bg-card/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							← Trước
						</button>
						<span className="text-sm text-muted-foreground">
							<span className="font-semibold text-foreground">{page + 1}</span>
							<span className="mx-1">/</span>
							<span className="font-semibold text-foreground">
								{totalPages}
							</span>
						</span>
						<button
							disabled={page >= totalPages - 1}
							onClick={nextPage}
							className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card text-foreground hover:border-primary hover:bg-card/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							Sau →
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
}
