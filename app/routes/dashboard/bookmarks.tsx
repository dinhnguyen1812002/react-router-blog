import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { bookmarksApi } from '~/api/bookmarks';
import { useAuthStore } from '~/store/authStore';
import {
  Bookmark,
  Search,
  Grid2X2,
  List,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  FileText,
  X,
  Compass,
  BookMarked,
  ArrowDownUp,
} from 'lucide-react';
import { formatDateSimple } from '~/lib/utils';
import { toast } from 'sonner';

type SortKey = 'newest' | 'oldest' | 'mostViewed' | 'mostLiked';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest',     label: 'Mới nhất'  },
  { key: 'oldest',     label: 'Cũ nhất'   },
  { key: 'mostViewed', label: 'Xem nhiều' },
  { key: 'mostLiked',  label: 'Yêu thích' },
];

export default function BookmarksPage() {
  const { user } = useAuthStore();
  const [page, setPage]             = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy]         = useState<SortKey>('newest');
  const [pendingRemovals, setPendingRemovals] = useState<Record<string, ReturnType<typeof setTimeout>>>({});

  const { data: bookmarksData, isLoading } = useQuery({
    queryKey: ['bookmarks', page, viewMode],
    queryFn: () => bookmarksApi.getBookmarks(page, viewMode === 'grid' ? 12 : 10),
    enabled: !!user,
  });

  const posts      = bookmarksData?.posts || [];
  const totalPosts = bookmarksData?.total || 0;
  const totalPages = Math.ceil(totalPosts / (viewMode === 'grid' ? 12 : 10));

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.summary?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'oldest')     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'mostViewed') return (b.viewCount || 0) - (a.viewCount || 0);
    if (sortBy === 'mostLiked')  return (b.likeCount || 0) - (a.likeCount || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  function handleBookmark(postId: string) {
    setPendingRemovals(prev => {
      if (prev[postId]) return prev;
      const timeout = setTimeout(async () => {
        try   { await bookmarksApi.removeBookmark(postId); }
        catch  { toast.error('Xóa bookmark thất bại'); }
        finally {
          setPendingRemovals(p => { const { [postId]: _, ...rest } = p; return rest; });
        }
      }, 30_000);
      return { ...prev, [postId]: timeout };
    });

    toast('Đã gỡ bookmark', {
      description: 'Sẽ xóa sau 30 giây nếu bạn không hoàn tác.',
      duration: 30_000,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          clearTimeout(pendingRemovals[postId]);
          setPendingRemovals(p => { const { [postId]: _, ...rest } = p; return rest; });
        },
      },
    });
  }

  /* ─── Skeletons ─── */
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
          <div className="h-40 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-3/4" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-1/2" />
            <div className="flex gap-3 pt-1">
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-14" />
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListSkeleton = () => (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-2/3" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-10">

      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bài viết đã lưu
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tìm lại và quản lý nội dung bạn quan tâm.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            <BookMarked size={12} />
            {totalPosts} bài viết
          </span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900">
              <Search size={12} />
              {sortedPosts.length} kết quả
            </span>
          )}
        </div>
      </div>

      {/* ─── Search + View toggle ─── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, mô tả…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-9 rounded-xl text-sm bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-zinc-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-400 dark:hover:bg-zinc-500 transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Lưới"
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Grid2X2 size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="Danh sách"
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ─── Sort chips + count ─── */}
      <div className="flex flex-wrap items-center gap-2">
        <ArrowDownUp size={13} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              sortBy === key
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-50'
                : 'text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{sortedPosts.length}</span>
          <span className="mx-0.5">/</span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totalPosts}</span>
          {' bài'}
        </span>
      </div>

      {/* ─── Content ─── */}
      {isLoading ? (
        viewMode === 'grid' ? <GridSkeleton /> : <ListSkeleton />
      ) : sortedPosts.length > 0 ? (
        viewMode === 'grid' ? (

          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPosts.map(post => (
              <div
                key={post.id}
                className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md dark:hover:shadow-black/40 transition-all duration-200"
              >
                {/* Remove button — visible on hover */}
                <button
                  onClick={() => handleBookmark(post.id)}
                  aria-label="Gỡ bookmark"
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:border-zinc-600 dark:hover:border-zinc-400 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150"
                >
                  <Bookmark size={12} fill="currentColor" />
                </button>

                {/* Image */}
                <div className="h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                      <FileText size={32} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <Link
                    to={`/articles/${post.slug}`}
                    className="block text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:text-zinc-500 dark:hover:text-zinc-400 line-clamp-2 leading-snug mb-3 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDateSimple(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {post.viewCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={11} />
                      {post.likeCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={11} />
                      {post.commentCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (

          /* LIST */
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {sortedPosts.map(post => (
              <div
                key={post.id}
                className="group flex items-center gap-4 px-4 py-3.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                      <FileText size={18} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/articles/${post.slug}`}
                    className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:text-zinc-500 dark:hover:text-zinc-400 truncate transition-colors"
                  >
                    {post.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar size={10} />{formatDateSimple(post.createdAt)}</span>
                    <span className="flex items-center gap-1"><Eye size={10} />{post.viewCount ?? 0}</span>
                    <span className="flex items-center gap-1"><Heart size={10} />{post.likeCount ?? 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={10} />{post.commentCount ?? 0}</span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleBookmark(post.id)}
                  aria-label="Gỡ bookmark"
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-zinc-900 dark:hover:border-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-all duration-150"
                >
                  <Bookmark size={14} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>

        )
      ) : (

        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-5 shadow-sm">
            <BookMarked size={24} className="text-zinc-300 dark:text-zinc-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
            {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có bài viết nào'}
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed mb-6">
            {searchTerm
              ? `Không có bài viết phù hợp với "${searchTerm}". Hãy thử từ khóa khác.`
              : 'Khám phá các bài viết và nhấn lưu để đọc lại sau.'}
          </p>
          {!searchTerm && (
            <Link to="/articles">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
                <Compass size={14} />
                Khám phá bài viết
              </button>
            </Link>
          )}
        </div>

      )}

      {/* ─── Pagination ─── */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Trước
          </button>
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{page + 1}</span>
            <span className="mx-1 text-zinc-300 dark:text-zinc-600">/</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{totalPages}</span>
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Sau →
          </button>
        </div>
      )}

    </div>
  );
}