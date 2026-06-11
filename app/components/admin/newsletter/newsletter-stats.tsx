import { CheckCircle, Clock, Megaphone, Users } from "lucide-react";
import {
	Card,
	CardContent,
} from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/skeleton";
import { formatNumber } from "~/lib/utils";
import { cn } from "~/lib/utils";

interface StatItem {
	label: string;
	value: number | null;
	icon: React.ComponentType<{ className?: string }>;
	iconBg: string;
	iconColor: string;
	loading?: boolean;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, loading }: StatItem) {
	return (
		<Card className="py-4 gap-0 border-border/60 shadow-sm">
			<CardContent className="flex items-center justify-between px-4 py-0">
				<div>
					<p className="text-xs font-medium text-muted-foreground">{label}</p>
					{loading ? (
						<Skeleton className="h-8 w-16 mt-2" />
					) : (
						<p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
							{value !== null ? formatNumber(value) : "—"}
						</p>
					)}
				</div>
				<div
					className={cn(
						"h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
						iconBg,
					)}
				>
					<Icon className={cn("h-5 w-5", iconColor)} />
				</div>
			</CardContent>
		</Card>
	);
}

interface NewsletterStatsProps {
	totalSubscribers: number | null;
	activeSubscribers: number | null;
	pendingSubscribers: number | null;
	totalCampaigns: number | null;
	loading?: boolean;
}

export function NewsletterStats({
	totalSubscribers,
	activeSubscribers,
	pendingSubscribers,
	totalCampaigns,
	loading,
}: NewsletterStatsProps) {
	const stats: StatItem[] = [
		{
			label: "Tổng đăng ký",
			value: totalSubscribers,
			icon: Users,
			iconBg: "bg-blue-500/10",
			iconColor: "text-blue-600 dark:text-blue-400",
			loading,
		},
		{
			label: "Đang hoạt động",
			value: activeSubscribers,
			icon: CheckCircle,
			iconBg: "bg-green-500/10",
			iconColor: "text-green-600 dark:text-green-400",
			loading,
		},
		{
			label: "Chờ xác nhận",
			value: pendingSubscribers,
			icon: Clock,
			iconBg: "bg-amber-500/10",
			iconColor: "text-amber-600 dark:text-amber-400",
			loading,
		},
		{
			label: "Chiến dịch",
			value: totalCampaigns,
			icon: Megaphone,
			iconBg: "bg-purple-500/10",
			iconColor: "text-purple-600 dark:text-purple-400",
			loading,
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat) => (
				<StatCard key={stat.label} {...stat} />
			))}
		</div>
	);
}
