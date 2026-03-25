/**
 * Post Helper Utilities
 * Các hàm tiện ích để xử lý post data an toàn
 */

import type { Post, User } from '~/types';

/**
 * Lấy thông tin user an toàn với fallback
 */
export function getSafeUser(post: Post): Required<Pick<User, 'username' | 'avatar'>> & Partial<User> {
  const author = post.author;

  return {
    id: author?.id || post.user?.id || '',
    username: author?.username || post.user?.username || 'Anonymous',
    email: author?.email || post.user?.email || '',
    slug: author?.slug || post.user?.slug || '',
    avatar: author?.avatar || post.user?.avatar || undefined,
    roles: author?.roles || post.user?.roles || [],
    socialMediaLinks: post.user?.socialMediaLinks || [],
  };
}

/**
 * Lấy username an toàn
 */
export function getSafeUsername(post: Post): string {
  return post.author?.username || post.user?.username || 'Anonymous';
}

/**
 * Lấy avatar an toàn
 */
export function getSafeAvatar(post: Post): string | undefined {
  return post.author?.avatar || post.user?.avatar || undefined;
}

/**
 * Lấy chữ cái đầu của username
 */
export function getUserInitial(post: Post): string {
  const username = getSafeUsername(post);
  return username.charAt(0).toUpperCase();
}

/**
 * Kiểm tra xem post có user data không
 */
export function hasUserData(post: Post): boolean {
  return Boolean(post.author?.username || post.user?.username);
}
