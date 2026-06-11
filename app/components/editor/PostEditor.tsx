import { Image } from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef } from "react";
import { handleImageUpload, MAX_FILE_SIZE } from "~/lib/tiptap-utils";
import { cn } from "~/lib/utils";
import { EditorToolbar } from "./EditorToolbar";
import { Underline } from "./underline-extension";
import "./editor-styles.css";

interface PostEditorProps {
	content: string;
	onChange: (html: string) => void;
	className?: string;
}

export function PostEditor({ content, onChange, className }: PostEditorProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3] },
				link: {
					openOnClick: false,
					HTMLAttributes: {
						class: "text-primary underline underline-offset-4",
					},
				},
			}),
			Image.configure({ inline: false, allowBase64: false }),
			Underline,
		],
		content,
		editorProps: {
			attributes: {
				class:
					"prose prose-lg dark:prose-invert max-w-none min-h-[50vh] focus:outline-none px-1 py-4 editor-content-area",
				"aria-label": "Vùng soạn thảo nội dung bài viết",
				"data-placeholder": "Bắt đầu viết nội dung bài viết...",
			},
		},
		onUpdate: ({ editor: ed }) => {
			onChange(ed.getHTML());
		},
	});

	useEffect(() => {
		if (!editor || content === undefined) return;
		const current = editor.getHTML();
		if (content !== current) {
			editor.commands.setContent(content, { emitUpdate: false });
		}
	}, [editor, content]);

	const handleImageUploadClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file || !editor) return;

			if (file.size > MAX_FILE_SIZE) {
				alert("Ảnh quá lớn. Kích thước tối đa 5MB.");
				return;
			}

			try {
				const url = await handleImageUpload(file);
				editor.chain().focus().setImage({ src: url }).run();
			} catch {
				alert("Tải ảnh thất bại. Vui lòng thử lại.");
			}

			e.target.value = "";
		},
		[editor],
	);

	return (
		<div className={cn("flex flex-col", className)}>
			<div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/60 rounded-lg shadow-sm">
				<EditorToolbar editor={editor} onImageClick={handleImageUploadClick} />
			</div>

			<EditorContent editor={editor} className="flex-1" />

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				aria-hidden
				onChange={handleFileChange}
			/>
		</div>
	);
}
