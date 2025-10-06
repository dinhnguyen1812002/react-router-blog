import { PostCard } from './PostCard';
import { Spinner } from '~/components/ui/Spinner';
import type { Post } from '~/types';
import { Skeleton } from '../ui/skeleton';
import PostSkeleton from '../skeleton/PostSkeleton';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  title?: string;
}

export const PostList = ({ posts, loading, title }: PostListProps) => {
  // if (loading) {
  //   return (
    
  //   );
  // }

  if (posts.length === 0) {
    return (
      <PostSkeleton />
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};