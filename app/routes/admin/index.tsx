import { useQuery } from "@tanstack/react-query";
import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	Eye,
	FileText,
	FolderOpen,
	Heart,
	Loader2,
	Mail,
	Minus,
	Tags,
	TrendingUp,
	Users,
} from "lucide-react";
import { Link } from "react-router";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import { ChartAreaInteractive } from "~/components/chart/chart-area-interactive";
import adminMockData from "~/data/admin-mock-data.json";
import {
	useAnalyticsSummary,
	useTopLikedPosts,
	useTopViewedPosts,
} from "~/hooks/useAdminAnalytics";
import type { Route } from "./+types";
export function meta({}: Route.MetaArgs) {
	return [
		// Basic SEO Metadata
		{ title: "Admin - Manage Page" },
		{
			name: "description",
			content:
				"Explore a vibrant community of writers sharing knowledge, tutorials, and insights. Discover trending articles, popular categories, and connect with creators on our blog platform.",
		},
		{
			name: "keywords",
			content:
				"blog, articles, tutorials, writing community, trending topics, categories, insights, knowledge sharing",
		},

		// Open Graph (OG) Metadata for Social Media (e.g., Facebook, LinkedIn)
		{
			property: "og:title",
			content: "Blog App - Your Source for Inspiring Content",
		},
		{
			property: "og:description",
			content:
				"Join our blog platform to read, write, and connect with a global community of writers and readers. Explore trending articles and diverse topics.",
		},
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://your-blog-app.com" }, // Replace with your actual domain
		{ property: "og:image", content: "https://your-blog-app.com/og-image.jpg" }, // Replace with a relevant image URL
		{ property: "og:site_name", content: "Blog App" },

		// Twitter Card Metadata
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: "Blog App - Discover Inspiring Stories" },
		{
			name: "twitter:description",
			content:
				"Read and share inspiring articles on our blog platform. Join a community of writers and explore trending topics today!",
		},
		{
			name: "twitter:image",
			content: "https://your-blog-app.com/twitter-image.jpg",
		}, // Replace with a relevant image URL
		{ name: "twitter:site", content: "@YourBlogHandle" }, // Replace with your Twitter handle

		// Additional Metadata
		{ name: "robots", content: "index, follow" },
		{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
		{ charset: "UTF-8" },
	];
}

interface StatCardProps {
	name: string;
	value: number;
	change: number;
	changeType: "increase" | "decrease" | "neutral";
	period: string;
	icon: React.ComponentType<any>;
}

const StatCard = ({
	name,
	value,
	change,
	changeType,
	period,
	icon: Icon,
}: StatCardProps) => {
	const getChangeIcon = () => {
		switch (changeType) {
			case "increase":
				return <ArrowUpRight className="h-4 w-4 text-green-600" />;
			case "decrease":
				return <ArrowDownRight className="h-4 w-4 text-red-600" />;
			default:
				return <Minus className="h-4 w-4 text-gray-600" />;
		}
	};

	const getChangeColor = () => {
		switch (changeType) {
			case "increase":
				return "text-green-600";
			case "decrease":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-700/20 p-6 border border-gray-200 dark:border-gray-700">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600 dark:text-gray-300">
						{name}
					</p>
					<p className="text-2xl font-bold text-gray-900 dark:text-white">
						{value.toLocaleString()}
					</p>
				</div>
				<div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
					<Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
				</div>
			</div>
			<div className="mt-4 flex items-center">
				{getChangeIcon()}
				<span className={`ml-1 text-sm font-medium ${getChangeColor()}`}>
					{change > 0 ? "+" : ""}
					{change}%
				</span>
				<span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
					{period}
				</span>
			</div>
		</div>
	);
};

export default function AdminDashboard() {
	const mockData = adminMockData.overview;

	const {
		data: summary,
		isLoading: summaryLoading,
		error: summaryError,
		refetch: refetchSummary,
		isRefetching,
	} = useAnalyticsSummary();

	const { data: topViewed = [], isLoading: topViewedLoading } =
		useTopViewedPosts(5);
	const { data: topLiked = [], isLoading: topLikedLoading } = useTopLikedPosts(5);

	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: categoriesApi.getAll,
		staleTime: 1000 * 60 * 5,
	});

	const { data: tags = [] } = useQuery({
		queryKey: ["tags"],
		queryFn: tagsApi.getAll,
		staleTime: 1000 * 60 * 5,
	});

	const loading = summaryLoading;
	const hasError = !!summaryError;

	const stats = [
		{
			name: "Tổng lượt xem",
			value: summary?.totalViews ?? 0,
			change: 0,
			changeType: "neutral" as const,
			period: "toàn nền tảng",
			icon: Eye,
		},
		{
			name: "Người dùng hoạt động",
			value: summary?.activeUsers ?? 0,
			change: 0,
			changeType: "neutral" as const,
			period: "30 ngày qua",
			icon: Users,
		},
		{
			name: "Bài viết mới (tháng)",
			value: summary?.newPosts ?? 0,
			change: 0,
			changeType: "neutral" as const,
			period: "tháng hiện tại",
			icon: FileText,
		},
		{
			name: "Tổng lượt thích",
			value: summary?.totalLikes ?? 0,
			change: 0,
			changeType: "neutral" as const,
			period: "toàn nền tảng",
			icon: Heart,
		},
		{
			name: "Tổng danh mục",
			value: categories.length,
			change: 0,
			changeType: "neutral" as const,
			period: "đang quản lý",
			icon: FolderOpen,
		},
		{
			name: "Tổng thẻ",
			value: tags.length,
			change: 0,
			changeType: "neutral" as const,
			period: "đang quản lý",
			icon: Tags,
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Dashboard
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Tổng quan về hệ thống quản lý blog
						{isRefetching && !loading && (
							<span className="ml-2 text-blue-600 dark:text-blue-400 text-sm">
								<Loader2 className="inline h-3 w-3 animate-spin mr-1" />
								Đang cập nhật...
							</span>
						)}
					</p>
				</div>
				<button
					onClick={() => refetchSummary()}
					disabled={loading || isRefetching}
					className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{loading || isRefetching ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
					)}
					<span>{loading || isRefetching ? "Đang tải..." : "Làm mới"}</span>
				</button>
			</div>

			{/* Stats Grid */}
			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-700/20 p-6 border dark:border-amber-500/20"
						>
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
									<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
								</div>
								<div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
							</div>
							<div className="mt-4 flex items-center">
								<Loader2 className="h-4 w-4 animate-spin text-gray-400 dark:text-gray-500" />
								<span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
									Đang tải...
								</span>
							</div>
						</div>
					))}
				</div>
			) : hasError ? (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
					<div className="flex items-center">
						<div className="text-red-600 dark:text-red-400">
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<p className="text-sm text-red-800 dark:text-red-300">
								Không thể tải dữ liệu thống kê
							</p>
							<p className="text-xs text-red-600 dark:text-red-400 mt-1">
								Vui lòng thử làm mới hoặc kiểm tra quyền ADMIN
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{stats.map((stat) => (
						<StatCard key={stat.name} {...stat} />
					))}
				</div>
			)}
			<ChartAreaInteractive />
			{/* Top Posts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Most Viewed Posts */}
				<div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-700/20 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							Bài viết được xem nhiều nhất
						</h2>
						<Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
					</div>
					<div className="space-y-4">
						{topViewedLoading ? (
							<div className="flex justify-center py-4">
								<Loader2 className="h-5 w-5 animate-spin text-gray-400" />
							</div>
						) : topViewed.length === 0 ? (
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Chưa có dữ liệu
							</p>
						) : (
							topViewed.map((post, index) => (
								<div key={post.postId} className="flex items-start space-x-3">
									<div className="shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
										<span className="text-xs font-medium text-blue-600 dark:text-blue-400">
											{index + 1}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
											{post.title}
										</p>
										<div className="flex items-center space-x-2 mt-1">
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{post.viewCount.toLocaleString()} lượt xem
											</span>
											<span className="text-xs text-gray-400 dark:text-gray-500">
												•
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{post.authorName}
											</span>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Most Liked Posts */}
				<div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-700/20 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							Bài viết được yêu thích nhất
						</h2>
						<Heart className="h-5 w-5 text-gray-400 dark:text-gray-500" />
					</div>
					<div className="space-y-4">
						{topLikedLoading ? (
							<div className="flex justify-center py-4">
								<Loader2 className="h-5 w-5 animate-spin text-gray-400" />
							</div>
						) : topLiked.length === 0 ? (
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Chưa có dữ liệu
							</p>
						) : (
							topLiked.map((post, index) => (
								<div key={post.postId} className="flex items-start space-x-3">
									<div className="shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
										<span className="text-xs font-medium text-red-600 dark:text-red-400">
											{index + 1}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
											{post.title}
										</p>
										<div className="flex items-center space-x-2 mt-1">
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{post.likeCount} lượt thích
											</span>
											<span className="text-xs text-gray-400 dark:text-gray-500">
												•
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{post.authorName}
											</span>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Recent Activities */}
			<div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-700/20 p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
						Hoạt động gần đây
					</h2>
					<Activity className="h-5 w-5 text-gray-400 dark:text-gray-500" />
				</div>
				<div className="space-y-4">
					{mockData.recentActivities.map((activity) => (
						<div key={activity.id} className="flex items-start space-x-3">
							<div className="shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2"></div>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-gray-900 dark:text-white">
									{activity.message}
								</p>
								<div className="flex items-center space-x-2 mt-1">
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{activity.user}
									</span>
									<span className="text-xs text-gray-400 dark:text-gray-500">
										•
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{new Date(activity.timestamp).toLocaleString("vi-VN")}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="mt-4 pt-4 border-t dark:border-gray-700">
					<button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
						Xem tất cả hoạt động →
					</button>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-700/20 p-6">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					Thao tác nhanh
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Link to="/admin/users" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors block text-center">
						<Users className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
						<p className="text-sm font-medium text-gray-700 dark:text-white">
							Quản lý người dùng
						</p>
					</Link>
					<Link to="/admin/categories" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors block text-center">
						<FolderOpen className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
						<p className="text-sm font-medium text-gray-700 dark:text-white">
							Quản lý danh mục
						</p>
					</Link>
					<Link to="/admin/tags" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors block text-center">
						<Tags className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
						<p className="text-sm font-medium text-gray-700 dark:text-white">
							Quản lý thẻ
						</p>
					</Link>
					<Link to="/admin/newsletter" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors block text-center">
						<Mail className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
						<p className="text-sm font-medium text-gray-700 dark:text-white">
							Quản lý Newsletter
						</p>
					</Link>
				</div>
			</div>

			{/* System Status */}
			{/* <div className="bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-700/20 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trạng thái hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Database</p>
            <p className="text-xs text-green-600 dark:text-green-400">Hoạt động bình thường</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">API Server</p>
            <p className="text-xs text-green-600 dark:text-green-400">Hoạt động bình thường</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Storage</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Sử dụng 78%</p>
          </div>
        </div>
      </div> */}
		</div>
	);
}
