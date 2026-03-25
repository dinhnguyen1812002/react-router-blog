/**
 * CategoryCard Component - Card hiển thị category
 * Sử dụng trong trang Categories
 */

import { Link } from 'react-router';
import { FileText, ChevronRight } from 'lucide-react';
import type { Category } from '~/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/articles?category=${category.slug}`}
      className="group"
    >
      <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
        {/* Color Bar */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: category.backgroundColor || '#e5e7eb' }}
        />

        {/* Content */}
        <div className="p-6">
          {/* Icon/Image placeholder */}
          <div
            className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ 
              backgroundColor: `${category.backgroundColor}20` || '#e5e7eb20'
            }}
          >
            <FileText 
              className="w-8 h-8" 
              style={{ color: category.backgroundColor || '#6b7280' }}
            />
          </div>

          {/* Category Name */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {category.category}
          </h3>

          {/* Description */}
          {category.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {category.description}
            </p>
          )}

          {/* Footer với số bài viết */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Xem bài viết
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Hover Overlay Effect */}
        <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
