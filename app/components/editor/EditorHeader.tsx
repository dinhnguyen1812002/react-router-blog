import { ArrowLeft, Send, Settings2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface EditorHeaderProps {
	isEditMode: boolean;
	onPublishClick: () => void;
	onSettingsClick?: () => void;
	disabled?: boolean;
	className?: string;
}

export function EditorHeader({
	isEditMode,
	onPublishClick,
	onSettingsClick,
	disabled,
	className,
}: EditorHeaderProps) {
	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 h-14 border-b border-border/60 bg-background/95 backdrop-blur-md shadow-sm",
				className,
			)}
		>
			<div className="h-full max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6">
				<div className="flex items-center gap-3">
					<Link
						to="/dashboard/my-posts"
						className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
						aria-label="Quay lại danh sách bài viết"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">Quay lại</span>
					</Link>
					<div className="hidden sm:block w-px h-5 bg-border" aria-hidden />
					<span className="text-sm font-medium text-foreground">
						{isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới"}
					</span>
				</div>

				<div className="flex items-center gap-2">
					{onSettingsClick && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={onSettingsClick}
							className="md:hidden h-9 w-9"
							aria-label="Mở cài đặt bài viết"
						>
							<Settings2 className="h-4 w-4" />
						</Button>
					)}
					<Button
						onClick={onPublishClick}
						disabled={disabled}
						className="gap-2 rounded-full px-5 shadow-sm transition-all hover:shadow-md"
						aria-label={isEditMode ? "Cập nhật bài viết" : "Xuất bản bài viết"}
					>
						<Send className="h-4 w-4" />
						<span className="hidden xs:inline">
							{isEditMode ? "Cập nhật" : "Xuất bản"}
						</span>
					</Button>
				</div>
			</div>
		</header>
	);
}
