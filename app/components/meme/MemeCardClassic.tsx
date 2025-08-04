import { Link } from 'react-router';
import { Card, CardContent } from '~/components/ui/Card';
import { Heart, Eye } from 'lucide-react';
import { memesApi } from '~/api/memes';
import type { Meme } from '~/types';

interface MemeCardClassicProps {
  meme: Meme;
  onLike?: (memeId: string) => void;
}

export const MemeCardClassic = ({ meme, onLike }: MemeCardClassicProps) => {
  const imageUrl = memesApi.getMemeImageUrl(meme.memeUrl);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(meme.id);
  };

  return (
    <Link to={`/memes/${meme.slug}`}>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={imageUrl}
            alt={meme.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/400/400';
            }}
          />
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {meme.name}
          </h3>
          
          {meme.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {meme.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              {meme.likes !== undefined && (
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-1 hover:text-red-500 transition-colors"
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
      </Card>
    </Link>
  );
};
