/**
 * ArticlesSidebar Component - Ultra minimalist sidebar
 * Black & White only, no border-radius, no shadows, flat design
 */

import { ChevronDown, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import type { Category, Tag } from "~/types";

interface ArticlesSidebarProps {
	currentCategory?: string;
	currentTag?: string;
	currentSort?: string;
}

export function ArticlesSidebar({
	currentCategory,
	currentTag,
	currentSort = "newest",
}: ArticlesSidebarProps) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [categories, setCategories] = useState<Category[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);

	// Fetch categories and tags
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [cats, tgs] = await Promise.all([
					categoriesApi.getAll(),
					tagsApi.getAll(),
				]);
				setCategories(cats || []);
				setTags(tgs || []);
			} catch (error) {
				console.error("Error fetching filters:", error);
			}
		};
		fetchData();
	}, []);

	// Handle search
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams);
		if (searchQuery) {
			params.set("q", searchQuery);
		} else {
			params.delete("q");
		}
		params.set("page", "0");
		setSearchParams(params);
	};

	// Handle category filter
	const handleCategoryChange = (categorySlug: string | null) => {
		const params = new URLSearchParams(searchParams);
		if (categorySlug) {
			params.set("category", categorySlug);
		} else {
			params.delete("category");
		}
		params.set("page", "0");
		setSearchParams(params);
	};

	// Handle tag filter
	const handleTagChange = (tagSlug: string | null) => {
		const params = new URLSearchParams(searchParams);
		if (tagSlug) {
			params.set("tag", tagSlug);
		} else {
			params.delete("tag");
		}
		params.set("page", "0");
		setSearchParams(params);
	};

	// Handle sort change
	const handleSortChange = (sort: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("sortBy", sort);
		params.set("page", "0");
		setSearchParams(params);
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setSearchParams(new URLSearchParams());
	};

	const hasActiveFilters =
		currentCategory || currentTag || searchParams.get("q");

	return (
		<aside className="w-full lg:w-72 shrink-0">
			<div className="sticky top-24">
				{/* Search Form - minimalist with underline */}
				<form onSubmit={handleSearch} className="mb-8">
					<div className="relative">
						<Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Tìm kiếm bài viết..."
							className="w-full pl-8 py-2 text-sm bg-transparent border-0 border-b border-black dark:border-white focus:outline-none placeholder:text-gray-500 text-black dark:text-white"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
				</form>

				{/* Mobile Filter Toggle */}
				<button
					onClick={() => setIsFiltersOpen(!isFiltersOpen)}
					className="lg:hidden w-full flex items-center justify-between px-0 py-3 mb-4 text-sm font-medium text-black dark:text-white"
				>
					<span className="flex items-center gap-2">
						<Filter className="w-4 h-4" />
						Bộ lọc
					</span>
					<ChevronDown
						className={`w-4 h-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`}
					/>
				</button>

				{/* Filters Section */}
				<div className={`${isFiltersOpen ? "block" : "hidden"} lg:block`}>
					{/* Sort Options */}
					<div className="mb-8">
						<h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
							Sắp xếp
						</h3>
						<div className="space-y-2">
							{[
								{ value: "newest", label: "Mới nhất" },
								{ value: "views", label: "Xem nhiều nhất" },
							].map((option) => (
								<button
									key={option.value}
									onClick={() => handleSortChange(option.value)}
									className={`block w-full text-left text-sm py-1.5 ${
										currentSort === option.value
											? "text-black dark:text-white font-medium underline decoration-1 underline-offset-2"
											: "text-gray-500 dark:text-gray-400"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					{/* Categories */}
					<div className="mb-8">
						<h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
							Chuyên mục
						</h3>
						<div className="space-y-2">
							<button
								onClick={() => handleCategoryChange(null)}
								className={`block w-full text-left text-sm py-1.5 ${
									!currentCategory
										? "text-black dark:text-white font-medium underline decoration-1 underline-offset-2"
										: "text-gray-500 dark:text-gray-400"
								}`}
							>
								Tất cả
							</button>
							{categories.map((category) => (
								<button
									key={category.id}
									onClick={() => handleCategoryChange(category.slug)}
									className={`block w-full text-left text-sm py-1.5 ${
										currentCategory === category.slug
											? "text-black dark:text-white font-medium underline decoration-1 underline-offset-2"
											: "text-gray-500 dark:text-gray-400"
									}`}
								>
									{category.category}
								</button>
							))}
						</div>
					</div>

					{/* Tags */}
					<div className="mb-8">
						<h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
							Tags
						</h3>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => handleTagChange(null)}
								className={`px-2 py-1 text-xs ${
									!currentTag
										? "text-black dark:text-white underline decoration-1 underline-offset-2"
										: "text-gray-500 dark:text-gray-400"
								}`}
							>
								Tất cả
							</button>
							{tags.slice(0, 10).map((tag) => (
								<button
									key={tag.uuid}
									onClick={() => handleTagChange(tag.slug)}
									className={`px-2 py-1 text-xs ${
										currentTag === tag.slug
											? "text-black dark:text-white underline decoration-1 underline-offset-2"
											: "text-gray-500 dark:text-gray-400"
									}`}
								>
									{tag.name}
								</button>
							))}
						</div>
					</div>

					{/* Clear Filters */}
					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="text-xs text-gray-500 dark:text-gray-400 underline decoration-1 underline-offset-2"
						>
							Xóa bộ lọc
						</button>
					)}
				</div>
			</div>
		</aside>
	);
}
