// import { type RouteConfig, index } from "@react-router/dev/routes";
//
// export default [index("routes/home.tsx")] satisfies RouteConfig;
//

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("auth-test", "routes/auth-test.tsx"), // Debug route
  route("comment-test", "routes/comment-test.tsx"), // Comment test route
  route("post-actions-test", "routes/post-actions-test.tsx"), // Post actions test route

  route("header-test", "routes/header-test.tsx"), // Header test route
  route("theme-test", "routes/theme-test.tsx"), // Theme test route

  // Dashboard routes
  // route("dashboard", "routes/dashboard._index.tsx"),
  route("dashboard/my-posts", "routes/dashboard.my-posts.tsx"), // User posts
  route("dashboard/bookmarks", "routes/dashboard.bookmarks.tsx"), // Bookmarked posts
  route("dashboard/posts/new", "routes/dashboard.posts.new.tsx"), // New post editor
  route("dashboard-test", "routes/dashboard-test.tsx"), // Dashboard test page
  route("auth-flow-test", "routes/auth-flow-test.tsx"), // Auth flow test page
  route("posts", "routes/posts._index.tsx"),
  route("posts/:slug", "routes/posts.$slug.tsx"),
  route("memes", "routes/memes._index.tsx"),
  route("memes/:slug", "routes/memes.$slug.tsx"),

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
  route("dashboard", "routes/dashboard._index.tsx"),
] satisfies RouteConfig;
