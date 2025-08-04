import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { X, Sparkles, Eye, Heart, Clock } from 'lucide-react';
import { memesApi } from '~/api/memes';
import type { Meme } from '~/types';

interface RandomMemeAlertProps {
  onClose?: () => void;
}

export const RandomMemeAlert = ({ onClose }: RandomMemeAlertProps) => {
  const [randomMeme, setRandomMeme] = useState<Meme | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const cleanup = memesApi.getRandomMemeStream(
      (meme) => {
        console.log('Received random meme:', meme);
        setRandomMeme(meme);
        setIsVisible(true);
        setIsAnimating(true);

        // Auto hide after 10 seconds
        setTimeout(() => {
          handleClose();
        }, 10000);
      },
      (error) => {
        console.error('Random meme stream error:', error);
      }
    );

    return cleanup;
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!randomMeme || !isVisible) {
    return null;
  }

  const imageUrl = memesApi.getMemeImageUrl(randomMeme.memeUrl);

  return (
    <div className={`relative mb-8 transition-all duration-500 ${
      isAnimating ? 'animate-in slide-in-from-top' : 'animate-out slide-out-to-top'
    }`}>
      {/* Background with animated gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>

        <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 bg-black/20 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <h3 className="text-lg font-bold">Meme ngẫu nhiên dành cho bạn!</h3>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image */}
            <div className="md:col-span-1">
              <div className="aspect-square rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <img
                  src={imageUrl}
                  alt={randomMeme.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/200/200';
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xl font-bold mb-2 line-clamp-2">
                  {randomMeme.name}
                </h4>
                {randomMeme.description && (
                  <p className="text-white/80 text-sm line-clamp-3">
                    {randomMeme.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-white/70">
                {randomMeme.likes !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{randomMeme.likes}</span>
                  </div>
                )}

                {randomMeme.views !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{randomMeme.views}</span>
                  </div>
                )}

                {randomMeme.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(randomMeme.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/memes/${randomMeme.slug}`} className="flex-1">
                  <Button
                    variant="secondary"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  onClick={() => {
                    // TODO: Implement like functionality
                    console.log('Like random meme:', randomMeme.id);
                  }}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Thích
                </Button>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-1 overflow-hidden">
            <div className="bg-white h-full rounded-full animate-[shrink_10s_linear_forwards]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
