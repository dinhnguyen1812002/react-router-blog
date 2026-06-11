import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
	newsletterApi,
	type ENewsletterStatus,
	type Subscriber,
} from "~/api/newsletter";
import { SubscriberStatusBadge } from "~/components/admin/newsletter/newsletter-badges";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { formatDateSimple } from "~/lib/utils";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: string; label: string }[] = [
	{ value: "all", label: "Tất cả trạng thái" },
	{ value: "ACTIVE", label: "Đang hoạt động" },
	{ value: "PENDING", label: "Chờ xác nhận" },
	{ value: "UNSUBSCRIBED", label: "Đã hủy đăng ký" },
	{ value: "BOUNCED", label: "Bounced" },
	{ value: "SUSPENDED", label: "Tạm khóa" },
];

function getDisplayName(subscriber: Subscriber): string {
	const name = `${subscriber.firstName ?? ""} ${subscriber.lastName ?? ""}`.trim();
	return name || "—";
}

export function SubscribersTab() {
	const [page, setPage] = useState(0);
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: ["newsletter", "subscribers", page, search, statusFilter],
		queryFn: () =>
			newsletterApi.getSubscribers(page, PAGE_SIZE, {
				...(search ? { search } : {}),
				...(statusFilter !== "all"
					? { status: statusFilter as ENewsletterStatus }
					: {}),
			}),
	});

	const columns = useMemo<ColumnDef<Subscriber>[]>(
		() => [
			{
				accessorKey: "email",
				header: "Email",
				cell: ({ row }) => (
					<span className="font-medium">{row.original.email}</span>
				),
			},
			{
				id: "name",
				header: "Tên",
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{getDisplayName(row.original)}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "Trạng thái",
				cell: ({ row }) => (
					<SubscriberStatusBadge status={row.original.status} />
				),
			},
			{
				accessorKey: "createdAt",
				header: "Đăng ký",
				cell: ({ row }) =>
					row.original.createdAt
						? formatDateSimple(row.original.createdAt)
						: "—",
			},
			{
				accessorKey: "confirmedAt",
				header: "Xác nhận",
				cell: ({ row }) =>
					row.original.confirmedAt
						? formatDateSimple(row.original.confirmedAt)
						: "—",
			},
		],
		[],
	);

	const totalPages = data?.totalPages ?? 1;

	const handleSearch = () => {
		setPage(0);
		setSearch(searchInput.trim());
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
				<div className="flex flex-1 gap-2 max-w-md">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							placeholder="Tìm theo email..."
							className="pl-9"
						/>
					</div>
					<Button variant="secondary" size="sm" onClick={handleSearch}>
						Tìm
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Select
						value={statusFilter}
						onValueChange={(v) => {
							setStatusFilter(v);
							setPage(0);
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
					<Loader2 className="h-5 w-5 animate-spin" />
					Đang tải danh sách...
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
					{data?.totalElements !== undefined && (
						<span className="ml-2">
							({data.totalElements.toLocaleString("vi-VN")} người đăng ký)
						</span>
					)}
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
		</div>
	);
}
