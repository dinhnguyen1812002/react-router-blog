import { apiClient } from "./client";

export type ENewsletterStatus =
	| "PENDING"
	| "ACTIVE"
	| "UNSUBSCRIBED"
	| "BOUNCED"
	| "COMPLAINED"
	| "SUSPENDED";

export type ECampaignStatus =
	| "DRAFT"
	| "SCHEDULED"
	| "SENDING"
	| "SENT"
	| "PAUSED"
	| "CANCELLED"
	| "FAILED";

export interface SubscribeRequest {
	email: string;
	firstName?: string;
	lastName?: string;
	sourceUrl?: string;
	gdprConsent?: boolean;
}

export interface NewsletterSubscribeResponse {
	success: boolean;
	message: string;
	requiresConfirmation: boolean;
}

export interface NewsletterMessageResponse {
	message: string;
}

export interface Subscriber {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	status: ENewsletterStatus;
	createdAt: string;
	confirmedAt?: string | null;
	unsubscribedAt?: string | null;
	lastSentAt?: string | null;
	tags?: string[] | null;
}

export interface Page<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size?: number;
	number?: number;
}

export type SubscriberPage = Page<Subscriber>;

export interface ImportSubscriberRow {
	email: string;
	firstName?: string;
	lastName?: string;
	tags?: string;
	gdprConsent?: boolean;
}

export interface ImportSubscribersRequest {
	subscribers: ImportSubscriberRow[];
	requireConfirmation?: boolean;
	sendWelcomeEmail?: boolean;
}

export interface ImportSubscribersResponse {
	imported: number;
	skipped: number;
	failed: number;
	errors: Array<{ row?: any; message?: string }>;
}

export interface Campaign {
	id: string;
	name: string;
	subject: string;
	status: ECampaignStatus;
	scheduledAt?: string | null;
	sentAt?: string | null;
	recipientCount?: number | null;
	sentCount?: number;
	openedCount?: number;
	clickedCount?: number;
	bouncedCount?: number;
	unsubscribedCount?: number;
	createdAt: string;
}

export interface CreateCampaignRequest {
	name: string;
	subject: string;
	htmlContent: string;
	textContent?: string;
	fromName?: string;
	fromEmail?: string;
	replyTo?: string;
	scheduledAt?: string;
	targetSegment?: string;
	targetTags?: string;
	batchSize?: number;
	sendIntervalSeconds?: number;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
}

export const newsletterApi = {
	subscribe: async (
		payload: SubscribeRequest,
	): Promise<NewsletterSubscribeResponse> => {
		const response = await apiClient.post("/newsletter/subscribe", payload);
		return response.data;
	},

	confirm: async (token: string): Promise<NewsletterMessageResponse> => {
		const response = await apiClient.get(
			`/newsletter/confirm/${encodeURIComponent(token)}`,
		);
		return response.data;
	},

	unsubscribe: async (token: string): Promise<NewsletterMessageResponse> => {
		const response = await apiClient.get(
			`/newsletter/unsubscribe/${encodeURIComponent(token)}`,
		);
		return response.data;
	},

	unsubscribeByEmail: async (
		email: string,
	): Promise<NewsletterMessageResponse> => {
		const response = await apiClient.post("/newsletter/unsubscribe", { email });
		return response.data;
	},

	getSubscribers: async (
		page: number = 0,
		size: number = 10,
		options?: { search?: string; status?: ENewsletterStatus },
	): Promise<SubscriberPage> => {
		const response = await apiClient.get<SubscriberPage>(
			"/newsletter/subscribers",
			{
				params: {
					page,
					size,
					...(options?.search ? { search: options.search } : {}),
					...(options?.status ? { status: options.status } : {}),
				},
			},
		);
		return response.data;
	},

	getActiveSubscribers: async (
		page: number = 0,
		size: number = 10,
	): Promise<SubscriberPage> => {
		const response = await apiClient.get<SubscriberPage>(
			"/newsletter/subscribers?status=ACTIVE",
			{
				params: { page, size },
			},
		);
		return response.data;
	},

	getActiveCount: async (): Promise<number> => {
		const response = await apiClient.get<number>(
			"/newsletter/subscribers/count",
		);
		return response.data;
	},

	importSubscribers: async (
		payload: ImportSubscribersRequest,
	): Promise<ImportSubscribersResponse> => {
		const response = await apiClient.post("/newsletter/import", payload);
		return response.data;
	},

	createCampaign: async (payload: CreateCampaignRequest): Promise<Campaign> => {
		const response = await apiClient.post("/newsletter/campaigns", payload);
		return response.data;
	},

	sendCampaign: async (
		campaignId: string,
	): Promise<NewsletterMessageResponse> => {
		const response = await apiClient.post(
			`/newsletter/campaigns/${campaignId}/send`,
		);
		return response.data;
	},

	getCampaigns: async (
		page: number = 0,
		size: number = 10,
	): Promise<{
		content: Campaign[];
		totalElements: number;
		totalPages: number;
		number?: number;
		size?: number;
	}> => {
		const response = await apiClient.get("/newsletter/campaigns", {
			params: { page, size },
		});
		return response.data;
	},
};
