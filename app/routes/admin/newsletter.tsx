import { useMutation, useQuery } from "@tanstack/react-query";
import {
	CheckCircle,
	Clock,
	Loader2,
	Mail,
	Plus,
	RefreshCw,
	Send,
	Users,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { newsletterApi } from "~/api/newsletter";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatDateSimple, formatNumber } from "~/lib/utils";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Admin - Newsletter" },
		{ name: "description", content: "Quản lý đăng ký newsletter" },
	];
}

const PAGE_SIZE = 10;

function StatusBadge({
	status,
}: {
	status:
		| "PENDING"
		| "ACTIVE"
		| "UNSUBSCRIBED"
		| "BOUNCED"
		| "COMPLAINED"
		| "SUSPENDED";
}) {
	if (status === "PENDING") {
		return (
			<Badge variant="outline" className="text-amber-600 border-amber-200">
				<Clock className="h-3 w-3 mr-1" />
				Chờ xác nhận
			</Badge>
		);
	}

	if (status === "ACTIVE") {
		return (
			<Badge className="bg-green-100 text-green-700 border-green-200">
				<CheckCircle className="h-3 w-3 mr-1" />
				Đang hoạt động
			</Badge>
		);
	}

	return (
		<Badge variant="destructive">
			<XCircle className="h-3 w-3 mr-1" />
			{status}
		</Badge>
	);
}

function CampaignStatusBadge({ status }: { status: string }) {
	const common = "text-xs";

	if (status === "DRAFT" || status === "PAUSED") {
		return (
			<Badge variant="secondary" className={common}>
				{status}
			</Badge>
		);
	}

	if (status === "SCHEDULED") {
		return (
			<Badge
				variant="outline"
				className={`${common} text-amber-600 border-amber-200`}
			>
				{status}
			</Badge>
		);
	}

	if (status === "SENDING") {
		return (
			<Badge className={`${common} bg-blue-100 text-blue-700 border-blue-200`}>
				{status}
			</Badge>
		);
	}

	if (status === "SENT") {
		return (
			<Badge
				className={`${common} bg-green-100 text-green-700 border-green-200`}
			>
				{status}
			</Badge>
		);
	}

	return (
		<Badge variant="destructive" className={common}>
			{status}
		</Badge>
	);
}

function SubscribersTable({
	title,
	description,
	isLoading,
	isFetching,
	data,
	onPrev,
	onNext,
	onRefresh,
	page,
	totalPages,
}: {
	title: string;
	description: string;
	isLoading: boolean;
	isFetching: boolean;
	data?: Awaited<ReturnType<typeof newsletterApi.getSubscribers>>;
	onPrev: () => void;
	onNext: () => void;
	onRefresh: () => void;
	page: number;
	totalPages: number;
}) {
	return (
		<div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
			<div className="p-4 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						{title}
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{description}
					</p>
				</div>
				<Button variant="ghost" size="sm" onClick={onRefresh}>
					<RefreshCw className="h-4 w-4" />
				</Button>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
					<thead className="bg-gray-50 dark:bg-gray-900/50">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Tên
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Trạng thái
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Đăng ký lúc
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Xác nhận lúc
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-800">
						{isLoading ? (
							<tr>
								<td colSpan={5} className="px-4 py-6 text-center text-gray-500">
									<div className="flex items-center justify-center space-x-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Đang tải...</span>
									</div>
								</td>
							</tr>
						) : data && data.content.length > 0 ? (
							data.content.map((subscriber) => (
								<tr key={subscriber.id}>
									<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
										{subscriber.email}
									</td>
									<td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
										{subscriber.firstName || subscriber.lastName
											? `${subscriber.firstName ?? ""} ${subscriber.lastName ?? ""}`.trim()
											: "—"}
									</td>
									<td className="px-4 py-3 text-sm">
										<StatusBadge status={subscriber.status} />
									</td>
									<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
										{subscriber.createdAt
											? formatDateSimple(subscriber.createdAt)
											: "—"}
									</td>
									<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
										{subscriber.confirmedAt
											? formatDateSimple(subscriber.confirmedAt)
											: "—"}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={5} className="px-4 py-6 text-center text-gray-500">
									Chưa có dữ liệu
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="p-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
				<div>
					Trang {page + 1} / {totalPages || 1}
					{isFetching && (
						<span className="inline-flex items-center ml-2 text-xs text-blue-600 dark:text-blue-400">
							<Loader2 className="h-3 w-3 animate-spin mr-1" />
							Đang cập nhật
						</span>
					)}
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={onPrev}
						disabled={page === 0 || isFetching}
					>
						Trước
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onNext}
						disabled={page + 1 >= totalPages || isFetching}
					>
						Sau
					</Button>
				</div>
			</div>
		</div>
	);
}

export default function AdminNewsletterPage() {
	const [pageAll, setPageAll] = useState(0);
	const [pageActive, setPageActive] = useState(0);
	const [campaignPage, setCampaignPage] = useState(0);

	const {
		data: campaignsData,
		isLoading: campaignsLoading,
		isFetching: campaignsFetching,
		refetch: refetchCampaigns,
	} = useQuery({
		queryKey: ["newsletter", "campaigns", campaignPage],
		queryFn: () => newsletterApi.getCampaigns(campaignPage, PAGE_SIZE),
		// keepPreviousData: true,
	});

	const [createCampaignForm, setCreateCampaignForm] = useState({
		name: "",
		subject: "",
		htmlContent: "",
		textContent: "",
		fromName: "",
		fromEmail: "",
		replyTo: "",
		scheduledAt: "",
		targetSegment: "all",
		targetTags: "",
		batchSize: 100,
		sendIntervalSeconds: 1,
		utmSource: "newsletter",
		utmMedium: "email",
		utmCampaign: "",
	});

	const createCampaignMutation = useMutation({
		mutationFn: async () => {
			const payload = {
				name: createCampaignForm.name.trim(),
				subject: createCampaignForm.subject.trim(),
				htmlContent: createCampaignForm.htmlContent,
				...(createCampaignForm.textContent.trim()
					? { textContent: createCampaignForm.textContent.trim() }
					: {}),
				...(createCampaignForm.fromName.trim()
					? { fromName: createCampaignForm.fromName.trim() }
					: {}),
				...(createCampaignForm.fromEmail.trim()
					? { fromEmail: createCampaignForm.fromEmail.trim() }
					: {}),
				...(createCampaignForm.replyTo.trim()
					? { replyTo: createCampaignForm.replyTo.trim() }
					: {}),
				...(createCampaignForm.scheduledAt.trim()
					? {
							scheduledAt: new Date(
								createCampaignForm.scheduledAt,
							).toISOString(),
						}
					: {}),
				...(createCampaignForm.targetSegment.trim()
					? { targetSegment: createCampaignForm.targetSegment.trim() }
					: {}),
				...(createCampaignForm.targetTags.trim()
					? { targetTags: createCampaignForm.targetTags.trim() }
					: {}),
				batchSize: Number(createCampaignForm.batchSize),
				sendIntervalSeconds: Number(createCampaignForm.sendIntervalSeconds),
				...(createCampaignForm.utmSource.trim()
					? { utmSource: createCampaignForm.utmSource.trim() }
					: {}),
				...(createCampaignForm.utmMedium.trim()
					? { utmMedium: createCampaignForm.utmMedium.trim() }
					: {}),
				...(createCampaignForm.utmCampaign.trim()
					? { utmCampaign: createCampaignForm.utmCampaign.trim() }
					: {}),
			};

			// Basic guardrails for required fields
			if (!payload.name) throw new Error("Vui lòng nhập tên campaign");
			if (!payload.subject) throw new Error("Vui lòng nhập subject campaign");
			if (!payload.htmlContent.trim())
				throw new Error("Vui lòng nhập htmlContent campaign");

			return newsletterApi.createCampaign(payload);
		},
		onSuccess: () => {
			toast.success("Tạo campaign thành công");
			refetchCampaigns();
			setCreateCampaignForm((p) => ({
				...p,
				name: "",
				subject: "",
				htmlContent: "",
				textContent: "",
				scheduledAt: "",
				targetTags: "",
				utmCampaign: "",
			}));
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message ||
					error?.message ||
					"Tạo campaign thất bại",
			);
		},
	});

	const sendCampaignMutation = useMutation({
		mutationFn: async (campaignId: string) => {
			return newsletterApi.sendCampaign(campaignId);
		},
		onSuccess: () => {
			toast.success("Campaign is being sent");
			refetchCampaigns();
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message ||
					error?.message ||
					"Gửi campaign thất bại",
			);
		},
	});

	const {
		data: allSubscribers,
		isLoading: allLoading,
		isFetching: allFetching,
		refetch: refetchAll,
	} = useQuery({
		queryKey: ["newsletter", "subscribers", pageAll],
		queryFn: () => newsletterApi.getSubscribers(pageAll, PAGE_SIZE),
		// keepPreviousData: true,
	});

	const {
		data: activeSubscribers,
		isLoading: activeLoading,
		isFetching: activeFetching,
		refetch: refetchActive,
	} = useQuery({
		queryKey: ["newsletter", "subscribers", "active", pageActive],
		queryFn: () => newsletterApi.getActiveSubscribers(pageActive, PAGE_SIZE),
		// keepPreviousData: true,
	});

	const {
		data: activeCount,
		isLoading: countLoading,
		refetch: refetchCount,
	} = useQuery({
		queryKey: ["newsletter", "subscribers", "count"],
		queryFn: () => newsletterApi.getActiveCount(),
	});

	const totalPagesAll = allSubscribers?.totalPages ?? 1;
	const totalPagesActive = activeSubscribers?.totalPages ?? 1;
	const totalAll = allSubscribers?.totalElements ?? 0;
	const totalActive = activeCount ?? activeSubscribers?.totalElements ?? 0;

	const handleRefresh = () => {
		refetchAll();
		refetchActive();
		refetchCount();
		refetchCampaigns();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Quản lý Newsletter
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Theo dõi và quản lý người đăng ký theo tài liệu API newsletter.
					</p>
				</div>
				<Button variant="outline" onClick={handleRefresh}>
					<RefreshCw className="h-4 w-4 mr-2" />
					Làm mới
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex items-center space-x-3">
					<div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30">
						<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Tổng đăng ký
						</p>
						<p className="text-2xl font-semibold text-gray-900 dark:text-white">
							{allLoading ? "—" : formatNumber(totalAll)}
						</p>
					</div>
				</div>

				<div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex items-center space-x-3">
					<div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30">
						<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
					</div>
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Đang hoạt động
						</p>
						<p className="text-2xl font-semibold text-gray-900 dark:text-white">
							{countLoading ? "—" : formatNumber(totalActive)}
						</p>
					</div>
				</div>

				<div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex items-center space-x-3">
					<div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30">
						<Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
					</div>
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Chờ xác nhận
						</p>
						<p className="text-2xl font-semibold text-gray-900 dark:text-white">
							{allLoading
								? "—"
								: formatNumber(
										(allSubscribers?.content || []).filter(
											(s) => s.status === "PENDING",
										).length,
									)}
						</p>
					</div>
				</div>
			</div>

			<SubscribersTable
				title="Tất cả người đăng ký"
				description="Bao gồm cả chưa xác nhận (theo API /newsletter/subscribers)"
				isLoading={allLoading}
				isFetching={allFetching}
				data={allSubscribers}
				onPrev={() => setPageAll((p) => Math.max(p - 1, 0))}
				onNext={() => setPageAll((p) => Math.min(p + 1, totalPagesAll - 1))}
				onRefresh={() => refetchAll()}
				page={pageAll}
				totalPages={totalPagesAll}
			/>

			<SubscribersTable
				title="Người đăng ký đã kích hoạt"
				description="Chỉ những người đã xác nhận và còn hoạt động (/newsletter/subscribers/active)"
				isLoading={activeLoading}
				isFetching={activeFetching}
				data={activeSubscribers}
				onPrev={() => setPageActive((p) => Math.max(p - 1, 0))}
				onNext={() =>
					setPageActive((p) => Math.min(p + 1, totalPagesActive - 1))
				}
				onRefresh={() => refetchActive()}
				page={pageActive}
				totalPages={totalPagesActive}
			/>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
							Campaigns
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Tạo và gửi newsletter campaign đến subscribers đã kích hoạt.
						</p>
					</div>
					<Button
						variant="outline"
						onClick={() => refetchCampaigns()}
						disabled={campaignsFetching}
					>
						<RefreshCw className="h-4 w-4 mr-2" />
						Làm mới
					</Button>
				</div>

				<div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
						Tạo campaign newsletter
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label className="text-sm text-gray-700 dark:text-gray-200">
								Tên
							</label>
							<input
								value={createCampaignForm.name}
								onChange={(e) =>
									setCreateCampaignForm((p) => ({ ...p, name: e.target.value }))
								}
								className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
								placeholder="Monthly Newsletter January 2024"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700 dark:text-gray-200">
								Subject
							</label>
							<input
								value={createCampaignForm.subject}
								onChange={(e) =>
									setCreateCampaignForm((p) => ({
										...p,
										subject: e.target.value,
									}))
								}
								className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
								placeholder="🎉 Check out our latest updates!"
							/>
						</div>
					</div>

					<div className="mt-3">
						<label className="text-sm text-gray-700 dark:text-gray-200">
							HTML content
						</label>
						<textarea
							value={createCampaignForm.htmlContent}
							onChange={(e) =>
								setCreateCampaignForm((p) => ({
									...p,
									htmlContent: e.target.value,
								}))
							}
							className="mt-1 w-full min-h-[140px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm font-mono"
							placeholder="<html><body><h1>Hello {{firstName}}!</h1><a href='{{unsubscribeUrl}}'>Unsubscribe</a></body></html>"
						/>
					</div>

					<div className="mt-3">
						<label className="text-sm text-gray-700 dark:text-gray-200">
							Text content (optional)
						</label>
						<textarea
							value={createCampaignForm.textContent}
							onChange={(e) =>
								setCreateCampaignForm((p) => ({
									...p,
									textContent: e.target.value,
								}))
							}
							className="mt-1 w-full min-h-[90px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm font-mono"
							placeholder="Hello! Check out our latest updates..."
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
						<div>
							<label className="text-sm text-gray-700 dark:text-gray-200">
								ScheduledAt (optional)
							</label>
							<input
								type="datetime-local"
								value={createCampaignForm.scheduledAt}
								onChange={(e) =>
									setCreateCampaignForm((p) => ({
										...p,
										scheduledAt: e.target.value,
									}))
								}
								className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
							/>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Nếu trống thì campaign sẽ ở trạng thái DRAFT.
							</p>
						</div>

						<div className="space-y-2">
							<div>
								<label className="text-sm text-gray-700 dark:text-gray-200">
									From name (optional)
								</label>
								<input
									value={createCampaignForm.fromName}
									onChange={(e) =>
										setCreateCampaignForm((p) => ({
											...p,
											fromName: e.target.value,
										}))
									}
									className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
								/>
							</div>
							<div>
								<label className="text-sm text-gray-700 dark:text-gray-200">
									From email (optional)
								</label>
								<input
									value={createCampaignForm.fromEmail}
									onChange={(e) =>
										setCreateCampaignForm((p) => ({
											...p,
											fromEmail: e.target.value,
										}))
									}
									className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
						<div>
							<label className="text-sm text-gray-700 dark:text-gray-200">
								Target segment
							</label>
							<input
								value={createCampaignForm.targetSegment}
								onChange={(e) =>
									setCreateCampaignForm((p) => ({
										...p,
										targetSegment: e.target.value,
									}))
								}
								className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
								placeholder="all"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700 dark:text-gray-200">
								Target tags (comma separated)
							</label>
							<input
								value={createCampaignForm.targetTags}
								onChange={(e) =>
									setCreateCampaignForm((p) => ({
										...p,
										targetTags: e.target.value,
									}))
								}
								className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
								placeholder="vip,regular"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-700 dark:text-gray-200">
								Batch size
							</label>
							<input
								type="number"
								value={createCampaignForm.batchSize}
								onChange={(e) =>
									setCreateCampaignForm((p) => ({
										...p,
										batchSize: Number(e.target.value),
									}))
								}
								className="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm"
							/>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 mt-4">
						<Button
							variant="secondary"
							onClick={() =>
								setCreateCampaignForm((p) => ({
									...p,
									name: "",
									subject: "",
									htmlContent: "",
									textContent: "",
									scheduledAt: "",
									targetTags: "",
									utmCampaign: "",
								}))
							}
							disabled={createCampaignMutation.isPending}
						>
							Clear
						</Button>
						<Button
							onClick={() => createCampaignMutation.mutate()}
							disabled={createCampaignMutation.isPending}
						>
							<Plus className="h-4 w-4 mr-2" />
							{createCampaignMutation.isPending
								? "Creating..."
								: "Create campaign"}
						</Button>
					</div>

					<p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
						Variables: <code>{"{{firstName}}"}</code>,{" "}
						<code>{"{{email}}"}</code>, <code>{"{{unsubscribeUrl}}"}</code>
					</p>
				</div>

				<div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-4">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Campaign list
						</h3>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							{campaignsLoading
								? "—"
								: formatNumber(campaignsData?.totalElements ?? 0)}{" "}
							campaigns
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
							<thead className="bg-gray-50 dark:bg-gray-900/50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Scheduled
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Created
									</th>
									<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-800">
								{campaignsLoading ? (
									<tr>
										<td
											colSpan={5}
											className="px-4 py-6 text-center text-gray-500"
										>
											<div className="flex items-center justify-center space-x-2">
												<Loader2 className="h-4 w-4 animate-spin" />
												<span>Đang tải...</span>
											</div>
										</td>
									</tr>
								) : campaignsData?.content?.length ? (
									campaignsData.content.map((c) => {
										const canSend =
											c.status === "DRAFT" || c.status === "SCHEDULED";
										return (
											<tr key={c.id}>
												<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
													<div className="font-medium">{c.name}</div>
													<div className="text-xs text-gray-500 dark:text-gray-400">
														{c.subject}
													</div>
												</td>
												<td className="px-4 py-3 text-sm">
													<CampaignStatusBadge status={c.status} />
												</td>
												<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
													{c.scheduledAt
														? formatDateSimple(c.scheduledAt)
														: "—"}
												</td>
												<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
													{c.createdAt ? formatDateSimple(c.createdAt) : "—"}
												</td>
												<td className="px-4 py-3 text-right">
													<Button
														variant="outline"
														size="sm"
														disabled={
															!canSend || sendCampaignMutation.isPending
														}
														onClick={() => sendCampaignMutation.mutate(c.id)}
													>
														<Send className="h-4 w-4 mr-2" />
														Send
													</Button>
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td
											colSpan={5}
											className="px-4 py-6 text-center text-gray-500"
										>
											Chưa có campaign
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div className="p-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
						<div>
							Trang {campaignPage + 1} / {campaignsData?.totalPages ?? 1}
							{campaignsFetching && (
								<span className="inline-flex items-center ml-2 text-xs text-blue-600 dark:text-blue-400">
									<Loader2 className="h-3 w-3 animate-spin mr-1" />
									Đang cập nhật
								</span>
							)}
						</div>
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCampaignPage((p) => Math.max(p - 1, 0))}
								disabled={campaignPage === 0 || campaignsFetching}
							>
								Trước
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCampaignPage((p) =>
										Math.min(p + 1, (campaignsData?.totalPages ?? 1) - 1),
									)
								}
								disabled={
									campaignsFetching ||
									(campaignsData?.totalPages
										? campaignPage + 1 >= campaignsData.totalPages
										: true)
								}
							>
								Sau
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
