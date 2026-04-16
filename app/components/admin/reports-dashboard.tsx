import { BarChart3, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { reportApi } from "~/api/report";
import { getCategoryLabel } from "~/schemas/report";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

export function ReportsDashboard() {
	const { data: stats, isLoading, error } = useQuery({
		queryKey: ["report-statistics"],
		queryFn: reportApi.getReportStatistics,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="size-4" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-16" />
							</CardContent>
						</Card>
					))}
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div key={i} className="flex items-center justify-between">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-12" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !stats) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground">Failed to load report statistics</p>
				</CardContent>
			</Card>
		);
	}

	const statCards = [
		{
			title: "Total Reports",
			value: stats.totalReports,
			icon: BarChart3,
			color: "text-blue-600",
		},
		{
			title: "Pending Review",
			value: stats.pendingReports,
			icon: Clock,
			color: "text-yellow-600",
		},
		{
			title: "Resolved",
			value: stats.resolvedReports,
			icon: CheckCircle,
			color: "text-green-600",
		},
		{
			title: "Dismissed",
			value: stats.dismissedReports,
			icon: XCircle,
			color: "text-gray-600",
		},
	];

	const categoryEntries = Object.entries(stats.byCategory).sort(
		([, a], [, b]) => b - a
	);

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statCards.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card key={stat.title}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{stat.title}
								</CardTitle>
								<Icon className={`size-4 ${stat.color}`} />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Today's Reports */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-lg">Reports Today</CardTitle>
					<TrendingUp className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold">{stats.reportsToday}</div>
					<p className="text-sm text-muted-foreground">
						New reports submitted today
					</p>
				</CardContent>
			</Card>

			{/* Reports by Category */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Reports by Category</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{categoryEntries.map(([category, count]) => (
							<div
								key={category}
								className="flex items-center justify-between"
							>
								<span className="text-sm font-medium">
									{getCategoryLabel(category)}
								</span>
								<Badge variant="secondary">{count}</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
