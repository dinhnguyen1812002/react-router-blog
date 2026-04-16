import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, FlagIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { reportApi } from "~/api/report";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import {
	type ReportFormValues,
	reportCategories,
	reportFormSchema,
} from "~/schemas/report";
import { useAuthStore } from "~/store/authStore";
import { useMutation } from "@tanstack/react-query";

interface ReportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	postId: string;
	postTitle: string;
}

export function ReportDialog({
	open,
	onOpenChange,
	postId,
	postTitle,
}: ReportDialogProps) {
	const { user } = useAuthStore();

	const form = useForm<ReportFormValues>({
		resolver: zodResolver(reportFormSchema),
		defaultValues: {
			category: undefined,
			description: "",
		},
	});

	const selectedCategory = form.watch("category");

	// Reset form when dialog opens/closes
	useEffect(() => {
		if (!open) {
			form.reset();
		}
	}, [open, form]);

	const submitReportMutation = useMutation({
		mutationFn: (data: ReportFormValues) =>
			reportApi.submitReport(postId, data),
		onSuccess: () => {
			toast.success("Report submitted successfully. Thank you for your feedback.");
			onOpenChange(false);
			form.reset();
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || "Failed to submit report";
			
			if (error?.response?.status === 409) {
				toast.error("You have already reported this post.");
			} else if (error?.response?.status === 429) {
				toast.error("Too many reports submitted. Please wait before submitting more reports.");
			} else {
				toast.error(message);
			}
		},
	});

	const onSubmit = (data: ReportFormValues) => {
		if (!user) {
			toast.error("You must be logged in to submit a report.");
			return;
		}

		submitReportMutation.mutate(data);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<FlagIcon className="size-4" />
						Report Article
					</DialogTitle>
					<DialogDescription>
						Report "{postTitle}" for inappropriate content. Your report will be reviewed by our moderation team.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="category"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Reason for Report *
						</label>
						<Select
							value={selectedCategory}
							onValueChange={(value) => form.setValue("category", value as any)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a reason" />
							</SelectTrigger>
							<SelectContent>
								{reportCategories.map((category) => (
									<SelectItem key={category.value} value={category.value}>
										{category.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{form.formState.errors.category && (
							<p className="text-sm text-destructive">
								{form.formState.errors.category.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="description"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Description
							{selectedCategory === "OTHER" && " *"}
						</label>
						<Textarea
							id="description"
							placeholder={
								selectedCategory === "OTHER"
									? "Please provide detailed information about the issue..."
									: "Additional details (optional)"
							}
							{...form.register("description")}
							rows={4}
						/>
						{form.formState.errors.description && (
							<p className="text-sm text-destructive">
								{form.formState.errors.description.message}
							</p>
						)}
					</div>

					{selectedCategory === "OTHER" && (
						<div className="flex items-start gap-2 p-3 bg-muted rounded-md">
							<AlertTriangle className="size-4 text-muted-foreground mt-0.5" />
							<p className="text-sm text-muted-foreground">
								Please provide a detailed description when reporting "Other" issues so our moderation team can properly review your report.
							</p>
						</div>
					)}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={submitReportMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={submitReportMutation.isPending || !selectedCategory}
						>
							{submitReportMutation.isPending ? "Submitting..." : "Submit Report"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
