import { cn } from "~/lib/utils";

/** Shared divider between form blocks (login / register). */
export function AuthDivider({
	label,
	className,
}: {
	label: string;
	/** e.g. match a parent card background */
	className?: string;
}) {
	return (
		<div className={cn("relative my-6 sm:my-7", className)}>
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t border-slate-200 dark:border-slate-700" />
			</div>
			<div className="relative flex justify-center text-xs sm:text-sm">
				<span className="rounded-full bg-white/90 px-3 text-slate-500 backdrop-blur-sm dark:bg-slate-950/80 dark:text-slate-400">
					{label}
				</span>
			</div>
		</div>
	);
}
