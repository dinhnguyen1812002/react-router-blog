
import { CardContent } from '~/components/ui/Card';
import { Heart, Eye } from 'lucide-react';
import type { Meme } from '~/types';
import { Link } from 'react-router';

interface MemeCardClassicProps {
  meme: Meme;
  onLike?: (memeId: string) => void;
}

export const MemeCardClassic = ({ meme, onLike }: MemeCardClassicProps) => {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(meme.id);
  };

  return (
    <Link to={`/memes/${meme.slug}`}>
      <div className="relative overflow-hidden rounded-lg cursor-pointer group">
        {/* Ảnh */}
        <img
          src={meme.memeUrl}
          alt={meme.name}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/400/400';
          }}
        />

        {/* Overlay nền */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Nội dung text trượt lên */}
        <div className="absolute bottom-0 w-full transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <CardContent className="text-white p-4">
            <h3 className="font-semibold mb-2 line-clamp-2">
              {meme.name}
            </h3>

            {meme.description && (
              <p className="text-sm mb-3 line-clamp-2">
                {meme.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                {meme.likes !== undefined && (
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{meme.likes}</span>
                  </button>
                )}

                {meme.views !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{meme.views}</span>
                  </div>
                )}
              </div>

              {meme.createdAt && (
                <span className="text-xs">
                  {new Date(meme.createdAt).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Link>
  );
};
