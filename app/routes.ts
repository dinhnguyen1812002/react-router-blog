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
    route("my-posts", "routes/dashboard/my-posts.tsx"), // Thêm route mới cho My Posts
    route("settings", "routes/dashboard/settings.tsx"),

    // route("posts/new", "routes/dashboard/posts/.tsx"),
    // route("posts/edit/:id", "routes/dashboard/posts/edit.tsx"), //Route edit post
    route("analytics", "routes/dashboard/analytics.tsx"),
    route("profile", "routes/dashboard/profile/index.tsx"),
    route("profile/edit", "routes/dashboard/profile/edit.tsx"),
    route("newsletter", "routes/dashboard/newsletter.tsx"), // Newsletter management for users
    route("article", "routes/dashboard/posts/article.tsx"),
    route("article/:id/edit", "routes/dashboard/posts/edit-article.tsx"),
    route("series", "routes/dashboard/series/index.tsx"),
    route("series/new", "routes/dashboard/series/new.tsx"),
    route("series/:id/edit", "routes/dashboard/series/edit.tsx"),
  ]),

  route("articles", "routes/posts._index.tsx"),
  route("articles/:slug", "routes/posts.slug.tsx"),
  route("series", "routes/series._index.tsx"),
  route("series/:slug", "routes/series.$slug.tsx"),
  route("categories", "routes/category.index.tsx"),
  route("search", "routes/search.tsx"),
  route("about", "routes/about.tsx"),
  // route("auth-error-test", "routes/auth-error-test.tsx"),

  // Dashboard routes
  // route("dashboard/my-posts", "routes/dashboard.my-posts.tsx"),
  // route("dashboard/posts/new", "routes/dashboard.posts.new.tsx"),
  // route("dashboard/posts/:slug/edit", "routes/dashboard.posts.edit.tsx"),
  route("memes", "routes/memes._index.tsx"),
  route("memes/:slug", "routes/memes.$slug.tsx"),

  // Public profile route
  // route("profile/:username", "routes/profile.$username.tsx"),
  route("profile/:slug", "routes/profile/UserProfile.tsx"),
  // Admin routes
  route("admin", "routes/admin/_layout.tsx", [
    route("", "routes/admin/index.tsx"),
    route("posts", "routes/admin/posts.tsx"),
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
