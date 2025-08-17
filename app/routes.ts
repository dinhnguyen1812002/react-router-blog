import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),


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
  route("newsletter", "routes/dashboard/newsletter.tsx"), // Newsletter management for users
  route("posts/:slug/edit", "routes/dashboard/posts/edit.tsx"),
]),

  route("posts", "routes/posts._index.tsx"),
  route("posts/:slug", "routes/posts.slug.tsx"),
  route("search", "routes/search.tsx"),
  route("auth-error-test", "routes/auth-error-test.tsx"),

  // Dashboard routes
  route("dashboard/my-posts", "routes/dashboard.my-posts.tsx"),
  route("dashboard/posts/new", "routes/dashboard.posts.new.tsx"),
    // route("dashboard/posts/:slug/edit", "routes/dashboard.posts.edit.tsx"),
  route("memes", "routes/memes._index.tsx"),
  route("memes/:slug", "routes/memes.$slug.tsx"),

  // route("meme-simple", "routes/meme-simple.tsx"),
  // route("memes-simple", "routes/memes-simple.tsx"),
  // route("memes-debug", "routes/memes-debug.tsx"),
  // route("memes-basic", "routes/memes-basic.tsx"),




  // Author routes
  route("author/posts", "routes/author.posts._index.tsx"),
  route("author/posts/new", "routes/author.posts.new.tsx"),
  // route("author/posts/edit/:postId", "routes/author.posts.edit.$postId.tsx"),

  // Admin routes
  route("admin", "routes/admin/_layout.tsx", [
    route("", "routes/admin/index.tsx"),
    route("analytics", "routes/admin/analytics.tsx"),
    route("users", "routes/admin/users.tsx"),
    route("roles", "routes/admin/roles.tsx"),
    route("categories", "routes/admin/categories.tsx"),
    route("tags", "routes/admin/tags.tsx"),
    route("newsletter", "routes/admin/newsletter.tsx"),
    route("settings", "routes/admin/settings.tsx"),
  ]),

  // User profile and settings
  // route("profile/:userId", "routes/profile.$userId.tsx"),
  // route("settings/profile", "routes/settings.profile.tsx"),
] satisfies RouteConfig;

