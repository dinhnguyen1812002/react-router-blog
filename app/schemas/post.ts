import { z } from "zod";

/**
 * Zod schema for post form validation.
 * Aligns with API: POST /api/v1/author/write
 * - categories/tags sent as names (converted from form ids at submit)
 * - visibility: PUBLISHED | SCHEDULED | PRIVATE | DRAFT
 * - scheduledPublishAt for SCHEDULED
 */
export const postFormSchema = z.object({
	title: z
		.string()
		.min(1, "Tiêu đề là bắt buộc")
		.max(200, "Tiêu đề không được quá 200 ký tự")
		.transform((s) => s.trim()),
	content: z.string().min(1, "Nội dung là bắt buộc"),
	excerpt: z.string().optional().default(""),
	thumbnail: z
		.string()
		.optional()
		.refine(
			(val) => !val || val === "" || /^https?:\/\/.+/i.test(val),
			"URL ảnh không hợp lệ",
		)
		.default(""),
	categories: z.array(z.number()).default([]),
	tags: z.array(z.string()).default([]),
	featured: z.boolean().default(false),
	visibility: z
		.enum(["PUBLISHED", "SCHEDULED", "PRIVATE", "DRAFT"])
		.default("DRAFT"),
	scheduledPublishAt: z.string().optional(),
	publishedAt: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostVisibility = "PUBLISHED" | "SCHEDULED" | "PRIVATE" | "DRAFT";

/** API-ready payload passed from SavePostDialog to parent on save */
export interface PostFormMetadata {
	title: string;
	content: string;
	excerpt: string;
	featured?: boolean;
	thumbnail?: string;
	/** Category IDs */
	categories?: number[];
	/** Tag IDs as UUIDs */
	tags?: string[];
	/** Visibility status: PUBLISHED | SCHEDULED | PRIVATE | DRAFT */
	visibility: PostVisibility;
	/** ISO-8601 format when visibility is SCHEDULED */
	scheduledPublishAt?: string;
	/** ISO-8601 format for published date */
	publishedAt?: string;
}
