export interface AnalyticsSummary {
	totalViews: number;
	activeUsers: number;
	newPosts: number;
	totalLikes: number;
}

export interface MonthlyGrowthStat {
	year: number;
	month: number;
	newUsers: number;
	newPosts: number;
	totalViews: number;
	totalLikes: number;
	growthRate: number;
}

export interface MonthlyCountStat {
	year: number;
	month: number;
	count: number;
}

export interface TopPostStat {
	postId: string;
	title: string;
	authorName: string;
	viewCount: number;
	likeCount: number;
}

export interface TopAuthorStat {
	authorId: string;
	authorName: string;
	totalViews: number;
	totalLikes: number;
	postCount: number;
}

export type ReportType = "MONTH" | "QUARTER" | "YEAR";
export type ExportFormat = "PDF" | "EXCEL";

export interface ExportReportRequest {
	reportType: ReportType;
	year: number;
	month?: number | null;
	quarter?: number | null;
	exportFormat: ExportFormat;
}
