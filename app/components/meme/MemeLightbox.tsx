/**
 * MemeLightbox Component - Modal để xem meme full size
 * Sử dụng trong trang Memes
 */

import { Eye, Heart, X } from "lucide-react";
import { useEffect } from "react";
import type { Meme } from "~/types";

interface MemeLightboxProps {
	meme: Meme;
	onClose: () => void;
}

export function MemeLightbox({ meme, onClose }: MemeLightboxProps) {
	// Đóng khi nhấn ESC
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		// Prevent body scroll khi lightbox mở
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
			onClick={onClose}
		>
			{/* Close Button */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
				aria-label="Đóng"
			>
				<X className="w-6 h-6" />
			</button>

			{/* Content */}
			<div
				className="max-w-5xl max-h-[90vh] overflow-auto lightbox-content"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Image */}
				<img
					src={meme.memeUrl}
					alt={meme.name}
					className="w-full h-auto rounded-t-lg"
				/>

				{/* Info Section */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-b-lg">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{meme.name}
					</h3>

					{meme.description && (
						<p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
							{meme.description}
						</p>
					)}

					{/* Stats */}
					<div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
						{meme.views && (
							<span className="flex items-center gap-1">
								<Eye className="w-4 h-4" />
								{meme.views} lượt xem
							</span>
						)}
						{meme.likes && (
							<span className="flex items-center gap-1">
								<Heart className="w-4 h-4" />
								{meme.likes} lượt thích
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
