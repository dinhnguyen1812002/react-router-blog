/**
 * MemeGridItem Component - Item trong meme grid
 * Sử dụng trong trang Memes
 */

import { Eye, Heart, ZoomIn } from 'lucide-react';
import type { Meme } from '~/types';

interface MemeGridItemProps {
  meme: Meme;
  onClick: () => void;
}

export function MemeGridItem({ meme, onClick }: MemeGridItemProps) {
  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={meme.memeUrl}
          alt={meme.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <ZoomIn className="w-12 h-12 text-white" />
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-4 text-white text-sm">
            {meme.views && (
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {meme.views}
              </span>
            )}
            {meme.likes && (
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {meme.likes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Meme Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {meme.name}
        </h3>
        {meme.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {meme.description}
          </p>
        )}
      </div>
    </div>
  );
}
