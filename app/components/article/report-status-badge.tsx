import { Badge } from "~/components/ui/badge";
import { getStatusInfo } from "~/schemas/report";
import type { ReportStatus } from "~/api/report";

interface ReportStatusBadgeProps {
	status: ReportStatus;
	className?: string;
}

export function ReportStatusBadge({ status, className }: ReportStatusBadgeProps) {
	const statusInfo = getStatusInfo(status);
	
	const variantMap = {
		PENDING: "secondary" as const,
		UNDER_REVIEW: "default" as const,
		RESOLVED: "default" as const,
		DISMISSED: "outline" as const,
	};

	const colorMap = {
		PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
		UNDER_REVIEW: "bg-blue-100 text-blue-800 border-blue-200",
		RESOLVED: "bg-green-100 text-green-800 border-green-200",
		DISMISSED: "bg-gray-100 text-gray-800 border-gray-200",
	};

	return (
		<Badge
			variant={variantMap[status] || "secondary"}
			className={`${colorMap[status]} ${className}`}
		>
			{statusInfo.label}
		</Badge>
	);
}
