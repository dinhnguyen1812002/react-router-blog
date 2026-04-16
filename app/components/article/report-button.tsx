import { FlagIcon } from "lucide-react";
import { useState } from "react";
import { ReportDialog } from "./report-dialog";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/store/authStore";

interface ReportButtonProps {
	postId: string;
	postTitle: string;
	variant?: "default" | "outline" | "ghost" | "secondary";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}

export function ReportButton({
	postId,
	postTitle,
	variant = "ghost",
	size = "sm",
	className,
}: ReportButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { user } = useAuthStore();

	const handleReportClick = () => {
		if (!user) {
			// You could redirect to login or show a login dialog here
			// For now, we'll just open the dialog and let it handle the auth check
			setIsDialogOpen(true);
		} else {
			setIsDialogOpen(true);
		}
	};

	return (
		<>
			<Button
				variant={variant}
				size={size}
				onClick={handleReportClick}
				className={className}
				data-icon="inline-start"
			>
				<FlagIcon className="size-4" />
				Report
			</Button>

			<ReportDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				postId={postId}
				postTitle={postTitle}
			/>
		</>
	);
}
