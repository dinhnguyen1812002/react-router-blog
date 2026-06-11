/** Chuyển chuỗi thành slug URL-friendly (hỗ trợ tiếng Việt). */
export function slugifyText(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/(^-|-$)+/g, "");
}
