import { useMutation } from "@tanstack/react-query";
import { ChevronDown, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	newsletterApi,
	type CreateCampaignRequest,
} from "~/api/newsletter";
import { Button } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const DEFAULT_FORM = {
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
};

interface CreateCampaignDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function CreateCampaignDialog({
	open,
	onOpenChange,
	onSuccess,
}: CreateCampaignDialogProps) {
	const [form, setForm] = useState(DEFAULT_FORM);
	const [showAdvanced, setShowAdvanced] = useState(false);

	const update = (partial: Partial<typeof form>) =>
		setForm((prev) => ({ ...prev, ...partial }));

	const createMutation = useMutation({
		mutationFn: async () => {
			const payload: CreateCampaignRequest = {
				name: form.name.trim(),
				subject: form.subject.trim(),
				htmlContent: form.htmlContent,
				...(form.textContent.trim() ? { textContent: form.textContent.trim() } : {}),
				...(form.fromName.trim() ? { fromName: form.fromName.trim() } : {}),
				...(form.fromEmail.trim() ? { fromEmail: form.fromEmail.trim() } : {}),
				...(form.replyTo.trim() ? { replyTo: form.replyTo.trim() } : {}),
				...(form.scheduledAt.trim()
					? { scheduledAt: new Date(form.scheduledAt).toISOString() }
					: {}),
				...(form.targetSegment.trim()
					? { targetSegment: form.targetSegment.trim() }
					: {}),
				...(form.targetTags.trim() ? { targetTags: form.targetTags.trim() } : {}),
				batchSize: Number(form.batchSize),
				sendIntervalSeconds: Number(form.sendIntervalSeconds),
				...(form.utmSource.trim() ? { utmSource: form.utmSource.trim() } : {}),
				...(form.utmMedium.trim() ? { utmMedium: form.utmMedium.trim() } : {}),
				...(form.utmCampaign.trim() ? { utmCampaign: form.utmCampaign.trim() } : {}),
			};

			if (!payload.name) throw new Error("Vui lòng nhập tên chiến dịch");
			if (!payload.subject) throw new Error("Vui lòng nhập tiêu đề email");
			if (!payload.htmlContent.trim())
				throw new Error("Vui lòng nhập nội dung HTML");

			return newsletterApi.createCampaign(payload);
		},
		onSuccess: () => {
			toast.success("Tạo chiến dịch thành công");
			setForm(DEFAULT_FORM);
			onOpenChange(false);
			onSuccess();
		},
		onError: (error: Error & { response?: { data?: { message?: string } } }) => {
			toast.error(
				error?.response?.data?.message || error?.message || "Tạo chiến dịch thất bại",
			);
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
				<DialogHeader>
					<DialogTitle>Tạo chiến dịch mới</DialogTitle>
					<DialogDescription>
						Gửi email newsletter đến người đăng ký đã kích hoạt.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="campaign-name">Tên chiến dịch *</Label>
							<Input
								id="campaign-name"
								value={form.name}
								onChange={(e) => update({ name: e.target.value })}
								placeholder="Newsletter tháng 1/2026"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="campaign-subject">Tiêu đề email *</Label>
							<Input
								id="campaign-subject"
								value={form.subject}
								onChange={(e) => update({ subject: e.target.value })}
								placeholder="Cập nhật mới nhất từ blog"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="campaign-html">Nội dung HTML *</Label>
						<Textarea
							id="campaign-html"
							value={form.htmlContent}
							onChange={(e) => update({ htmlContent: e.target.value })}
							placeholder="<html><body><h1>Xin chào {{firstName}}!</h1>...</body></html>"
							className="min-h-[140px] font-mono text-sm"
						/>
						<p className="text-xs text-muted-foreground">
							Biến: <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code>,{" "}
							<code>{"{{unsubscribeUrl}}"}</code>
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="campaign-text">Nội dung văn bản (tùy chọn)</Label>
						<Textarea
							id="campaign-text"
							value={form.textContent}
							onChange={(e) => update({ textContent: e.target.value })}
							placeholder="Phiên bản plain-text cho email client không hỗ trợ HTML"
							className="min-h-[80px] font-mono text-sm"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="campaign-scheduled">Lên lịch gửi (tùy chọn)</Label>
						<Input
							id="campaign-scheduled"
							type="datetime-local"
							value={form.scheduledAt}
							onChange={(e) => update({ scheduledAt: e.target.value })}
						/>
						<p className="text-xs text-muted-foreground">
							Để trống sẽ lưu dưới dạng nháp.
						</p>
					</div>

					<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
						<CollapsibleTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="gap-2 px-0 hover:bg-transparent"
							>
								<ChevronDown
									className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
								/>
								Tùy chọn nâng cao
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="space-y-4 pt-2">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Tên người gửi</Label>
									<Input
										value={form.fromName}
										onChange={(e) => update({ fromName: e.target.value })}
									/>
								</div>
								<div className="space-y-2">
									<Label>Email người gửi</Label>
									<Input
										type="email"
										value={form.fromEmail}
										onChange={(e) => update({ fromEmail: e.target.value })}
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label>Phân khúc</Label>
									<Input
										value={form.targetSegment}
										onChange={(e) => update({ targetSegment: e.target.value })}
									/>
								</div>
								<div className="space-y-2">
									<Label>Thẻ (phân cách bằng dấu phẩy)</Label>
									<Input
										value={form.targetTags}
										onChange={(e) => update({ targetTags: e.target.value })}
										placeholder="vip,regular"
									/>
								</div>
								<div className="space-y-2">
									<Label>Batch size</Label>
									<Input
										type="number"
										value={form.batchSize}
										onChange={(e) =>
											update({ batchSize: Number(e.target.value) })
										}
									/>
								</div>
							</div>
						</CollapsibleContent>
					</Collapsible>
				</div>

				<DialogFooter className="gap-2 sm:gap-2">
					<Button
						type="button"
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={createMutation.isPending}
					>
						Hủy
					</Button>
					<Button
						onClick={() => createMutation.mutate()}
						disabled={createMutation.isPending}
						className="gap-2"
					>
						{createMutation.isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Plus className="h-4 w-4" />
						)}
						Tạo chiến dịch
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
