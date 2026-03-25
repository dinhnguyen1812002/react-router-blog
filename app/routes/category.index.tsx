/**
 * Trang danh mục - Categories Page
 * Layout: Grid responsive hiển thị tất cả categories với icon và số lượng bài viết
 */

import { Link } from 'react-router';
import type { Route } from './+types/category.index';
import { categoriesApi } from '~/api/categories';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { MainLayout } from '~/components/layout/MainLayout';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Danh mục - Khám phá chủ đề | Inkwell" },
    { name: "description", content: "Khám phá các chuyên mục và chủ đề đa dạng, từ công nghệ, lập trình đến đời sống và thiết kế trên Inkwell." },
    { property: "og:title", content: "Danh mục - Khám phá chủ đề | Inkwell" },
    { property: "og:description", content: "Khám phá các chuyên mục và chủ đề đa dạng, từ công nghệ, lập trình đến đời sống và thiết kế trên Inkwell." },
  ];
}

// Loader để fetch danh sách categories
export async function loader() {
  const categories = await categoriesApi.getAll();
  return { categories };
}

export default function CategoryIndex({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData;

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-24">
          <header className="mb-12">
            <h1
              className="text-4xl md:text-5xl xl:text-6xl font-normal leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Danh mục
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-mono">
              Khám phá nội dung theo chủ đề yêu thích của bạn
            </p>
          </header>

          {categories.length === 0 ? (
            <div className="py-24 text-center border border-black dark:border-white border-dashed">
              <p className="text-2xl font-serif mb-2">Chưa có danh mục nào</p>
              <p className="text-sm font-mono text-gray-500">Hệ thống chưa có danh mục nào được tạo.</p>
            </div>
          ) : (
            <div className="flex flex-col border-t border-black dark:border-white">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/articles?category=${category.slug}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-10 md:py-16 border-b border-black dark:border-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8"
                >
                  <div className="md:w-1/2 md:pr-8">
                    <h2 
                      className="text-4xl md:text-5xl lg:text-7xl font-normal group-hover:italic transition-all duration-500 mb-6 md:mb-0"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {category.category}
                    </h2>
                  </div>
                  <div className="md:w-1/2 flex flex-col md:items-end text-left md:text-right">
                    <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-md mb-8">
                      {category.description || "Khám phá các bài viết thú vị và sâu sắc trong chủ đề này."}
                    </p>
                    <div className="inline-flex items-center gap-3 text-xs uppercase tracking-widest font-mono border border-black dark:border-white px-6 py-3 rounded-full group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                      Khám phá
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono hover:opacity-50 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
