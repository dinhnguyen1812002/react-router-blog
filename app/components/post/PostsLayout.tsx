import type { PropsWithChildren } from "react";
import { MainLayout } from "~/components/layout/MainLayout";
import PostsSidebar, { type PostsFilters } from "./PostsSidebar";

interface PostsLayoutProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  filters?: PostsFilters;
  onFiltersChange?: (filters: PostsFilters) => void;
  showSidebar?: boolean;
  sidebarProps?: {
    sticky?: boolean;
    className?: string;
  };
}

export default function PostsLayout({
  children,
  title = "Tất cả bài viết",
  subtitle,
  filters,
  onFiltersChange,
  showSidebar = true,
  sidebarProps = {},
}: PostsLayoutProps) {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">{children}</div>

          {/* Right Sidebar */}
          {showSidebar && filters && onFiltersChange && (
            <PostsSidebar
              filters={filters}
              onFiltersChange={onFiltersChange}
              {...sidebarProps}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
