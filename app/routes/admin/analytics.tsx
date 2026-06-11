import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	Award,
	BarChart3,
	BookOpen,
	Download,
	Eye,
	FileSpreadsheet,
	FileText,
	Heart,
	Loader2,
	RefreshCw,
	Sparkles,
	TrendingUp,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/Card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/ui/tabs";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "~/components/ui/chart";
import { UserAvatar } from "~/components/ui/boring-avatar";
import {
	useAnalyticsDashboard,
	useExportAnalyticsReport,
} from "~/hooks/useAdminAnalytics";
import type {
	ExportFormat,
	ExportReportRequest,
	ReportType,
} from "~/types/analytics";

const MONTH_LABELS = [
	"Th1",
	"Th2",
	"Th3",
	"Th4",
	"Th5",
	"Th6",
	"Th7",
	"Th8",
	"Th9",
	"Th10",
	"Th11",
	"Th12",
];

const chartConfig = {
	views: {
		label: "Lượt xem",
		color: "var(--color-chart-1)",
	},
	likes: {
		label: "Lượt thích",
		color: "var(--color-chart-2)",
	},
	users: {
		label: "Người dùng mới",
		color: "var(--color-chart-3)",
	},
	posts: {
		label: "Bài viết mới",
		color: "var(--color-chart-4)",
	},
	rate: {
		label: "Tăng trưởng (%)",
		color: "var(--color-chart-5)",
	},
} satisfies ChartConfig;

function StatCard({
	label,
	value,
	icon: Icon,
	iconBg,
	iconColor,
	trend,
	description,
}: {
	label: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	iconBg: string;
	iconColor: string;
	trend?: string;
	description?: string;
}) {
	return (
		<Card className="relative overflow-hidden border border-border/50 dark:border-border/10 bg-gradient-to-br from-card to-muted/20 hover:to-muted/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
			<div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-500 blur-xl pointer-events-none" />
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
					{label}
				</p>
				<div className={`p-2 rounded-lg ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
					<Icon className={`h-5 w-5 ${iconColor}`} />
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold tracking-tight">
					{value.toLocaleString()}
				</div>
				{trend || description ? (
					<p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
						{trend && <span className="text-emerald-500 font-semibold">{trend}</span>}
						{description && <span>{description}</span>}
					</p>
				) : null}
			</CardContent>
		</Card>
	);
}

export default function AdminAnalytics() {
	const currentYear = new Date().getFullYear();
	const [year, setYear] = useState(currentYear);
	const [exportType, setExportType] = useState<ReportType>("MONTH");
	const [exportFormat, setExportFormat] = useState<ExportFormat>("PDF");
	const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);
	const [exportQuarter, setExportQuarter] = useState(1);
	const [exportYear, setExportYear] = useState(currentYear);

	const {
		summary,
		monthlyGrowth,
		newUsersMonthly,
		postsMonthly,
		topPopular,
		topAuthors,
		isLoading,
		isRefetching,
		refetch,
	} = useAnalyticsDashboard(year);

	const exportMutation = useExportAnalyticsReport();

	const growthChartData = useMemo(() => {
		const usersByMonth = new Map(newUsersMonthly.map((item) => [item.month, item.count]));
		const postsByMonth = new Map(postsMonthly.map((item) => [item.month, item.count]));
		const growthByMonth = new Map((monthlyGrowth || []).map((item) => [item.month, item]));

		return MONTH_LABELS.map((label, index) => {
			const m = index + 1;
			const growthData = growthByMonth.get(m);
			return {
				label,
				users: usersByMonth.get(m) ?? 0,
				posts: postsByMonth.get(m) ?? 0,
				views: growthData?.totalViews ?? 0,
				likes: growthData?.totalLikes ?? 0,
				rate: growthData?.growthRate ?? 0,
			};
		});
	}, [newUsersMonthly, postsMonthly, monthlyGrowth]);

	const handleExport = () => {
		const payload: ExportReportRequest = {
			reportType: exportType,
			year: exportYear,
			exportFormat,
			month: exportType === "MONTH" ? exportMonth : null,
			quarter: exportType === "QUARTER" ? exportQuarter : null,
		};

		exportMutation.mutate(payload, {
			onSuccess: () => toast.success("Xuất báo cáo thành công"),
			onError: () => toast.error("Không thể xuất báo cáo. Vui lòng thử lại."),
		});
	};

	const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

	return (
		<div className="space-y-8 p-1">
			{/* Top Bar / Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/50 dark:border-border/10 pb-6">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text bg-gradient-to-r from-foreground to-foreground/75">
							Thống kê & Báo cáo
						</h1>
						<Sparkles className="h-5 w-5 text-amber-500 animate-pulse hidden sm:inline" />
					</div>
					<p className="text-muted-foreground text-sm">
						Phân tích hiệu suất nội dung, người dùng và xu hướng phát triển hệ thống.
					</p>
				</div>
				<div className="flex items-center gap-3 self-end md:self-auto">
					<div className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground font-medium hidden sm:inline">Năm báo cáo:</span>
						<Select
							value={String(year)}
							onValueChange={(v) => setYear(Number(v))}
						>
							<SelectTrigger className="w-[110px] bg-background hover:bg-muted/50 transition-colors">
								<SelectValue placeholder="Năm" />
							</SelectTrigger>
							<SelectContent>
								{yearOptions.map((y) => (
									<SelectItem key={y} value={String(y)}>
										{y}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button
						variant="outline"
						size="icon"
						onClick={() => refetch()}
						disabled={isLoading || isRefetching}
						className="relative bg-background hover:bg-muted/50 transition-colors h-9 w-9"
						title="Làm mới dữ liệu"
					>
						{isLoading || isRefetching ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
					<div className="relative flex items-center justify-center">
						<div className="absolute h-12 w-12 rounded-full border-4 border-primary/20 animate-ping" />
						<Loader2 className="h-8 w-8 animate-spin text-primary relative" />
					</div>
					<span className="text-sm font-medium text-muted-foreground animate-pulse">
						Đang tải dữ liệu báo cáo...
					</span>
				</div>
			) : (
				<>
					{/* Stat Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatCard
							label="Tổng lượt xem"
							value={summary?.totalViews ?? 0}
							icon={Eye}
							iconBg="bg-blue-500/10 dark:bg-blue-500/20"
							iconColor="text-blue-500"
							description="Tích lũy trên toàn hệ thống"
						/>
						<StatCard
							label="Người dùng hoạt động"
							value={summary?.activeUsers ?? 0}
							icon={Users}
							iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
							iconColor="text-emerald-500"
							description="Tài khoản đang hoạt động"
						/>
						<StatCard
							label="Bài viết mới"
							value={summary?.newPosts ?? 0}
							icon={FileText}
							iconBg="bg-purple-500/10 dark:bg-purple-500/20"
							iconColor="text-purple-500"
							description="Tổng số bài được viết"
						/>
						<StatCard
							label="Tổng lượt thích"
							value={summary?.totalLikes ?? 0}
							icon={Heart}
							iconBg="bg-rose-500/10 dark:bg-rose-500/20"
							iconColor="text-rose-500"
							description="Lượt tương tác từ độc giả"
						/>
					</div>

					{/* Charts Section */}
					<Card className="border border-border/50 dark:border-border/10 bg-gradient-to-b from-card to-card/50 shadow-sm">
						<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/50 dark:border-border/10">
							<div>
								<CardTitle className="text-lg font-bold flex items-center gap-2">
									<TrendingUp className="h-5 w-5 text-primary" />
									Biểu đồ xu hướng năm {year}
								</CardTitle>
								<CardDescription>
									Theo dõi sự thay đổi theo từng tháng
								</CardDescription>
							</div>
							<Tabs defaultValue="overview" className="w-full sm:w-auto">
								<TabsList className="grid grid-cols-3 w-full sm:w-[320px] bg-muted/50 p-1">
									<TabsTrigger value="overview">Tổng quan</TabsTrigger>
									<TabsTrigger value="activity">Hoạt động</TabsTrigger>
									<TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
								</TabsList>
								
								<div className="mt-4 sm:hidden">
									{/* Mobile content wrapper spacer */}
								</div>

								{/* Tabs Content inside CardContent for layout consistency */}
							</Tabs>
						</CardHeader>
						<CardContent className="pt-6">
							<Tabs defaultValue="overview" className="w-full">
								{/* Override standard trigger structure to keep selector inside card header */}
								<TabsContent value="overview" className="mt-0">
									<div className="h-[350px] w-full pt-2">
										<ChartContainer config={chartConfig} className="h-full w-full">
											<ResponsiveContainer width="100%" height="100%">
												<AreaChart data={growthChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
													<defs>
														<linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
															<stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.25}/>
															<stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.01}/>
														</linearGradient>
														<linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
															<stop offset="5%" stopColor="var(--color-likes)" stopOpacity={0.25}/>
															<stop offset="95%" stopColor="var(--color-likes)" stopOpacity={0.01}/>
														</linearGradient>
													</defs>
													<CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
													<XAxis dataKey="label" className="text-xs" tickLine={false} axisLine={false} />
													<YAxis className="text-xs" tickLine={false} axisLine={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Area
														type="monotone"
														dataKey="views"
														stroke="var(--color-views)"
														strokeWidth={2}
														fillOpacity={1}
														fill="url(#colorViews)"
														name="views"
													/>
													<Area
														type="monotone"
														dataKey="likes"
														stroke="var(--color-likes)"
														strokeWidth={2}
														fillOpacity={1}
														fill="url(#colorLikes)"
														name="likes"
													/>
												</AreaChart>
											</ResponsiveContainer>
										</ChartContainer>
									</div>
								</TabsContent>

								<TabsContent value="activity" className="mt-0">
									<div className="h-[350px] w-full pt-2">
										<ChartContainer config={chartConfig} className="h-full w-full">
											<ResponsiveContainer width="100%" height="100%">
												<BarChart data={growthChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }} barGap={6}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
													<XAxis dataKey="label" className="text-xs" tickLine={false} axisLine={false} />
													<YAxis className="text-xs" tickLine={false} axisLine={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Bar
														dataKey="users"
														fill="var(--color-users)"
														radius={[4, 4, 0, 0]}
														name="users"
													/>
													<Bar
														dataKey="posts"
														fill="var(--color-posts)"
														radius={[4, 4, 0, 0]}
														name="posts"
													/>
												</BarChart>
											</ResponsiveContainer>
										</ChartContainer>
									</div>
								</TabsContent>

								<TabsContent value="growth" className="mt-0">
									<div className="h-[350px] w-full pt-2">
										<ChartContainer config={chartConfig} className="h-full w-full">
											<ResponsiveContainer width="100%" height="100%">
												<LineChart data={growthChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
													<XAxis dataKey="label" className="text-xs" tickLine={false} axisLine={false} />
													<YAxis className="text-xs" tickLine={false} axisLine={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Line
														type="monotone"
														dataKey="rate"
														stroke="var(--color-rate)"
														strokeWidth={3}
														dot={{ stroke: "var(--color-rate)", strokeWidth: 2, r: 4, fill: "var(--background)" }}
														activeDot={{ r: 6, strokeWidth: 0 }}
														name="rate"
													/>
												</LineChart>
											</ResponsiveContainer>
										</ChartContainer>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>

					{/* Rankings / Listings */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Top Popular Posts */}
						<Card className="border border-border/50 dark:border-border/10 bg-gradient-to-b from-card to-card/50 shadow-sm">
							<CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50 dark:border-border/10">
								<div>
									<CardTitle className="text-lg font-bold flex items-center gap-2">
										<Award className="h-5 w-5 text-amber-500" />
										Bài viết nổi bật nhất
									</CardTitle>
									<CardDescription>Danh sách có số lượt đọc cao nhất</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="pt-4">
								<div className="divide-y divide-border/40 space-y-1">
									{topPopular.length === 0 ? (
										<p className="text-sm text-muted-foreground py-4 text-center">
											Chưa có dữ liệu thống kê
										</p>
									) : (
										topPopular.slice(0, 5).map((post, index) => (
											<div
												key={post.postId}
												className="flex items-start gap-4 py-3 first:pt-1 last:pb-1 group hover:bg-muted/10 px-2 rounded-lg transition-colors"
											>
												<div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 font-bold text-sm">
													#{index + 1}
												</div>
												<div className="flex-1 min-w-0">
													<h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
														{post.title}
													</h4>
													<p className="text-xs text-muted-foreground mt-0.5">
														bởi <span className="font-medium">{post.authorName}</span>
													</p>
													<div className="flex items-center gap-3 mt-2">
														<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
															<Eye className="h-3 w-3" />
															{post.viewCount.toLocaleString()}
														</span>
														<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
															<Heart className="h-3 w-3 text-rose-500" />
															{post.likeCount}
														</span>
													</div>
												</div>
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>

						{/* Top Authors */}
						<Card className="border border-border/50 dark:border-border/10 bg-gradient-to-b from-card to-card/50 shadow-sm">
							<CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50 dark:border-border/10">
								<div>
									<CardTitle className="text-lg font-bold flex items-center gap-2">
										<BookOpen className="h-5 w-5 text-indigo-500" />
										Tác giả hàng đầu
									</CardTitle>
									<CardDescription>Cộng tác viên hoạt động tích cực</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="pt-4">
								<div className="divide-y divide-border/40 space-y-1">
									{topAuthors.length === 0 ? (
										<p className="text-sm text-muted-foreground py-4 text-center">
											Chưa có dữ liệu thống kê
										</p>
									) : (
										topAuthors.slice(0, 5).map((author, index) => (
											<div
												key={author.authorId}
												className="flex items-center gap-4 py-3 first:pt-1 last:pb-1 hover:bg-muted/10 px-2 rounded-lg transition-colors"
											>
												<div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
													#{index + 1}
												</div>
												<UserAvatar
													name={author.authorName}
													size={36}
													className="shrink-0 rounded-full border border-border"
												/>
												<div className="flex-1 min-w-0">
													<h4 className="text-sm font-semibold text-foreground truncate">
														{author.authorName}
													</h4>
													<div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
														<span>
															<span className="font-semibold text-foreground">{author.postCount}</span> bài viết
														</span>
														<span>•</span>
														<span>
															<span className="font-semibold text-foreground">{author.totalViews.toLocaleString()}</span> lượt xem
														</span>
														<span>•</span>
														<span>
															<span className="font-semibold text-foreground text-rose-500">{author.totalLikes}</span> thích
														</span>
													</div>
												</div>
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Export Report Card */}
					<Card className="border border-border/50 dark:border-border/10 bg-gradient-to-b from-card to-card/50 shadow-sm">
						<CardHeader className="border-b border-border/50 dark:border-border/10 pb-4">
							<CardTitle className="text-lg font-bold flex items-center gap-2">
								<BarChart3 className="h-5 w-5 text-primary" />
								Xuất báo cáo định kỳ
							</CardTitle>
							<CardDescription>Tạo và tải báo cáo dữ liệu hoạt động dưới dạng văn bản</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								<div className="space-y-1.5">
									<label className="text-xs font-semibold text-muted-foreground">
										Loại báo cáo
									</label>
									<Select
										value={exportType}
										onValueChange={(v) => setExportType(v as ReportType)}
									>
										<SelectTrigger className="bg-background">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="MONTH">Theo tháng</SelectItem>
											<SelectItem value="QUARTER">Theo quý</SelectItem>
											<SelectItem value="YEAR">Theo năm</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-1.5">
									<label className="text-xs font-semibold text-muted-foreground">
										Năm
									</label>
									<Select
										value={String(exportYear)}
										onValueChange={(v) => setExportYear(Number(v))}
									>
										<SelectTrigger className="bg-background">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{yearOptions.map((y) => (
												<SelectItem key={y} value={String(y)}>
													{y}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{exportType === "MONTH" && (
									<div className="space-y-1.5 animate-fadeIn">
										<label className="text-xs font-semibold text-muted-foreground">
											Tháng
										</label>
										<Select
											value={String(exportMonth)}
											onValueChange={(v) => setExportMonth(Number(v))}
										>
											<SelectTrigger className="bg-background">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{MONTH_LABELS.map((label, i) => (
													<SelectItem key={label} value={String(i + 1)}>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}

								{exportType === "QUARTER" && (
									<div className="space-y-1.5 animate-fadeIn">
										<label className="text-xs font-semibold text-muted-foreground">
											Quý
										</label>
										<Select
											value={String(exportQuarter)}
											onValueChange={(v) => setExportQuarter(Number(v))}
										>
											<SelectTrigger className="bg-background">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[1, 2, 3, 4].map((q) => (
													<SelectItem key={q} value={String(q)}>
														Quý {q}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}

								<div className="space-y-1.5">
									<label className="text-xs font-semibold text-muted-foreground">
										Định dạng
									</label>
									<Select
										value={exportFormat}
										onValueChange={(v) => setExportFormat(v as ExportFormat)}
									>
										<SelectTrigger className="bg-background">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="PDF">PDF Document</SelectItem>
											<SelectItem value="EXCEL">Excel Spreadsheet</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="flex items-center justify-end border-t border-border/40 pt-4">
								<Button
									onClick={handleExport}
									disabled={exportMutation.isPending}
									className="flex items-center gap-2 min-w-[160px] font-semibold"
								>
									{exportMutation.isPending ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : exportFormat === "PDF" ? (
										<FileText className="h-4 w-4" />
									) : (
										<FileSpreadsheet className="h-4 w-4" />
									)}
									Xuất {exportFormat === "PDF" ? "PDF" : "Excel"}
									<Download className="h-3.5 w-3.5" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
