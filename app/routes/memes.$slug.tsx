import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router';
import { MainLayout } from '~/components/layout/MainLayout';
import { Spinner } from '~/components/ui/Spinner';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/Card';
import { Heart, Eye, Share2, Download, ArrowLeft } from 'lucide-react';
import { memesApi } from '~/api/memes';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Meme Detail - ${params.slug}` },
    { name: "description", content: "Chi tiết meme" },
  ];
};

export default function MemeDetailPage() {
  const { slug } = useParams();

  const {
    data: meme,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meme', slug],
    queryFn: () => memesApi.getMemeBySlug(slug!),
    enabled: !!slug,
  });

  const handleLike = () => {
    // TODO: Implement like functionality
    console.log('Like meme:', meme?.id);
  };

  const handleShare = async () => {
    if (navigator.share && meme) {
      try {
        await navigator.share({
          title: meme.name,
          text: meme.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const handleDownload = () => {
    if (meme) {
      const imageUrl = memesApi.getMemeImageUrl(meme.memeUrl);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${meme.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !meme) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Meme không tồn tại</h1>
            <p className="text-gray-600 mb-6">Meme bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/memes">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách memes
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const imageUrl = memesApi.getMemeImageUrl(meme.memeUrl);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/memes">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <Card>
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={imageUrl}
                  alt={meme.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/800/800';
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meme Info */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {meme.name}
                </h1>
                
                {meme.description && (
                  <p className="text-gray-600 mb-6">
                    {meme.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  {meme.likes !== undefined && (
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{meme.likes}</span>
                    </div>
                  )}
                  
                  {meme.views !== undefined && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{meme.views}</span>
                    </div>
                  )}
                  
                  {meme.createdAt && (
                    <span>
                      {new Date(meme.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleLike}
                    className="w-full"
                    variant="secondary"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Thích
                  </Button>
                  
                  <Button 
                    onClick={handleShare}
                    className="w-full"
                    variant="secondary"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                  
                  <Button 
                    onClick={handleDownload}
                    className="w-full"
                    variant="secondary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Hành động khác</h3>
                <div className="space-y-3">
                  <Link to="/memes" className="block">
                    <Button variant="outline" className="w-full">
                      Xem thêm memes
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full">
                    Báo cáo meme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Memes Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Memes khác bạn có thể thích
          </h2>
          
          <div className="text-center">
            <Link to="/memes">
              <Button size="lg">
                Khám phá thêm memes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
