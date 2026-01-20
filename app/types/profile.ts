import type { Key } from "react";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  createdAt: string;
  slug: string;
  views: number;
  likes: number;
}

export interface SocialLinks {
  type: Key | null | undefined;
  GITHUB?: string;
  LINKEDIN?: string;
  TWITTER?: string;
  FACEBOOK?: string;
  INSTAGRAM?: string;
}

export interface UserProfile {
  username: string;
  slug: string;
  avatar: string;
  bio: string | null;
  website: string | null;
  customInformation: string | null;
  postCount: number;
  socialMediaLinks: SocialLinks;
  featuredPosts: Post[];
}
