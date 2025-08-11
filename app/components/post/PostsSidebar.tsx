import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "~/components/ui/Input";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import type { Category, Tag } from "~/types";
import { Search, Filter, Tag as TagIcon, X } from "lucide-react";

export interface PostsFilters {
  search: string;
  category: string;
  selectedTags: string[];
}

interface PostsSidebarProps {
  filters: PostsFilters;
  onFiltersChange: (filters: PostsFilters) => void;
  className?: string;
  sticky?: boolean;
}

export default function PostsSidebar({ 
  filters, 
  onFiltersChange, 
  className = "",
}: PostsSidebarProps) {
  const { search, category, selectedTags } = filters;

  // Fetch categories and tags
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const {
    data: tags,
    isLoading: isLoadingTags,
    error: tagsError,
  } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleCategoryChange = (catSlug: string) => {
    onFiltersChange({ ...filters, category: catSlug });
  };

  const handleTagToggle = (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t) => t !== tagName)
      : [...selectedTags, tagName];
    
    onFiltersChange({ ...filters, selectedTags: newSelectedTags });
  };

  const handleClearAllTags = () => {
    onFiltersChange({ ...filters, selectedTags: [] });
  };

  const handleClearCategory = () => {
    onFiltersChange({ ...filters, category: "" });
  };

  const handleClearAllFilters = () => {
    onFiltersChange({ search: "", category: "", selectedTags: [] });
  };

  return (
    <div className={`w-80 flex-shrink-0 ${className}`}>
      <div className={` top-8 space-y-6`}>
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Tìm kiếm
            </h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 dark:text-amber-50"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Danh mục
            </h3>
          </div>

          {isLoadingCategories ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-red-500 text-sm">Lỗi tải danh mục</div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange("")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  category === ""
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Tất cả danh mục
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    category === cat.slug
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Tags phổ biến
            </h3>
          </div>

          {isLoadingTags ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse inline-block mr-2 mb-2"
                />
              ))}
            </div>
          ) : tagsError ? (
            <div className="text-red-500 text-sm">Lỗi tải tags</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <button
                  key={tag.uuid}
                  onClick={() => handleTagToggle(tag.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag.name)
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          {selectedTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Tags đã chọn:
                </span>
                <button
                  onClick={handleClearAllTags}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {(category || selectedTags.length > 0 || search) && (
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Bộ lọc hiện tại:
              </h4>
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Xóa tất cả
              </button>
            </div>
            
            <div className="space-y-1">
              {search && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Tìm kiếm: "{search}"
                  </span>
                  <button
                    onClick={() => handleSearchChange("")}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {category && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Danh mục: {categories?.find((c) => c.slug === category)?.category}
                  </span>
                  <button
                    onClick={handleClearCategory}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {selectedTags.map((tag) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Tag: {tag}
                  </span>
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Stats */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {categories?.length || 0} danh mục • {tags?.length || 0} tags
          </div>
        </div>
      </div>
    </div>
  );
}