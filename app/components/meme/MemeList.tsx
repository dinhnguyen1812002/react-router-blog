import { useState, useEffect } from "react";
import { ur } from "zod/v4/locales";
import { getMemes, type Meme, type MemeResponse } from "~/api/memes";

export default function MemeList() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);


// tạm nhá
  const url = "http://localhost:8888/"






  const fetchMemes = async (page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching memes for page:', page);
      const response: MemeResponse = await getMemes(page);
      console.log('Memes response:', response);
      
      setMemes(response.content || []);
      setCurrentPage(response.pageNumber || 0);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Error fetching memes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch memes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes(0);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchMemes(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Đang tải memes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <p className="text-red-700">Lỗi: {error}</p>
        <button 
          onClick={() => fetchMemes(currentPage)}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bộ sưu tập Memes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Khám phá {totalElements} memes thú vị từ cộng đồng
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            {totalElements} memes
          </span>
        </div>
      </div>

      {memes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎭</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Chưa có meme nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hãy là người đầu tiên chia sẻ meme thú vị!
          </p>
        </div>
      ) : (
        <>
          {/* Meme Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {memes.map((meme) => (
              <div 
                key={meme.id} 
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={ url + meme.memeUrl}
                    alt={meme.name}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Overlay actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <span className="text-sm">❤️</span>
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <span className="text-sm">📤</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {meme.name}
                  </h3>
                  
                  {meme.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {meme.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {meme.likes !== undefined && (
                        <div className="flex items-center gap-1">
                          <span>👍</span>
                          <span className="font-medium">{meme.likes}</span>
                        </div>
                      )}
                      {meme.views !== undefined && (
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span className="font-medium">{meme.views}</span>
                        </div>
                      )}
                    </div>
                    
                    {meme.createdAt && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(meme.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Trang trước
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum : number;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trang sau →
              </button>
            </div>
          )}

          {/* Stats Footer */}
          <div className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            Hiển thị {memes.length} trong tổng số {totalElements} memes
          </div>
        </>
      )}
    </div>
  );
}