import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Plus, RefreshCw, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { newsletterApi, type Campaign } from "~/api/newsletter";
import { CampaignStatusBadge } from "~/components/admin/newsletter/newsletter-badges";
import { CreateCampaignDialog } from "~/components/admin/newsletter/create-campaign-dialog";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { formatDateSimple, formatNumber } from "~/lib/utils";

const PAGE_SIZE = 10;

export function CampaignsTab() {
	const [page, setPage] = useState(0);
	const [createOpen, setCreateOpen] = useState(false);

	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: ["newsletter", "campaigns", page],
		queryFn: () => newsletterApi.getCampaigns(page, PAGE_SIZE),
	});

	const sendMutation = useMutation({
		mutationFn: (campaignId: string) => newsletterApi.sendCampaign(campaignId),
		onSuccess: () => {
			toast.success("Chiến dịch đang được gửi");
			refetch();
		},
		onError: (error: Error & { response?: { data?: { message?: string } } }) => {
			toast.error(
				error?.response?.data?.message || error?.message || "Gửi chiến dịch thất bại",
			);
		},
	});

	const columns = useMemo<ColumnDef<Campaign>[]>(
		() => [
			{
				accessorKey: "name",
				header: "Chiến dịch",
				cell: ({ row }) => (
					<div>
						<p className="font-medium">{row.original.name}</p>
						<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
							{row.original.subject}
						</p>
					</div>
				),
			},
			{
				accessorKey: "status",
				header: "Trạng thái",
				cell: ({ row }) => (
					<CampaignStatusBadge status={row.original.status} />
				),
			},
			{
				id: "stats",
				header: "Thống kê",
				cell: ({ row }) => {
					const c = row.original;
					if (c.status !== "SENT" && c.status !== "SENDING") return "—";
					return (
						<div className="text-xs text-muted-foreground space-y-0.5">
							{c.sentCount !== undefined && (
								<p>Đã gửi: {formatNumber(c.sentCount)}</p>
							)}
							{c.openedCount !== undefined && (
								<p>Mở: {formatNumber(c.openedCount)}</p>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: "scheduledAt",
				header: "Lên lịch",
				cell: ({ row }) =>
					row.original.scheduledAt
						? formatDateSimple(row.original.scheduledAt)
						: "—",
			},
			{
				accessorKey: "createdAt",
				header: "Tạo lúc",
				cell: ({ row }) =>
					row.original.createdAt
						? formatDateSimple(row.original.createdAt)
						: "—",
			},
			{
				id: "actions",
				header: () => <span className="sr-only">Hành động</span>,
				cell: ({ row }) => {
					const canSend =
						row.original.status === "DRAFT" ||
						row.original.status === "SCHEDULED";
					return (
						<div className="text-right">
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5"
								disabled={!canSend || sendMutation.isPending}
								onClick={() => sendMutation.mutate(row.original.id)}
							>
								<Send className="h-3.5 w-3.5" />
								Gửi
							</Button>
						</div>
					);
				},
			},
		],
		[sendMutation.isPending],
	);

	const totalPages = data?.totalPages ?? 1;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<p className="text-sm text-muted-foreground">
					{data?.totalElements !== undefined
						? `${formatNumber(data.totalElements)} chiến dịch`
						: "Quản lý email newsletter"}
				</p>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => refetch()}
						disabled={isFetching}
						aria-label="Làm mới"
					>
						<RefreshCw
							className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
						/>
					</Button>
					<Button className="gap-2" onClick={() => setCreateOpen(true)}>
						<Plus className="h-4 w-4" />
						Tạo chiến dịch
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
					<Loader2 className="h-5 w-5 animate-spin" />
					Đang tải chiến dịch...
				</div>
			) : (
				<DataTable
					columns={columns}
					data={data?.content ?? []}
					showPagination={false}
				/>
			)}

			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>
					Trang {page + 1} / {totalPages}
					{isFetching && !isLoading && (
						<span className="inline-flex items-center ml-2 text-primary">
							<Loader2 className="h-3 w-3 animate-spin mr-1" />
							Đang cập nhật
						</span>
					)}
				</span>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => Math.max(p - 1, 0))}
						disabled={page === 0 || isFetching}
					>
						Trước
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
						disabled={page + 1 >= totalPages || isFetching}
					>
						Sau
					</Button>
				</div>
			</div>

			<CreateCampaignDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSuccess={() => refetch()}
			/>
		</div>
	);
}
