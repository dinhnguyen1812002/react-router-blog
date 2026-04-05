import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useMemo } from "react";
import { useState } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useParams } from "react-router";
import { userApi } from "~/api/user";
import { MainLayout } from "~/components/layout/MainLayout";
import { BlogPostCard } from "~/components/public/BlogPostCard";
import { ProfileHeader } from "~/components/public/ProfileHeader";
import { TabNavigation } from "~/components/public/TabNavigation";
import { useThemeStore } from "~/store/themeStore";
import type { UserProfile } from "~/types/profile";

// ✅ bundle-dynamic-imports: lazy load heavy markdown component
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

const tabs = [
	{ id: "posts", label: "Bài viết", count: 47 },
	{ id: "about", label: "Giới thiệu" },
	{ id: "series", label: "Series", count: 5 },
	{ id: "bookmarks", label: "Đã lưu", count: 23 },
];

interface LoaderData {
	profile: UserProfile | null;
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
	const username = params?.username;
	if (!username) return { profile: null };

	try {
		const profile = await userApi.getProfile(username);
		return { profile };
	} catch {
		return { profile: null };
	}
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
	const username = params?.username;
	const profile = data?.profile;

	if (!username || !profile) {
		return [
			{ title: "Hồ sơ người dùng - Inkwell" },
			{ name: "description", content: "Khám phá hồ sơ người dùng trên Inkwell - nền tảng blog cao cấp." },
		];
	}

	const displayName = profile.username || username;
	const profileTitle = `${displayName} (@${username}) - Hồ sơ tác giả | Inkwell`;
	const profileDescription = profile.bio
		? `${profile.bio} - Khám phá bài viết của ${displayName} trên Inkwell.`
		: `Khám phá hồ sơ và bài viết của @${username} trên Inkwell. Tham gia cộng đồng tác giả đam mê chia sẻ kiến thức và sáng tạo nội dung chất lượng.`;
	const profileUrl = `https://inkwell.vn/profile/${username}`;
	const profileImage = profile.avatar || `https://inkwell.vn/api/og/profile/${username}`;

	const nameParts = (profile.username ?? "").split(" ");

	return [
		{ title: profileTitle },
		{ name: "description", content: profileDescription },
		{ name: "keywords", content: `${username}, ${displayName}, tác giả, blog, bài viết, hồ sơ, inkwell, viết lách, chia sẻ kiến thức` },
		{ name: "author", content: displayName },
		{ name: "robots", content: "index, follow, max-image-preview:large" },
		{ property: "og:title", content: `${displayName} - Tác giả trên Inkwell` },
		{ property: "og:description", content: profileDescription },
		{ property: "og:type", content: "profile" },
		{ property: "og:url", content: profileUrl },
		{ property: "og:image", content: profileImage },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{ property: "og:image:alt", content: `Hồ sơ của ${displayName} trên Inkwell` },
		{ property: "og:site_name", content: "Inkwell" },
		{ property: "og:locale", content: "vi_VN" },
		{ property: "profile:username", content: username },
		...(nameParts[0] ? [{ property: "profile:first_name", content: nameParts[0] }] : []),
		...(nameParts.length > 1 ? [{ property: "profile:last_name", content: nameParts.slice(1).join(" ") }] : []),
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: `${displayName} - Tác giả trên Inkwell` },
		{ name: "twitter:description", content: profileDescription },
		{ name: "twitter:image", content: profileImage },
		{ name: "twitter:image:alt", content: `Hồ sơ ${displayName}` },
		{ name: "twitter:site", content: "@InkwellVN" },
		...(profile.socialMediaLinks?.TWITTER
			? [{ name: "twitter:creator", content: `@${profile.socialMediaLinks.TWITTER}` }]
			: []),
		{ name: "googlebot", content: "index, follow" },
		{ name: "bingbot", content: "index, follow" },
		{ name: "language", content: "Vietnamese" },
		{ name: "geo.region", content: "VN" },
		{ name: "geo.country", content: "Vietnam" },
		{ name: "format-detection", content: "telephone=no" },
		{ name: "theme-color", content: "#4f46e5" },
	];
};

// ✅ rendering-hoist-jsx: static fallback JSX hoisted outside component
const MarkdownFallback = (
	<div className="h-32 animate-pulse rounded-xl bg-muted" />
);

const UserProfile = () => {
	const [activeTab, setActiveTab] = useState("posts");
	const { slug = "" } = useParams();

	const { data: profile } = useQuery({
		queryKey: ["public-user", slug],
		queryFn: () => userApi.getProfile(slug),
		enabled: !!slug,
	});

	// ✅ rerender-derived-state-no-effect: lấy theme trực tiếp, không cần effect + state riêng
	const theme = useThemeStore((state) => state.theme);
	const colorMode = theme as "light" | "dark";

	// ✅ rerender-derived-state-no-effect: derive document title, không dùng useEffect
	// Chỉ giữ lại nếu bắt buộc phải update title phía client (ngoài meta loader)
	useEffect(() => {
		if (!profile) return;
		const displayName = profile.username || slug;
		document.title = `${displayName} (@${profile.username || slug}) - Inkwell`;
	}, [profile?.username, slug]); // ✅ rerender-dependencies: dùng primitive dependency

	// ✅ rerender-memo: tabs được tính lại chỉ khi featuredPosts thay đổi
	const resolvedTabs = useMemo(
		() =>
			tabs.map((tab) => ({
				...tab,
				count:
					tab.id === "posts" && profile?.featuredPosts
						? profile.featuredPosts.length
						: tab.count,
			})),
		[profile?.featuredPosts?.length], // ✅ primitive dependency
	);

	return (
		<MainLayout>
			<div className="min-h-screen bg-background">
				{profile && <ProfileHeader {...profile} />}

				<main className="container max-w-4xl mx-auto px-4 py-8">
					<TabNavigation
						tabs={resolvedTabs}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>

					{activeTab === "posts" && (
						<section className="mt-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{profile?.featuredPosts?.map((post, index) => (
									<div
										key={post.id}
										className="animate-slide-up"
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										<BlogPostCard {...post} />
									</div>
								))}
							</div>

							{/* ✅ rendering-conditional-render: dùng ternary thay && */}
							{profile && !profile.featuredPosts?.length ? (
								<div className="text-center py-12 text-muted-foreground">
									<p>Chưa có bài viết nào</p>
								</div>
							) : null}
						</section>
					)}

					{activeTab === "about" && (
						<section className="mt-8 animate-fade-in">
							{profile?.customInformation ? (
								// ✅ bundle-dynamic-imports: MarkdownPreview lazy loaded với Suspense
								// ✅ Dark mode fix: dùng key={colorMode} để force re-render khi đổi theme
								//    và override background về transparent để tránh màu đen cứng
								<div className="rounded-xl shadow-soft markdown-theme-wrapper">
									<Suspense fallback={MarkdownFallback}>
										<MarkdownPreview
											key={colorMode}
											source={profile.customInformation}
											style={{
												padding: 0,
												backgroundColor: "transparent",
												color: "inherit",
											}}
											wrapperElement={{ "data-color-mode": colorMode }}
										/>
									</Suspense>
								</div>
							) : (
								<div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
									<h2 className="font-display text-2xl font-semibold text-foreground mb-4">
										Về tôi
									</h2>
									<div className="prose prose-lg text-muted-foreground space-y-4">
										<p>
											Xin chào! Tôi là {profile?.username || "một tác giả"}, đam mê chia sẻ kiến thức và kinh nghiệm qua blog.
										</p>
										{profile?.bio && (
											<p className="italic border-l-4 border-primary pl-4">
												"{profile.bio}"
											</p>
										)}
										<p>
											Tham gia Inkwell để khám phá thêm nhiều bài viết và kết nối với cộng đồng tác giả.
										</p>
									</div>
								</div>
							)}
						</section>
					)}

					{activeTab === "series" && (
						<section className="mt-8 animate-fade-in">
							<div className="text-center py-12 text-muted-foreground">
								<p>Danh sách series sẽ hiển thị ở đây</p>
							</div>
						</section>
					)}

					{activeTab === "bookmarks" && (
						<section className="mt-8 animate-fade-in">
							<div className="text-center py-12 text-muted-foreground">
								<p>Danh sách bài viết đã lưu sẽ hiển thị ở đây</p>
							</div>
						</section>
					)}
				</main>
			</div>
		</MainLayout>
	);
};

export default UserProfile;