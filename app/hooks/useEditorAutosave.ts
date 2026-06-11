import { useCallback, useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

interface AutosaveData {
	title: string;
	content: string;
	excerpt: string;
	thumbnail: string;
	categories: number[];
	tags: string[];
	featured: boolean;
}

interface UseEditorAutosaveOptions {
	key: string;
	data: AutosaveData;
	enabled?: boolean;
	debounceMs?: number;
}

function formatSavedTime(date: Date): string {
	return date.toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function useEditorAutosave({
	key,
	data,
	enabled = true,
	debounceMs = 2000,
}: UseEditorAutosaveOptions) {
	const [status, setStatus] = useState<AutosaveStatus>("idle");
	const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const dataRef = useRef(data);

	dataRef.current = data;

	const saveToStorage = useCallback(() => {
		if (!enabled) return;

		setStatus("saving");
		try {
			localStorage.setItem(
				`editor-draft:${key}`,
				JSON.stringify({
					...dataRef.current,
					savedAt: new Date().toISOString(),
				}),
			);
			const now = new Date();
			setLastSavedAt(now);
			setStatus("saved");
		} catch {
			setStatus("error");
		}
	}, [enabled, key]);

	useEffect(() => {
		if (!enabled) return;

		const hasContent =
			data.title.trim() || data.content.replace(/<[^>]*>/g, "").trim();
		if (!hasContent) return;

		if (timerRef.current) clearTimeout(timerRef.current);
		setStatus("saving");

		timerRef.current = setTimeout(() => {
			saveToStorage();
		}, debounceMs);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [
		data.title,
		data.content,
		data.excerpt,
		data.thumbnail,
		data.categories,
		data.tags,
		data.featured,
		enabled,
		debounceMs,
		saveToStorage,
	]);

	const loadDraft = useCallback((): AutosaveData | null => {
		try {
			const raw = localStorage.getItem(`editor-draft:${key}`);
			if (!raw) return null;
			const parsed = JSON.parse(raw);
			return {
				title: parsed.title ?? "",
				content: parsed.content ?? "",
				excerpt: parsed.excerpt ?? "",
				thumbnail: parsed.thumbnail ?? "",
				categories: parsed.categories ?? [],
				tags: parsed.tags ?? [],
				featured: parsed.featured ?? false,
			};
		} catch {
			return null;
		}
	}, [key]);

	const clearDraft = useCallback(() => {
		try {
			localStorage.removeItem(`editor-draft:${key}`);
		} catch {
			// ignore
		}
		setStatus("idle");
		setLastSavedAt(null);
	}, [key]);

	const statusLabel =
		status === "saving"
			? "Đang lưu..."
			: status === "saved" && lastSavedAt
				? `Đã lưu lúc ${formatSavedTime(lastSavedAt)}`
				: status === "error"
					? "Lưu tự động thất bại"
					: "";

	return { status, statusLabel, lastSavedAt, loadDraft, clearDraft };
}
