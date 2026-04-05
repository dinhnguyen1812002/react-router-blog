import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
	AlertTriangle,
	Copy,
	KeyRound,
	Loader2,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ApiKeyCreated } from "~/api/apiKeys";
import { apiKeysApi } from "~/api/apiKeys";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

function maskKey(key: string): string {
	if (key.length <= 12) return "••••••••";
	return `${key.slice(0, 10)}…${key.slice(-4)}`;
}

async function copyText(label: string, text: string) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(`Đã sao chép ${label}`);
	} catch {
		toast.error("Không thể sao chép. Hãy sao chép thủ công.");
	}
}

export default function DashboardApiKeysPage() {
	const queryClient = useQueryClient();
	const [createOpen, setCreateOpen] = useState(false);
	const [newKeyName, setNewKeyName] = useState("");
	const [createdSecret, setCreatedSecret] = useState<ApiKeyCreated | null>(
		null,
	);
	const [revokeTarget, setRevokeTarget] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const { data: keys = [], isLoading, isError, error } = useQuery({
		queryKey: ["user-api-keys"],
		queryFn: apiKeysApi.list,
	});

	const createMutation = useMutation({
		mutationFn: () => apiKeysApi.create(newKeyName.trim() || "API Key"),
		onSuccess: (data) => {
			setCreateOpen(false);
			setNewKeyName("");
			setCreatedSecret(data);
			void queryClient.invalidateQueries({ queryKey: ["user-api-keys"] });
		},
		onError: (err: Error) => {
			toast.error(err.message);
		},
	});

	const revokeMutation = useMutation({
		mutationFn: (id: string) => apiKeysApi.revoke(id),
		onSuccess: () => {
			setRevokeTarget(null);
			void queryClient.invalidateQueries({ queryKey: ["user-api-keys"] });
			toast.success("Đã thu hồi khóa API");
		},
		onError: (err: Error) => {
			toast.error(err.message);
		},
	});

	const confirmRevoke = () => {
		if (!revokeTarget) return;
		revokeMutation.mutate(revokeTarget.id);
	};

	const handleCreateSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newKeyName.trim()) {
			toast.error("Vui lòng nhập tên cho khóa");
			return;
		}
		createMutation.mutate();
	};

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Khóa API
				</h1>
				<p className="mt-1 text-gray-600 dark:text-gray-400">
					Tạo và quản lý khóa để tích hợp blog với portfolio, ứng dụng hoặc
					nền tảng bên ngoài.
				</p>
			</div>

			<Card className="border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30">
				<CardHeader className="pb-2">
					<div className="flex items-start gap-2">
						<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
						<div>
							<h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
								Lưu ý bảo mật
							</h2>
							<p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
								Chỉ các bài viết{" "}
								<strong className="font-medium">đã xuất bản (công khai)</strong>{" "}
								mới có thể truy cập qua API. Bài nháp hoặc đã lên lịch không
								được trả về. API áp dụng giới hạn tần suất giống người dùng
								thông thường. Khóa không hết hạn cho đến khi bạn chủ động thu
								hồi.
							</p>
						</div>
					</div>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 space-y-0">
					<div>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							Khóa đang hoạt động
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Danh sách không hiển thị secret — secret chỉ xuất hiện một lần khi
							tạo khóa mới.
						</p>
					</div>
					<Button onClick={() => setCreateOpen(true)} className="shrink-0">
						<Plus className="mr-2 h-4 w-4" />
						Tạo khóa mới
					</Button>
				</CardHeader>
				<CardContent>
					{isLoading && (
						<div className="flex items-center justify-center py-12 text-muted-foreground">
							<Loader2 className="h-8 w-8 animate-spin" />
						</div>
					)}
					{isError && (
						<div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{(error as Error)?.message ||
								"Không tải được danh sách. Hãy thử lại sau."}
						</div>
					)}
					{!isLoading && !isError && keys.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
							<KeyRound className="mb-3 h-10 w-10 text-muted-foreground" />
							<p className="text-sm font-medium text-foreground">
								Chưa có khóa API nào
							</p>
							<p className="mt-1 max-w-sm text-sm text-muted-foreground">
								Tạo khóa đầu tiên để kết nối blog với các dịch vụ bên ngoài.
							</p>
							<Button
								className="mt-4"
								variant="secondary"
								onClick={() => setCreateOpen(true)}
							>
								<Plus className="mr-2 h-4 w-4" />
								Tạo khóa
							</Button>
						</div>
					)}
					{!isLoading && !isError && keys.length > 0 && (
						<div className="overflow-x-auto rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tên</TableHead>
										<TableHead>API Key</TableHead>
										<TableHead>Ngày tạo</TableHead>
										<TableHead className="w-[100px] text-right">
											Thao tác
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{keys.map((row) => (
										<TableRow key={row.id}>
											<TableCell className="font-medium">{row.name}</TableCell>
											<TableCell>
												<code className="rounded bg-muted px-1.5 py-0.5 text-xs">
													{maskKey(row.apiKey)}
												</code>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{format(new Date(row.createdAt), "PPp", { locale: vi })}
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:bg-destructive/10 hover:text-destructive"
													disabled={revokeMutation.isPending}
													onClick={() =>
														setRevokeTarget({ id: row.id, name: row.name })
													}
													aria-label={`Thu hồi ${row.name}`}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Create */}
			<Dialog open={createOpen} onOpenChange={setCreateOpen}>
				<DialogContent className="sm:max-w-md">
					<form onSubmit={handleCreateSubmit}>
						<DialogHeader>
							<DialogTitle>Tạo khóa API mới</DialogTitle>
							<DialogDescription>
								Đặt tên gợi nhớ (ví dụ: Portfolio cá nhân, App iOS) để phân biệt
								các khóa.
							</DialogDescription>
						</DialogHeader>
						<div className="py-2">
							<label
								htmlFor="api-key-name"
								className="mb-1.5 block text-sm font-medium"
							>
								Tên
							</label>
							<Input
								id="api-key-name"
								value={newKeyName}
								onChange={(e) => setNewKeyName(e.target.value)}
								placeholder="Ví dụ: My Personal Portfolio"
								autoComplete="off"
							/>
						</div>
						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								type="button"
								variant="outline"
								onClick={() => setCreateOpen(false)}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={createMutation.isPending}>
								{createMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Đang tạo…
									</>
								) : (
									"Tạo khóa"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* One-time secret */}
			<Dialog
				open={!!createdSecret}
				onOpenChange={(open) => {
					if (!open) setCreatedSecret(null);
				}}
			>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Lưu thông tin đăng nhập API</DialogTitle>
						<DialogDescription className="text-left text-amber-900 dark:text-amber-100/90">
							<span className="font-semibold text-foreground">
								Secret chỉ hiển thị duy nhất một lần.
							</span>{" "}
							Sao chép và lưu ở nơi an toàn (trình quản lý mật khẩu). Bạn sẽ
							không xem lại được secret sau khi đóng cửa sổ này.
						</DialogDescription>
					</DialogHeader>
					{createdSecret && (
						<div className="space-y-4">
							<div>
								<span className="text-xs font-medium uppercase text-muted-foreground">
									API Key
								</span>
								<div className="mt-1 flex flex-wrap items-center gap-2">
									<code className="break-all rounded-md bg-muted px-2 py-1.5 text-xs">
										{createdSecret.apiKey}
									</code>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() =>
											void copyText("API Key", createdSecret.apiKey)
										}
									>
										<Copy className="mr-1 h-3.5 w-3.5" />
										Sao chép
									</Button>
								</div>
							</div>
							<div>
								<span className="text-xs font-medium uppercase text-muted-foreground">
									API Secret
								</span>
								<div className="mt-1 flex flex-wrap items-center gap-2">
									<code className="break-all rounded-md bg-muted px-2 py-1.5 text-xs">
										{createdSecret.apiSecret}
									</code>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() =>
											void copyText("API Secret", createdSecret.apiSecret)
										}
									>
										<Copy className="mr-1 h-3.5 w-3.5" />
										Sao chép
									</Button>
								</div>
							</div>
							<p className="text-sm text-muted-foreground">
								Tên: <strong>{createdSecret.name}</strong>
							</p>
						</div>
					)}
					<DialogFooter>
						<Button onClick={() => setCreatedSecret(null)}>
							Đã lưu an toàn
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Thu hồi khóa */}
			<Dialog
				open={!!revokeTarget}
				onOpenChange={(open) => {
					if (!open) setRevokeTarget(null);
				}}
			>
				<DialogContent className="sm:max-w-md" showCloseButton={!revokeMutation.isPending}>
					<DialogHeader>
						<DialogTitle>Thu hồi khóa API?</DialogTitle>
						<DialogDescription className="text-left">
							{revokeTarget && (
								<>
									Bạn sắp thu hồi khóa{" "}
									<strong className="text-foreground">
										{revokeTarget.name}
									</strong>
									. Hành động này không thể hoàn tác; mọi ứng dụng hoặc tích
									hợp đang dùng khóa này sẽ ngừng hoạt động.
								</>
							)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							type="button"
							variant="outline"
							disabled={revokeMutation.isPending}
							onClick={() => setRevokeTarget(null)}
						>
							Hủy
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={revokeMutation.isPending}
							onClick={confirmRevoke}
						>
							{revokeMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Đang thu hồi…
								</>
							) : (
								"Thu hồi khóa"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
