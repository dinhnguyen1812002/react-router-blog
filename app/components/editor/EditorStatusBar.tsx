import { Clock, FileText } from "lucide-react";
import { calculateReadingTime } from "~/components/post/ReadingProgressBar";
import { cn } from "~/lib/utils";

interface EditorStatusBarProps {
	title: string;
	content: string;
	autosaveLabel: string;
	isSaving: boolean;
	className?: string;
}

function countWords(text: string): number {
	const plain = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	if (!plain) return 0;
	return plain.split(" ").length;
}

export function EditorStatusBar({
	title,
	content,
	autosaveLabel,
	isSaving,
	className,
}: EditorStatusBarProps) {
	const wordCount = countWords(`${title} ${content}`);
	const readingTime = calculateReadingTime(content || title);

	return (
		<div
			className={cn(
				"fixed bottom-0 left-0 right-0 z-40 h-10 border-t border-border/60 bg-background/95 backdrop-blur-md",
				className,
			)}
			role="status"
			aria-live="polite"
		>
			<div className="h-full max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 text-xs text-muted-foreground">
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-1.5">
						<FileText className="h-3.5 w-3.5" aria-hidden />
						{wordCount.toLocaleString("vi-VN")} từ
					</span>
					<span className="flex items-center gap-1.5">
						<Clock className="h-3.5 w-3.5" aria-hidden />
						{readingTime} phút đọc
					</span>
				</div>

				<span
					className={cn(
						"flex items-center gap-1.5 transition-opacity",
						isSaving && "text-foreground",
					)}
				>
					{isSaving && (
						<span
							className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse"
							aria-hidden
						/>
					)}
					{autosaveLabel}
				</span>
			</div>
		</div>
	);
}
