import { Link } from 'react-router';
import { Card, CardContent } from '~/components/ui/Card';
import { DirectionAwareHover } from '~/components/ui/direction-aware-hover';
import { Heart, Eye, Play } from 'lucide-react';
import type { Meme } from '~/types';
// import { memesApi } from '~/api/memes';


interface MemeCardProps {
  meme: Meme;
  onLike?: (memeId: string) => void;
}

export const MemeCard = ({ meme, onLike }: MemeCardProps) => {
  // const imageUrl = memesApi.getMemeImageUrl(meme.memeUrl);
  // const memeUrl = "localhost:8888/uploads/" + ;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(meme.id);
  };

  return (
    <Link to={`/memes/${meme.slug}`} className="block">
      <DirectionAwareHover
        imageUrl={meme.memeUrl }
        className="w-full h-full rounded-lg"
        imageClassName="object-cover"
        childrenClassName="p-4"
      >
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-white line-clamp-2 ">
            {meme.name}
          </h3>

          {/* Description */}
          {meme.description && (
            <p className="text-gray-200 text-sm line-clamp-2">
              {meme.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3 text-white">
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

            {/* View Button */}
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <Play className="w-3 h-3" />
              <span className="text-xs font-medium">Xem</span>
            </div>
          </div>

          {/* Date */}
          {meme.createdAt && (
            <div className="text-xs text-gray-300">
              {new Date(meme.createdAt).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      </DirectionAwareHover>
    </Link>
  );
};
