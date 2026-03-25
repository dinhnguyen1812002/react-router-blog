/**
 * Trang hiển thị Meme - Memes Gallery Page
 * Layout: Grid responsive với lazy loading và lightbox
 */

import { Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import type { Route } from './+types/memes._index';
import { getMemes, type MemeResponse, type Meme } from '~/api/memes';
import { RefreshCw, Image as ImageIcon } from 'lucide-react';
import { MainLayout } from '~/components/layout/MainLayout';
import { MemeGridItem } from '~/components/meme/MemeGridItem';
import { MemeLightbox } from '~/components/meme/MemeLightbox';
import { MemeGridSkeleton } from '~/components/skeleton/MemeGridSkeleton';
import { EmptyState } from '~/components/ui/EmptyState';

// Loader để fetch memes từ server
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '0');
  
  const memes = await getMemes(page);
  return { memes, currentPage: page };
}

export default function MemesIndex({ loaderData }: Route.ComponentProps) {
  const { memes: initialMemes, currentPage } = loaderData;
  const [memes, setMemes] = useState<Meme[]>(initialMemes.content);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!initialMemes.last);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll với Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreMemes();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  // Load thêm memes
  const loadMoreMemes = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await getMemes(nextPage);
      setMemes((prev) => [...prev, ...response.content]);
      setPage(nextPage);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Error loading memes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh - load lại từ đầu
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await getMemes(0);
      setMemes(response.content);
      setPage(0);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Error refreshing memes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-gray-100 mb-2">
                Meme Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Bộ sưu tập meme vui nhộn và sáng tạo
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Memes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && memes.length === 0 ? (
          <MemeGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memes.map((meme) => (
              <MemeGridItem
                key={meme.id}
                meme={meme}
                onClick={() => setSelectedMeme(meme)}
              />
            ))}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Đang tải...</span>
            </div>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {hasMore && <div ref={observerTarget} className="h-10" />}

        {/* End Message */}
        {!hasMore && memes.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Bạn đã xem hết tất cả meme
            </p>
          </div>
        )}

        {/* Empty State */}
        {memes.length === 0 && !loading && (
          <EmptyState
            icon={ImageIcon}
            title="Chưa có meme nào"
            description="Hệ thống chưa có meme nào được upload."
            action={
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
              >
                Thử lại
              </button>
            }
          />
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMeme && (
        <MemeLightbox meme={selectedMeme} onClose={() => setSelectedMeme(null)} />
      )}
    </div>
    </MainLayout>
  );
}
