import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '~/components/layout/MainLayout';
import { MemeGrid } from '~/components/meme/MemeGrid';
import { RandomMemeAlert } from '~/components/meme/RandomMemeAlert';
import { MemeUploadModal } from '~/components/meme/MemeUploadModal';
import { Spinner } from '~/components/ui/Spinner';
import { Button } from "~/components/ui/button";
import { memesApi } from '~/api/memes';
import type { Meme } from '~/types';

export default function MemesPage() {
  const [page, setPage] = useState(0);
  const [allMemes, setAllMemes] = useState<Meme[]>([]);
  const pageSize = 12;

  const {
    data: memesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['memes', page],
    queryFn: () => memesApi.getMemes(page, pageSize),
  });

  // Update all memes when new data comes in
  useEffect(() => {
    if (memesData?.content) {
      if (page === 0) {
        setAllMemes(memesData.content);
      } else {
        setAllMemes(prev => [...prev, ...memesData.content]);
      }
    }
  }, [memesData, page]);



  const handleLoadMore = () => {
    if (memesData && !memesData.last) {
      setPage(prev => prev + 1);
    }
  };

  const handleLike = (memeId: string) => {
    // TODO: Implement like functionality
    console.log('Like meme:', memeId);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Memes Vui Nhộn 😄
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những hình ảnh hài hước và thú vị để làm tươi mới ngày của bạn
          </p>
        </div>

        {/* Random Meme Alert */}
        <RandomMemeAlert />

        {/* Upload Button */}
        <div className="text-center mb-8">
          <MemeUploadModal />
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">Có lỗi xảy ra khi tải memes.</p>
            <Button onClick={() => refetch()}>Thử lại</Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && page === 0 && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Memes Grid */}
        {!error && allMemes.length > 0 && (
          <MemeGrid
            memes={allMemes}
            onLike={handleLike}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && allMemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Chưa có meme nào được tải lên.</p>
          </div>
        )}

        {/* Load More */}
        {memesData && !memesData.last && (
          <div className="text-center mt-12">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tải...' : 'Tải thêm memes'}
            </Button>
          </div>
        )}

        {/* Fun Stats */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 mt-16 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Thống kê vui</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold">{memesData?.totalElements || 0}</div>
              <div className="text-purple-100">Memes được chia sẻ</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {allMemes.reduce((total, meme) => total + (meme.likes || 0), 0)}
              </div>
              <div className="text-purple-100">Lượt thích</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {allMemes.reduce((total, meme) => total + (meme.views || 0), 0)}
              </div>
              <div className="text-purple-100">Lượt xem</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}