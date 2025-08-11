export interface Notification {
  id: string;
  type: 'post' | 'comment' | 'like' | 'bookmark' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  userId?: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface CommentNotification {
  postId: string;
  postTitle: string;
  authorUsername: string;
  content: string;
  timestamp: string;
}

export interface PostNotification {
  postId: string;
  title: string;
  authorUsername: string;
  action: 'created' | 'updated' | 'published';
  timestamp: string;
}