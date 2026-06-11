import { z } from "zod";

export const slugFieldSchema = z
	.string()
	.min(5, "Slug phải có ít nhất 5 ký tự")
	.max(250, "Slug không được quá 250 ký tự")
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
	);

export const createSeriesSchema = z.object({
	title: z
		.string()
		.min(5, "Tiêu đề phải có ít nhất 5 ký tự")
		.max(200, "Tiêu đề không được quá 200 ký tự"),
	slug: slugFieldSchema,
	description: z
		.string()
		.min(10, "Mô tả phải có ít nhất 10 ký tự")
		.max(2000, "Mô tả quá dài"),
	thumbnail: z
		.union([z.string().url("URL thumbnail không hợp lệ"), z.literal("")])
		.optional(),
	isActive: z.boolean(),
	isCompleted: z.boolean(),
});

export const updateSeriesSchema = z.object({
	title: z
		.string()
		.min(5, "Tiêu đề phải có ít nhất 5 ký tự")
		.max(200, "Tiêu đề không được quá 200 ký tự"),
	description: z
		.string()
		.min(10, "Mô tả phải có ít nhất 10 ký tự")
		.max(2000, "Mô tả quá dài"),
	thumbnail: z
		.union([z.string().url("URL thumbnail không hợp lệ"), z.literal("")])
		.optional(),
	isActive: z.boolean(),
	isCompleted: z.boolean(),
});

export type CreateSeriesFormValues = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesFormValues = z.infer<typeof updateSeriesSchema>;

export function toCreateSeriesPayload(
	data: CreateSeriesFormValues,
): import("~/types").CreateSeriesRequest {
	return {
		title: data.title,
		slug: data.slug,
		description: data.description,
		...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
		isActive: data.isActive,
		isCompleted: data.isCompleted,
	};
}

export function toUpdateSeriesPayload(
	data: UpdateSeriesFormValues,
): import("~/types").UpdateSeriesRequest {
	return {
		title: data.title,
		description: data.description,
		...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
		isActive: data.isActive,
		isCompleted: data.isCompleted,
	};
}
