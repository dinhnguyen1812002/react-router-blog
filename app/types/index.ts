export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  createdAt?: string;
  avatar?: string ;
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
  contentType?: 'RICHTEXT' | 'MARKDOWN';
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

export interface Category {
  id: number;
  category: string;
  backgroundColor?: string;
}

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

export interface MemeResponse {
  content: Meme[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}