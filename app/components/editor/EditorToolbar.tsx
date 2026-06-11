import type { Editor } from "@tiptap/react";
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	ImageIcon,
	Italic,
	Link2,
	List,
	ListOrdered,
	Quote,
	Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface EditorToolbarProps {
	editor: Editor | null;
	onImageClick: () => void;
	className?: string;
}

interface ToolbarButtonProps {
	onClick: () => void;
	isActive?: boolean;
	label: string;
	children: React.ReactNode;
}

function ToolbarButton({
	onClick,
	isActive,
	label,
	children,
}: ToolbarButtonProps) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className={cn(
				"h-8 w-8 rounded-md text-muted-foreground hover:text-foreground transition-colors",
				isActive && "bg-muted text-foreground",
			)}
			onClick={onClick}
			aria-label={label}
			aria-pressed={isActive}
		>
			{children}
		</Button>
	);
}

function ToolbarDivider() {
	return <div className="w-px h-5 bg-border mx-1" aria-hidden />;
}

export function EditorToolbar({
	editor,
	onImageClick,
	className,
}: EditorToolbarProps) {
	if (!editor) return null;

	const setLink = () => {
		const previousUrl = editor.getAttributes("link").href as string;
		const url = window.prompt("Nhập URL:", previousUrl);
		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	};

	return (
		<div
			className={cn(
				"flex items-center gap-0.5 flex-wrap px-2 py-1.5",
				className,
			)}
			role="toolbar"
			aria-label="Công cụ định dạng văn bản"
		>
			<ToolbarButton
				label="In đậm"
				isActive={editor.isActive("bold")}
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				<Bold className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				label="In nghiêng"
				isActive={editor.isActive("italic")}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				<Italic className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				label="Gạch chân"
				isActive={editor.isActive("underline")}
				onClick={() => editor.chain().focus().toggleUnderline().run()}
			>
				<UnderlineIcon className="h-4 w-4" />
			</ToolbarButton>

			<ToolbarDivider />

			<ToolbarButton
				label="Tiêu đề 1"
				isActive={editor.isActive("heading", { level: 1 })}
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			>
				<Heading1 className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				label="Tiêu đề 2"
				isActive={editor.isActive("heading", { level: 2 })}
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				<Heading2 className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				label="Tiêu đề 3"
				isActive={editor.isActive("heading", { level: 3 })}
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			>
				<Heading3 className="h-4 w-4" />
			</ToolbarButton>

			<ToolbarDivider />

			<ToolbarButton
				label="Danh sách bullet"
				isActive={editor.isActive("bulletList")}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<List className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				label="Danh sách đánh số"
				isActive={editor.isActive("orderedList")}
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrdered className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				label="Trích dẫn"
				isActive={editor.isActive("blockquote")}
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
			>
				<Quote className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				label="Mã nguồn"
				isActive={editor.isActive("codeBlock")}
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
			>
				<Code className="h-4 w-4" />
			</ToolbarButton>

			<ToolbarDivider />

			<ToolbarButton
				label="Chèn liên kết"
				isActive={editor.isActive("link")}
				onClick={setLink}
			>
				<Link2 className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton label="Chèn ảnh" onClick={onImageClick}>
				<ImageIcon className="h-4 w-4" />
			</ToolbarButton>
		</div>
	);
}
