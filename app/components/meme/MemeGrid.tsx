import { useState } from 'react';
import { Grid, LayoutGrid } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { MemeCard } from './MemeCard';
import { MemeCardClassic } from './MemeCardClassic';
import type { Meme } from '~/types';

interface MemeGridProps {
  memes: Meme[];
  onLike?: (memeId: string) => void;
}

export const MemeGrid = ({ memes, onLike }: MemeGridProps) => {
  const [viewMode, setViewMode] = useState<'modern' | 'classic'>('modern');

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'modern' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('modern')}
            className="flex items-center space-x-2"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Modern</span>
          </Button>
          <Button
            variant={viewMode === 'classic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('classic')}
            className="flex items-center space-x-2"
          >
            <Grid className="w-4 h-4" />
            <span>Classic</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === 'modern' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {memes.map((meme) => (
            <MemeCard 
              key={meme.id} 
              meme={meme} 
              onLike={onLike}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {memes.map((meme) => (
            <MemeCardClassic 
              key={meme.id} 
              meme={meme} 
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};
