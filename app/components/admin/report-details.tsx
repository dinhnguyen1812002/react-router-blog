import { formatDistanceToNow } from "date-fns";
import { ExternalLink, MessageSquare, User, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { reportApi } from "~/api/report";
import { getCategoryLabel, updateReportStatusSchema } from "~/schemas/report";
import { ReportStatusBadge } from "~/components/article/report-status-badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Textarea } from "~/components/ui/textarea";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UpdateReportStatusValues } from "~/schemas/report";
import type { AdminReport } from "~/api/report";

interface ReportDetailsProps {
	reportId: string;
	onBack?: () => void;
}

export function ReportDetails({ reportId, onBack }: ReportDetailsProps) {
	const { data: report, isLoading, error } = useQuery({
		queryKey: ["admin-report", reportId],
		queryFn: () => reportApi.getAdminReportById(reportId),
		enabled: !!reportId,
	});

	const updateStatusMutation = useMutation({
		mutationFn: (data: UpdateReportStatusValues) =>
			reportApi.updateReportStatus(reportId, data as any),
		onSuccess: () => {
			toast.success("Report status updated successfully");
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || "Failed to update report status";
			toast.error(message);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => reportApi.deleteReport(reportId),
		onSuccess: () => {
			toast.success("Report deleted successfully");
			onBack?.();
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || "Failed to delete report";
			toast.error(message);
		},
	});

	const form = useForm<UpdateReportStatusValues>({
		resolver: zodResolver(updateReportStatusSchema),
		defaultValues: {
			status: "UNDER_REVIEW",
			adminNotes: "",
		},
	});

	const handleStatusUpdate = (data: UpdateReportStatusValues) => {
		updateStatusMutation.mutate(data);
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
			deleteMutation.mutate();
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="space-y-4">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-20 w-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error || !report) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground">Failed to load report details</p>
					{onBack && (
						<Button variant="outline" onClick={onBack} className="mt-4">
							Go Back
						</Button>
					)}
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="text-xl">{report.postTitle}</CardTitle>
							<div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
								<span>by {report.postAuthor}</span>
								<span>·</span>
								<span>reported by {report.reporterUsername}</span>
								<span>·</span>
								<span>{report.reporterEmail}</span>
							</div>
						</div>
						<ReportStatusBadge status={report.status} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center gap-4 text-sm">
							<span className="font-medium">Category:</span>
							<span>{getCategoryLabel(report.category)}</span>
						</div>
						<div className="flex items-center gap-4 text-sm">
							<span className="font-medium">Created:</span>
							<span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
						</div>
						{report.updatedAt !== report.createdAt && (
							<div className="flex items-center gap-4 text-sm">
								<span className="font-medium">Updated:</span>
								<span>{formatDistanceToNow(new Date(report.updatedAt), { addSuffix: true })}</span>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Report Description */}
			<Card>
				<CardHeader>
					<CardTitle>Report Description</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm">{report.description}</p>
				</CardContent>
			</Card>

			{/* Admin Notes (if any) */}
			{report.adminNotes && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="size-4" />
							Admin Notes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm">{report.adminNotes}</p>
							{report.reviewedBy && (
								<p className="text-xs text-muted-foreground">
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
					</CardContent>
				</Card>
			)}

			{/* Update Status */}
			<Card>
				<CardHeader>
					<CardTitle>Update Status</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit(handleStatusUpdate)} className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">New Status</label>
							<select
								{...form.register("status")}
								className="w-full p-2 border rounded-md"
								disabled={updateStatusMutation.isPending}
							>
								<option value="">Select status</option>
								<option value="UNDER_REVIEW">Under Review</option>
								<option value="RESOLVED">Resolved</option>
								<option value="DISMISSED">Dismissed</option>
							</select>
							{form.formState.errors.status && (
								<p className="text-sm text-destructive">
									{form.formState.errors.status.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Admin Notes</label>
							<Textarea
								{...form.register("adminNotes")}
								placeholder="Add notes about your decision..."
								rows={3}
								disabled={updateStatusMutation.isPending}
							/>
							{form.formState.errors.adminNotes && (
								<p className="text-sm text-destructive">
									{form.formState.errors.adminNotes.message}
								</p>
							)}
						</div>

						<div className="flex gap-2">
							<Button
								type="submit"
								disabled={updateStatusMutation.isPending}
							>
								{updateStatusMutation.isPending ? "Updating..." : "Update Status"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							onClick={() => {
								window.open(`/posts/${report.postSlug}`, "_blank");
							}}
						>
							<ExternalLink className="size-4 mr-2" />
							View Post
						</Button>
						
						<Button
							variant="outline"
							onClick={() => {
								window.open(`/users/${report.reporterUsername}`, "_blank");
							}}
						>
							<User className="size-4 mr-2" />
							View Reporter
						</Button>

						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteMutation.isPending}
						>
							<Trash2 className="size-4 mr-2" />
							{deleteMutation.isPending ? "Deleting..." : "Delete Report"}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Back Button */}
			{onBack && (
				<div className="pt-4">
					<Button variant="outline" onClick={onBack}>
						Back to Reports
					</Button>
				</div>
			)}
		</div>
	);
}
