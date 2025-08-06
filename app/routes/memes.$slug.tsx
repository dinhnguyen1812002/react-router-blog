import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getMemeBySlug, type Meme } from "~/api/memes";

export default function MemeDetail() {
  const { slug } = useParams();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchMeme = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const memeData = await getMemeBySlug(slug);
        setMeme(memeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch meme');
      } finally {
        setLoading(false);
      }
    };

    fetchMeme();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Đang tải meme...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy meme</h2>
          <p className="text-gray-600 mb-4">Meme với slug "{slug}" không tồn tại.</p>
          <a 
            href="/memes"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Về danh sách memes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <a 
            href="/memes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Về danh sách memes
          </a>
        </div>

        {/* Meme Detail */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Meme Image */}
          <div className="relative">
            <img
              src={meme.memeUrl}
              alt={meme.name}
              className="w-full max-h-96 object-contain bg-gray-100"
            />
          </div>

          {/* Meme Info */}
          <div className="p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {meme.name}
              </h1>
              
              {meme.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {meme.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 py-4 border-t border-gray-200">
              {meme.likes !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👍</span>
                  <span className="font-semibold">{meme.likes}</span>
                  <span className="text-gray-500">lượt thích</span>
                </div>
              )}
              
              {meme.views !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  <span className="font-semibold">{meme.views}</span>
                  <span className="text-gray-500">lượt xem</span>
                </div>
              )}
              
              {meme.createdAt && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <span className="text-gray-500">
                    {new Date(meme.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                <span>👍</span>
                Thích
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                <span>📤</span>
                Chia sẻ
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã copy link!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <span>🔗</span>
                Copy link
              </button>
            </div>
          </div>
        </div>

        {/* Related Memes Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Memes khác</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Tính năng memes liên quan sẽ được phát triển trong tương lai.</p>
          </div>
        </div>
      </div>
    </div>
  );
}