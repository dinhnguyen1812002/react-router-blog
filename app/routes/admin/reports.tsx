import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	AlertTriangle,
	ArrowUpDown,
	CheckCircle,
	Clock,
	Eye,
	FileText,
	MoreHorizontal,
	Trash2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
	AdminReport,
	GetReportsParams,
	ReportCategory,
	ReportStatus,
} from "~/api/report";
import { reportApi } from "~/api/report";
import { ReportStatusBadge } from "~/components/article/report-status-badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { getCategoryLabel } from "~/schemas/report";

export default function ReportsContent() {
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
		null,
	);
	const [showDetailsDialog, setShowDetailsDialog] = useState(false);
	const [updateStatus, setUpdateStatus] = useState<ReportStatus | "">("");
	const [adminNotes, setAdminNotes] = useState("");

	const queryClient = useQueryClient();

	const filters: GetReportsParams = {
		page,
		size,
		status:
			statusFilter && statusFilter !== "all"
				? (statusFilter as ReportStatus)
				: undefined,
		category:
			categoryFilter && categoryFilter !== "all"
				? (categoryFilter as ReportCategory)
				: undefined,
	};

	const { data: reportsData, isLoading } = useQuery({
		queryKey: ["admin-reports", filters],
		queryFn: () => reportApi.getAdminReports(filters),
	});

	const { data: stats } = useQuery({
		queryKey: ["report-statistics"],
		queryFn: reportApi.getReportStatistics,
	});

	const updateStatusMutation = useMutation({
		mutationFn: ({
			reportId,
			status,
			notes,
		}: { reportId: string; status: ReportStatus; notes?: string }) =>
			reportApi.updateReportStatus(reportId, {
				status: status as Exclude<ReportStatus, "PENDING">,
				adminNotes: notes,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
			queryClient.invalidateQueries({ queryKey: ["report-statistics"] });
			toast.success("Cập nhật trạng thái báo cáo thành công!");
			setShowDetailsDialog(false);
			setSelectedReport(null);
		},
		onError: () => {
			toast.error("Có lỗi xảy ra khi cập nhật báo cáo!");
		},
	});

	const deleteReportMutation = useMutation({
		mutationFn: (reportId: string) => reportApi.deleteReport(reportId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
			queryClient.invalidateQueries({ queryKey: ["report-statistics"] });
			toast.success("Xóa báo cáo thành công!");
		},
		onError: () => {
			toast.error("Có lỗi xảy ra khi xóa báo cáo!");
		},
	});

	const handleViewDetails = (report: AdminReport) => {
		setSelectedReport(report);
		setUpdateStatus(report.status);
		setAdminNotes(report.adminNotes || "");
		setShowDetailsDialog(true);
	};

	const handleUpdateStatus = () => {
		if (!selectedReport || !updateStatus) return;
		updateStatusMutation.mutate({
			reportId: selectedReport.id,
			status: updateStatus as ReportStatus,
			notes: adminNotes,
		});
	};

	const columns: ColumnDef<AdminReport>[] = [
		{
			accessorKey: "postTitle",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-transparent"
				>
					Bài viết
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const report = row.original;
				return (
					<div className="max-w-[300px]">
						<div className="font-semibold text-sm truncate">
							{report.postTitle}
						</div>
						<div className="text-xs text-muted-foreground">
							Tác giả: {report.postAuthor}
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "reporterUsername",
			header: "Người báo cáo",
			cell: ({ row }) => {
				const report = row.original;
				return (
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							<AvatarFallback>
								{report.reporterUsername.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="text-sm font-medium">
								{report.reporterUsername}
							</div>
							<div className="text-xs text-muted-foreground">
								{report.reporterEmail}
							</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "category",
			header: "Danh mục",
			cell: ({ row }) => (
				<Badge variant="outline" className="text-xs">
					{getCategoryLabel(row.original.category)}
				</Badge>
			),
		},
		{
			accessorKey: "status",
			header: "Trạng thái",
			cell: ({ row }) => <ReportStatusBadge status={row.original.status} />,
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-transparent"
				>
					Ngày báo cáo
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div className="text-xs">
					{format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm")}
				</div>
			),
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => {
				const report = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<span className="sr-only">Mở menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel className="text-xs font-semibold">
								Thao tác
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-xs"
								onClick={() => handleViewDetails(report)}
							>
								<Eye className="h-3 w-3 mr-2" />
								Xem chi tiết
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-xs"
								onClick={() =>
									window.open(`/posts/${report.postSlug}`, "_blank")
								}
							>
								<FileText className="h-3 w-3 mr-2" />
								Xem bài viết
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-xs text-destructive focus:text-destructive"
								onClick={() => {
									if (confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
										deleteReportMutation.mutate(report.id);
									}
								}}
							>
								<Trash2 className="h-3 w-3 mr-2" />
								Xóa
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const tableFilterControls = (
		<>
			<Select value={statusFilter} onValueChange={setStatusFilter}>
				<SelectTrigger className="w-48">
					<SelectValue placeholder="Lọc trạng thái" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Tất cả trạng thái</SelectItem>
					<SelectItem value="PENDING">Chờ xử lý</SelectItem>
					<SelectItem value="UNDER_REVIEW">Đang xem xét</SelectItem>
					<SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
					<SelectItem value="DISMISSED">Đã bỏ qua</SelectItem>
				</SelectContent>
			</Select>

			<Select value={categoryFilter} onValueChange={setCategoryFilter}>
				<SelectTrigger className="w-48">
					<SelectValue placeholder="Lọc danh mục" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Tất cả danh mục</SelectItem>
					<SelectItem value="SPAM_MISLEADING">Spam/Lừa đảo</SelectItem>
					<SelectItem value="INAPPROPRIATE_LANGUAGE">
						Ngôn ngữ không phù hợp
					</SelectItem>
					<SelectItem value="COPYRIGHT_INFRINGEMENT">
						Vi phạm bản quyền
					</SelectItem>
					<SelectItem value="MISINFORMATION">Thông tin sai lệch</SelectItem>
					<SelectItem value="VIOLENCE_HARMFUL">Bạo lực/Có hại</SelectItem>
					<SelectItem value="OTHER">Khác</SelectItem>
				</SelectContent>
			</Select>

			<Select
				value={size.toString()}
				onValueChange={(value) => setSize(Number(value))}
			>
				<SelectTrigger className="w-36">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="10">10 mục</SelectItem>
					<SelectItem value="20">20 mục</SelectItem>
					<SelectItem value="50">50 mục</SelectItem>
					<SelectItem value="100">100 mục</SelectItem>
				</SelectContent>
			</Select>
		</>
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Header Section */}
			<div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
				<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold text-foreground">
								Quản lý báo cáo
							</h1>
							<p className="text-sm text-muted-foreground mt-1">
								Xem xét và xử lý các báo cáo vi phạm
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="border-b border-border/50">
				<div className="container mx-auto px-4 sm:px-6 py-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-card border border-border/50 rounded-lg p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-medium text-muted-foreground">
										Tổng báo cáo
									</p>
									<p className="text-2xl font-bold text-foreground mt-1">
										{stats?.totalReports || 0}
									</p>
								</div>
								<div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
									<AlertTriangle className="h-5 w-5 text-blue-600" />
								</div>
							</div>
						</div>

						<div className="bg-card border border-border/50 rounded-lg p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-medium text-muted-foreground">
										Chờ xử lý
									</p>
									<p className="text-2xl font-bold text-foreground mt-1">
										{stats?.pendingReports || 0}
									</p>
								</div>
								<div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
									<Clock className="h-5 w-5 text-yellow-600" />
								</div>
							</div>
						</div>

						<div className="bg-card border border-border/50 rounded-lg p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-medium text-muted-foreground">
										Đã giải quyết
									</p>
									<p className="text-2xl font-bold text-foreground mt-1">
										{stats?.resolvedReports || 0}
									</p>
								</div>
								<div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
									<CheckCircle className="h-5 w-5 text-green-600" />
								</div>
							</div>
						</div>

						<div className="bg-card border border-border/50 rounded-lg p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-medium text-muted-foreground">
										Đã bỏ qua
									</p>
									<p className="text-2xl font-bold text-foreground mt-1">
										{stats?.dismissedReports || 0}
									</p>
								</div>
								<div className="h-10 w-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
									<XCircle className="h-5 w-5 text-gray-600" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Table Section */}
			<div className="container mx-auto px-4 sm:px-6 py-6">
				{isLoading ? (
					<div className="rounded-lg p-8">
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-center space-x-4">
									<div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
									<div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
									<div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
									<div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
								</div>
							))}
						</div>
					</div>
				) : (
					<DataTable
						columns={columns}
						data={reportsData?.content || []}
						searchKey="postTitle"
						searchPlaceholder="Tìm kiếm theo tiêu đề bài viết..."
						filterControls={tableFilterControls}
					/>
				)}

				{/* Pagination */}
				{reportsData && !isLoading && (
					<div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="text-sm text-muted-foreground">
							Hiển thị {reportsData.content.length} trong{" "}
							{reportsData.totalElements} báo cáo
						</div>
						<div className="flex items-center gap-2 flex-wrap justify-center">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage(Math.max(0, page - 1))}
								disabled={page === 0}
							>
								Trước
							</Button>
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground">Trang</span>
								<Select
									value={(page + 1).toString()}
									onValueChange={(value) => setPage(Number(value) - 1)}
								>
									<SelectTrigger className="w-16">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Array.from(
											{ length: reportsData.totalPages },
											(_, i) => (
												<SelectItem key={i} value={(i + 1).toString()}>
													{i + 1}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
								<span className="text-xs text-muted-foreground">
									/ {reportsData.totalPages}
								</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setPage(Math.min(reportsData.totalPages - 1, page + 1))
								}
								disabled={page >= reportsData.totalPages - 1}
							>
								Sau
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Details Dialog */}
			<Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Chi tiết báo cáo</DialogTitle>
						<DialogDescription>
							Xem và cập nhật trạng thái báo cáo
						</DialogDescription>
					</DialogHeader>

					{selectedReport && (
						<div className="space-y-6">
							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium">Bài viết</label>
									<p className="text-sm mt-1">{selectedReport.postTitle}</p>
									<p className="text-xs text-muted-foreground">
										Tác giả: {selectedReport.postAuthor}
									</p>
								</div>

								<div>
									<label className="text-sm font-medium">Người báo cáo</label>
									<p className="text-sm mt-1">
										{selectedReport.reporterUsername} (
										{selectedReport.reporterEmail})
									</p>
								</div>

								<div>
									<label className="text-sm font-medium">Danh mục</label>
									<p className="text-sm mt-1">
										{getCategoryLabel(selectedReport.category)}
									</p>
								</div>

								<div>
									<label className="text-sm font-medium">Mô tả</label>
									<p className="text-sm mt-1 bg-muted p-3 rounded-md">
										{selectedReport.description}
									</p>
								</div>

								<div>
									<label className="text-sm font-medium">Ngày báo cáo</label>
									<p className="text-sm mt-1">
										{format(
											new Date(selectedReport.createdAt),
											"dd/MM/yyyy HH:mm",
										)}
									</p>
								</div>

								{selectedReport.reviewedBy && (
									<div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
										<label className="text-sm font-medium">
											Đã xem xét bởi
										</label>
										<p className="text-sm mt-1">
											{selectedReport.reviewedBy}
											{selectedReport.reviewedAt &&
												` - ${format(new Date(selectedReport.reviewedAt), "dd/MM/yyyy HH:mm")}`}
										</p>
									</div>
								)}
							</div>

							<div className="space-y-4 border-t pt-4">
								<div>
									<label className="text-sm font-medium">
										Cập nhật trạng thái
									</label>
									<Select
										value={updateStatus}
										onValueChange={(value) =>
											setUpdateStatus(value as ReportStatus)
										}
									>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Chọn trạng thái" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="PENDING">Chờ xử lý</SelectItem>
											<SelectItem value="UNDER_REVIEW">Đang xem xét</SelectItem>
											<SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
											<SelectItem value="DISMISSED">Đã bỏ qua</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<label className="text-sm font-medium">Ghi chú admin</label>
									<Textarea
										value={adminNotes}
										onChange={(e) => setAdminNotes(e.target.value)}
										placeholder="Thêm ghi chú về quyết định của bạn..."
										rows={3}
										className="mt-2"
									/>
								</div>

								<div className="flex gap-2">
									<Button
										onClick={handleUpdateStatus}
										disabled={!updateStatus || updateStatusMutation.isPending}
									>
										{updateStatusMutation.isPending
											? "Đang cập nhật..."
											: "Cập nhật"}
									</Button>
									<Button
										variant="outline"
										onClick={() =>
											window.open(
												`/posts/${selectedReport.postSlug}`,
												"_blank",
											)
										}
									>
										<FileText className="h-4 w-4 mr-2" />
										Xem bài viết
									</Button>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}