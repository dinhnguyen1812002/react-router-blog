import { formatDistanceToNow } from "date-fns";
import { ExternalLink, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportApi } from "~/api/report";
import { getCategoryLabel, reportCategories, reportStatuses } from "~/schemas/report";
import { ReportStatusBadge } from "~/components/article/report-status-badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import type { ReportCategory, ReportStatus, GetReportsParams } from "~/api/report";

export function ReportsList() {
	const [filters, setFilters] = useState<GetReportsParams>({
		page: 0,
		size: 20,
	});

	const { data: reportsData, isLoading, error } = useQuery({
		queryKey: ["admin-reports", filters],
		queryFn: () => reportApi.getAdminReports(filters),
		staleTime: 2 * 60 * 1000, // 2 minutes
	});

	const handleFilterChange = (key: keyof GetReportsParams, value: any) => {
		setFilters(prev => ({
			...prev,
			[key]: value,
			page: key === 'page' ? value : 0, // Reset page when changing other filters
		}));
	};

	const handlePageChange = (page: number) => {
		setFilters(prev => ({ ...prev, page }));
	};

	if (isLoading && !reportsData) {
		return (
			<div className="space-y-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<Skeleton className="h-5 w-48" />
										<Skeleton className="h-4 w-32" />
									</div>
									<Skeleton className="h-6 w-20" />
								</div>
								<div className="flex items-center gap-4">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-28" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error || !reportsData) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground">Failed to load reports</p>
				</CardContent>
			</Card>
		);
	}

	const { content: reports, totalPages, number: currentPage } = reportsData;

	return (
		<div className="space-y-6">
			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<div className="flex-1 min-w-[200px]">
							<Select
								value={filters.status || ""}
								onValueChange={(value) => 
									handleFilterChange("status", value || undefined)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">All Statuses</SelectItem>
									{reportStatuses.map((status) => (
										<SelectItem key={status.value} value={status.value}>
											{status.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1 min-w-[200px]">
							<Select
								value={filters.category || ""}
								onValueChange={(value) => 
									handleFilterChange("category", value || undefined)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Filter by category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">All Categories</SelectItem>
									{reportCategories.map((category) => (
										<SelectItem key={category.value} value={category.value}>
											{category.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Reports List */}
			<div className="space-y-4">
				{reports.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<p className="text-muted-foreground">No reports found</p>
						</CardContent>
					</Card>
				) : (
					reports.map((report) => (
						<Card key={report.id}>
							<CardContent className="p-6">
								<div className="space-y-4">
									{/* Header */}
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<h3 className="font-semibold">{report.postTitle}</h3>
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<span>by {report.postAuthor}</span>
												<span>·</span>
												<span>reported by {report.reporterUsername}</span>
											</div>
										</div>
										<ReportStatusBadge status={report.status} />
									</div>

									{/* Report Details */}
									<div className="space-y-2">
										<div className="flex items-center gap-4 text-sm">
											<Badge variant="outline">
												{getCategoryLabel(report.category)}
											</Badge>
											<span className="text-muted-foreground">
												{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
											</span>
										</div>

										{report.description && (
											<div className="bg-muted p-3 rounded-md">
												<p className="text-sm">{report.description}</p>
											</div>
										)}

										{report.adminNotes && (
											<div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border-l-4 border-blue-200 dark:border-blue-800">
												<div className="flex items-start gap-2">
													<MessageSquare className="size-4 text-blue-600 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-blue-800 dark:text-blue-200">
															Admin Notes
														</p>
														<p className="text-sm text-blue-700 dark:text-blue-300">
															{report.adminNotes}
														</p>
														{report.reviewedBy && (
															<p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
																Reviewed by {report.reviewedBy}
																{report.reviewedAt && (
																	<span>
																		{" "}
																		{formatDistanceToNow(new Date(report.reviewedAt), {
																			addSuffix: true,
																		})}
																	</span>
																)}
															</p>
														)}
													</div>
												</div>
											</div>
										)}
									</div>

									{/* Actions */}
									<div className="flex items-center gap-2 pt-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												// Navigate to post
												window.open(`/posts/${report.postSlug}`, "_blank");
											}}
										>
											<ExternalLink className="size-4 mr-2" />
											View Post
										</Button>
										
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												// Navigate to user profile
												window.open(`/users/${report.reporterUsername}`, "_blank");
											}}
										>
											<User className="size-4 mr-2" />
											Reporter
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Card>
					<CardContent className="flex items-center justify-between py-4">
						<div className="text-sm text-muted-foreground">
							Page {currentPage + 1} of {totalPages}
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 0}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage >= totalPages - 1}
							>
								Next
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
