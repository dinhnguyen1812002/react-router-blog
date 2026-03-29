import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import {
	type GlobalSearchItem,
	type GlobalSearchResponse,
	searchApi,
} from "~/api/search";
import { resolveAvatarUrl } from "~/utils/image";

type SearchKind = "post" | "series" | "user";

type FlattenedItem = {
	kind: SearchKind;
	item: GlobalSearchItem;
};

function useDebouncedValue<T>(value: T, delayMs: number) {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = window.setTimeout(() => setDebounced(value), delayMs);
		return () => window.clearTimeout(id);
	}, [value, delayMs]);

	return debounced;
}

function getItemHref(kind: SearchKind, slug: string) {
	if (kind === "post") return `/articles/${slug}`;
	if (kind === "series") return `/series/${slug}`;
	return `/profile/${slug}`;
}

function getSectionLabel(kind: SearchKind) {
	if (kind === "post") return "Posts";
	if (kind === "series") return "Series";
	return "Users";
}

function normalizeResponse(
	data: GlobalSearchResponse | undefined,
): GlobalSearchResponse {
	return {
		posts: data?.posts ?? [],
		series: data?.series ?? [],
		users: data?.users ?? [],
	};
}

export function GlobalSearch({
	placeholder = "Search…",
	className,
	inputClassName,
}: {
	placeholder?: string;
	className?: string;
	inputClassName?: string;
}) {
	const navigate = useNavigate();
	const rootRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebouncedValue(query.trim(), 350);
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number>(-1);

	const enabled = debouncedQuery.length > 0;

	const { data, isFetching, isError } = useQuery({
		queryKey: ["global-search", debouncedQuery],
		enabled,
		queryFn: ({ signal }) => searchApi.globalSearch(debouncedQuery, signal),
		staleTime: 15_000,
	});

	const normalized = normalizeResponse(data);

	const flattened: FlattenedItem[] = useMemo(() => {
		const items: FlattenedItem[] = [];
		for (const item of normalized.posts) items.push({ kind: "post", item });
		for (const item of normalized.series) items.push({ kind: "series", item });
		for (const item of normalized.users) items.push({ kind: "user", item });
		return items;
	}, [normalized.posts, normalized.series, normalized.users]);

	const hasAnyResults = flattened.length > 0;
	const showEmpty = enabled && !isFetching && !isError && !hasAnyResults;

	// Open dropdown when user is typing (and has query)
	useEffect(() => {
		if (query.trim().length > 0) setIsOpen(true);
		if (query.trim().length === 0) {
			setIsOpen(false);
			setActiveIndex(-1);
		}
	}, [query]);

	// Close on click outside
	useEffect(() => {
		const onPointerDown = (e: MouseEvent | TouchEvent) => {
			const el = rootRef.current;
			if (!el) return;
			if (e.target && el.contains(e.target as Node)) return;
			setIsOpen(false);
			setActiveIndex(-1);
		};
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("touchstart", onPointerDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("touchstart", onPointerDown);
		};
	}, []);

	const moveActive = (delta: number) => {
		if (!isOpen) setIsOpen(true);
		if (flattened.length === 0) return;
		setActiveIndex((prev) => {
			const next =
				prev < 0 ? (delta > 0 ? 0 : flattened.length - 1) : prev + delta;
			if (next < 0) return flattened.length - 1;
			if (next >= flattened.length) return 0;
			return next;
		});
	};

	const selectActive = () => {
		const picked = activeIndex >= 0 ? flattened[activeIndex] : null;
		if (!picked) return;
		navigate(getItemHref(picked.kind, picked.item.slug));
		setIsOpen(false);
		setActiveIndex(-1);
		inputRef.current?.blur();
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			moveActive(1);
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			moveActive(-1);
			return;
		}
		if (e.key === "Enter") {
			if (isOpen && activeIndex >= 0) {
				e.preventDefault();
				selectActive();
			}
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault();
			setIsOpen(false);
			setActiveIndex(-1);
			inputRef.current?.blur();
		}
	};

	const renderSection = (kind: SearchKind, items: GlobalSearchItem[]) => {
		if (items.length === 0) return null;
		return (
			<div className="py-2">
				<div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
					{getSectionLabel(kind)}
				</div>
				<div className="space-y-1">
					{items.map((it) => {
						const href = getItemHref(kind, it.slug);
						const flatIndex = flattened.findIndex(
							(f) => f.kind === kind && f.item.slug === it.slug,
						);
						const isActive = flatIndex === activeIndex;
						return (
							<button
								key={`${kind}:${it.slug}`}
								type="button"
								className={[
									"w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
									isActive ? "bg-muted" : "hover:bg-muted/60",
								].join(" ")}
								onMouseEnter={() => setActiveIndex(flatIndex)}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => {
									navigate(href);
									setIsOpen(false);
									setActiveIndex(-1);
								}}
							>
								<div className="h-9 w-9 rounded-md overflow-hidden bg-muted shrink-0">
									{it.thumbnail ? (
										<img
											src={resolveAvatarUrl(it.thumbnail)}
											alt={it.title}
											className="h-full w-full object-cover"
											loading="lazy"
										/>
									) : null}
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-sm font-medium text-foreground truncate">
										{it.title}
									</div>
									<div className="text-xs text-muted-foreground truncate">
										{it.authorName}
									</div>
								</div>
								<div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
									<span>{it.view} views</span>
									<span>{it.like} likes</span>
								</div>
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div
			ref={rootRef}
			className={["relative", className].filter(Boolean).join(" ")}
		>
			<div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
				<Search className="w-4 h-4 text-muted-foreground" />
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => {
						if (query.trim().length > 0) setIsOpen(true);
					}}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					aria-label="Global search"
					aria-autocomplete="list"
					aria-expanded={isOpen}
					className={[
						"bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full",
						inputClassName,
					]
						.filter(Boolean)
						.join(" ")}
				/>
				{isFetching ? (
					<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
				) : null}
			</div>

			{isOpen ? (
				<div
					role="listbox"
					className="absolute left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-lg overflow-hidden"
				>
					{!enabled ? null : (
						<div className="max-h-[70vh] overflow-auto">
							{isError ? (
								<div className="px-3 py-3 text-sm text-muted-foreground">
									Không thể tìm kiếm lúc này. Vui lòng thử lại.
								</div>
							) : null}

							{isFetching && !hasAnyResults ? (
								<div className="px-3 py-3 text-sm text-muted-foreground">
									Đang tìm kiếm…
								</div>
							) : null}

							{showEmpty ? (
								<div className="px-3 py-3 text-sm text-muted-foreground">
									Không có kết quả.
								</div>
							) : null}

							{renderSection("post", normalized.posts)}
							{renderSection("series", normalized.series)}
							{renderSection("user", normalized.users)}
						</div>
					)}
				</div>
			) : null}
		</div>
	);
}
