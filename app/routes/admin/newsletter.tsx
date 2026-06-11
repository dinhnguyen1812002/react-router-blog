import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, RefreshCw } from "lucide-react";
import { newsletterApi } from "~/api/newsletter";
import {
	CampaignsTab,
	NewsletterStats,
	SubscribersTab,
} from "~/components/admin/newsletter";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/Card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/ui/tabs";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Admin - Newsletter" },
		{ name: "description", content: "Quản lý đăng ký và chiến dịch newsletter" },
	];
}

export default function AdminNewsletterPage() {
	const queryClient = useQueryClient();

	const { data: totalData, isLoading: totalLoading } = useQuery({
		queryKey: ["newsletter", "stats", "total"],
		queryFn: () => newsletterApi.getSubscribers(0, 1),
		staleTime: 60_000,
	});

	const { data: activeCount, isLoading: activeLoading } = useQuery({
		queryKey: ["newsletter", "stats", "active-count"],
		queryFn: () => newsletterApi.getActiveCount(),
		staleTime: 60_000,
	});

	const { data: pendingData, isLoading: pendingLoading } = useQuery({
		queryKey: ["newsletter", "stats", "pending"],
		queryFn: () =>
			newsletterApi.getSubscribers(0, 1, { status: "PENDING" }),
		staleTime: 60_000,
	});

	const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
		queryKey: ["newsletter", "stats", "campaigns"],
		queryFn: () => newsletterApi.getCampaigns(0, 1),
		staleTime: 60_000,
	});

	const statsLoading =
		totalLoading || activeLoading || pendingLoading || campaignsLoading;

	const handleRefreshAll = () => {
		queryClient.invalidateQueries({ queryKey: ["newsletter"] });
	};

	return (
		<div className="space-y-6 p-1">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-start gap-3">
					<div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
						<Mail className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							Newsletter
						</h1>
						<p className="text-sm text-muted-foreground mt-0.5">
							Quản lý người đăng ký và chiến dịch email marketing
						</p>
					</div>
				</div>
				<Button variant="outline" onClick={handleRefreshAll} className="gap-2 shrink-0">
					<RefreshCw className="h-4 w-4" />
					Làm mới tất cả
				</Button>
			</div>

			{/* Stats */}
			<NewsletterStats
				totalSubscribers={totalData?.totalElements ?? null}
				activeSubscribers={activeCount ?? null}
				pendingSubscribers={pendingData?.totalElements ?? null}
				totalCampaigns={campaignsData?.totalElements ?? null}
				loading={statsLoading}
			/>

			{/* Tabs */}
			<Tabs defaultValue="subscribers" className="space-y-4">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="subscribers">Người đăng ký</TabsTrigger>
					<TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>
				</TabsList>

				<TabsContent value="subscribers">
					<Card className="border-border/60 shadow-sm py-0 gap-0">
						<CardHeader className="px-6 pt-6 pb-4">
							<CardTitle className="text-lg">Danh sách người đăng ký</CardTitle>
							<CardDescription>
								Tìm kiếm, lọc theo trạng thái và theo dõi xác nhận email
							</CardDescription>
						</CardHeader>
						<CardContent className="px-6 pb-6">
							<SubscribersTab />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="campaigns">
					<Card className="border-border/60 shadow-sm py-0 gap-0">
						<CardHeader className="px-6 pt-6 pb-4">
							<CardTitle className="text-lg">Chiến dịch email</CardTitle>
							<CardDescription>
								Tạo, lên lịch và gửi newsletter đến người đăng ký đã kích hoạt
							</CardDescription>
						</CardHeader>
						<CardContent className="px-6 pb-6">
							<CampaignsTab />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
