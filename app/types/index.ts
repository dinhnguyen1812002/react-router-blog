export interface socialMediaLinks {
  id: string;
  name: string;
  url: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  avatar: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterResponse extends LoginResponse {
  // Register response can include login data for auto-login
  autoLogin?: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  contentType?: "RICHTEXT" | "MARKDOWN";
  summary?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  featured: boolean;
  published?: boolean;
  status?: string;
  user: User;
  categories: Category[];
  tags: Tag[];
  createdAt: string;
  updatedAt?: string;
  commentCount: number;
  viewCount: number;
  likeCount: number;
  averageRating: number;
  isLikedByCurrentUser: boolean;
  isSavedByCurrentUser: boolean;
  userRating: number | null;
  comments?: Comment[];
}

export type Category = {
  id: number;
  category: string;
  slug: string;
  backgroundColor: string;
  description: string;
};

export interface Tag {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

// export interface Comment {
//   id: number;
//   content: string;
//   author: User;
//   post: Post;
//   createdAt: string;
// }

export interface ApiResponse<T> {
  slug: any;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  parentCommentId?: string | null;
  replies?: Comment[] | null;
  createdAt: string;
  updatedAt?: string | null;
  depth: number;
  replyCount: number;
  hasMoreReplies: boolean;
  isEdited?: boolean;
}

export interface ProfileUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  roles: string[];
  bio?: string;
  socialMediaLinks: {
    LINKEDIN?: string;
    TWITTER?: string;
    INSTAGRAM?: string;
    FACEBOOK?: string;
    GITHUB?: string;
  };
  postsCount: number;
  savedPostsCount: number;
  commentsCount: number;
  customProfileMarkdown: string | null;
}

export interface Upload {
  message: string;
  url: string;
  file: File;
}
