import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  // route("auth-test", "routes/auth-test.tsx"), // Debug route
  // route("comment-test", "routes/comment-test.tsx"), // Comment test route
  // route("post-actions-test", "routes/post-actions-test.tsx"), // Post actions test route

  // route("header-test", "routes/header-test.tsx"), // Header test route
  // route("theme-test", "routes/theme-test.tsx"), // Theme test route

  // Dashboard routes
route("dashboard", "routes/dashboard/_layout.tsx", [
  route("", "routes/dashboard/index.tsx"),
  route("bookmarks", "routes/dashboard/bookmarks.tsx"),
  route("content", "routes/dashboard/content.tsx"),
  route("my-posts", "routes/dashboard/my-posts.tsx"), // Thêm route mới cho My Posts
  route("settings", "routes/dashboard/settings.tsx"),
  route("posts/new", "routes/dashboard/posts/new.tsx"),
  route("analytics", "routes/dashboard/analytics.tsx"),
  route("profile", "routes/dashboard/profile.tsx"),
]),
  
  // route("dashboard-test", "routes/dashboard-test.tsx"), // Dashboard test page
  // route("auth-flow-test", "routes/auth-flow-test.tsx"), // Auth flow test page
  route("posts", "routes/posts._index.tsx"),
  route("posts/:slug", "routes/posts.$slug.tsx"),
  route("memes", "routes/memes._index.tsx"),
  route("memes/:slug", "routes/memes.$slug.tsx"),
  route("meme-test", "routes/meme-test.tsx"),
  route("meme-simple", "routes/meme-simple.tsx"),
  route("memes-simple", "routes/memes-simple.tsx"),
  route("memes-debug", "routes/memes-debug.tsx"),
  route("memes-basic", "routes/memes-basic.tsx"),
  route("storage-debug", "routes/storage-debug.tsx"),

  // Author routes
  route("author/posts", "routes/author.posts._index.tsx"),
  route("author/posts/new", "routes/author.posts.new.tsx"),
  // route("author/posts/edit/:postId", "routes/author.posts.edit.$postId.tsx"),

  // Admin routes
  // route("admin", "routes/admin._index.tsx"),
  // route("admin/categories", "routes/admin.categories.tsx"),
  // route("admin/tags", "routes/admin.tags.tsx"),
  // route("admin/users", "routes/admin.users.tsx"),
  // route("admin/posts", "routes/admin.posts.tsx"),

  // User profile and settings
  // route("profile/:userId", "routes/profile.$userId.tsx"),
  // route("settings/profile", "routes/settings.profile.tsx"),
] satisfies RouteConfig;

