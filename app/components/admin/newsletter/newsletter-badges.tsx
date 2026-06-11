import {
	CheckCircle,
	Clock,
	FileText,
	Pause,
	Send,
	XCircle,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { ECampaignStatus, ENewsletterStatus } from "~/api/newsletter";
import { cn } from "~/lib/utils";

const SUBSCRIBER_STATUS: Record<
	ENewsletterStatus,
	{ label: string; className: string; icon: React.ReactNode }
> = {
	PENDING: {
		label: "Chờ xác nhận",
		className: "text-amber-700 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
		icon: <Clock className="h-3 w-3" />,
	},
	ACTIVE: {
		label: "Đang hoạt động",
		className: "text-green-700 border-green-200 bg-green-50 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
		icon: <CheckCircle className="h-3 w-3" />,
	},
	UNSUBSCRIBED: {
		label: "Đã hủy đăng ký",
		className: "text-muted-foreground border-border bg-muted/50",
		icon: <XCircle className="h-3 w-3" />,
	},
	BOUNCED: {
		label: "Bounced",
		className: "text-destructive border-destructive/30 bg-destructive/10",
		icon: <XCircle className="h-3 w-3" />,
	},
	COMPLAINED: {
		label: "Complained",
		className: "text-destructive border-destructive/30 bg-destructive/10",
		icon: <XCircle className="h-3 w-3" />,
	},
	SUSPENDED: {
		label: "Tạm khóa",
		className: "text-orange-700 border-orange-200 bg-orange-50 dark:bg-orange-950/30",
		icon: <Pause className="h-3 w-3" />,
	},
};

export function SubscriberStatusBadge({ status }: { status: ENewsletterStatus }) {
	const config = SUBSCRIBER_STATUS[status];
	return (
		<Badge variant="outline" className={cn("gap-1 font-normal", config.className)}>
			{config.icon}
			{config.label}
		</Badge>
	);
}

const CAMPAIGN_STATUS: Record<
	ECampaignStatus,
	{ label: string; className: string; icon?: React.ReactNode }
> = {
	DRAFT: {
		label: "Nháp",
		className: "bg-muted text-muted-foreground",
		icon: <FileText className="h-3 w-3" />,
	},
	SCHEDULED: {
		label: "Đã lên lịch",
		className: "text-amber-700 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400",
		icon: <Clock className="h-3 w-3" />,
	},
	SENDING: {
		label: "Đang gửi",
		className: "text-blue-700 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
		icon: <Send className="h-3 w-3" />,
	},
	SENT: {
		label: "Đã gửi",
		className: "text-green-700 border-green-200 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
		icon: <CheckCircle className="h-3 w-3" />,
	},
	PAUSED: {
		label: "Tạm dừng",
		className: "bg-muted text-muted-foreground",
		icon: <Pause className="h-3 w-3" />,
	},
	CANCELLED: {
		label: "Đã hủy",
		className: "text-destructive border-destructive/30 bg-destructive/10",
	},
	FAILED: {
		label: "Thất bại",
		className: "text-destructive border-destructive/30 bg-destructive/10",
	},
};

export function CampaignStatusBadge({ status }: { status: ECampaignStatus }) {
	const config = CAMPAIGN_STATUS[status];
	return (
		<Badge variant="outline" className={cn("gap-1 font-normal", config.className)}>
			{config.icon}
			{config.label}
		</Badge>
	);
}
