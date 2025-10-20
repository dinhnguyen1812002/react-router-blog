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
  avatar?: string ;
  socialMediaLinks: socialMediaLinks[];
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string ;
  roles: string[];
  accessToken: string;
  token: string;
  refreshToken?: string;
}

export interface RegisterResponse extends LoginResponse {
  // Register response can include login data for auto-login
  autoLogin?: boolean;
}

export interface Post {
  id: string;
  title: string;
  excerpt:string;
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
  public_date: string,
  is_publish : boolean
  
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
  data: Comment;
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
  website?: string;
  customProfileMarkdown?: string | null;
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
}

export interface Upload {
  message: string;
  url: string;
  file: File;
}

export interface Meme {
  id: string;
  name: string;
  description: string;
  memeUrl: string;
  slug: string;
  createdAt?: string;
  likes?: number;
  views?: number;
}

// Series types
export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string | null;
  userId: string;
  username: string;
  userAvatar?: string | null;
  isActive: boolean;
  isCompleted: boolean;
  totalPosts: number;
  viewCount: number;
  posts: SeriesPost[];
  createdAt: string;
  updatedAt: string;
  // Legacy support - will be removed
  author?: {
    id: string;
    username: string;
  };
  postCount?: number;
}

export interface SeriesPost {
  id: string;
  title: string;
  slug: string;
  order?: number;
}

export interface CreateSeriesRequest {
  title: string;
  slug: string;
  description: string;
}

export interface UpdateSeriesRequest {
  title?: string;
  slug?: string;
  description?: string;
}

export interface AddPostToSeriesRequest {
  postId: string;
}

export interface ReorderSeriesPostsRequest {
  postIds: string[];
}

export interface SeriesSearchRequest {
  keyword?: string;
  authorId?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}
