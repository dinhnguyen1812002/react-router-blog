import { useAuthStore } from "~/store/authStore";

export interface Meme {
	id: string;
	name: string;
	description: string;
	memeUrl: string;
	slug: string;
	createdAt?: string;
	likes?: number;
	views?: number;
}

export interface MemeResponse {
	content: Meme[];
	pageNumber: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
	last: boolean;
}

export interface MemeUploadData {
	name: string;
	userId: string;
}

export interface MemeUploadResponse {
	id: string;
	title: string;
	slug: string;
	imageUrl: string;
	userId: string;
	createdAt: string;
}

// Helper function to build API URLs
const buildApiUrl = (endpoint: string) => {
	const baseUrl = (
		import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"
	).replace(/\/$/, "");
	const cleanEndpoint = endpoint.replace(/^\//, "");
	return `${baseUrl}/${cleanEndpoint}`;
};

// Upload single meme
export async function uploadMeme(
	file: File,
	memeData: MemeUploadData,
): Promise<MemeUploadResponse> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("meme", JSON.stringify(memeData));

	const token = useAuthStore.getState().token;
	const headers: Record<string, string> = {};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(buildApiUrl("memes/upload"), {
		method: "POST",
		body: formData,
		headers,
	});

	if (!response.ok) {
		throw new Error(`Upload failed: ${response.statusText}`);
	}

	return response.json();
}

// Upload multiple memes
export async function uploadMultipleMemes(
	files: File[],
	memesData: MemeUploadData[],
): Promise<MemeUploadResponse[]> {
	const formData = new FormData();

	files.forEach((file) => {
		formData.append("file", file);
	});

	formData.append("memes", JSON.stringify(memesData));

	const token = useAuthStore.getState().token;
	const headers: Record<string, string> = {};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(buildApiUrl("memes/upload/multiple"), {
		method: "POST",
		body: formData,
		headers,
	});

	if (!response.ok) {
		throw new Error(`Multiple upload failed: ${response.statusText}`);
	}

	return response.json();
}

// Get memes list with pagination
export async function getMemes(page: number = 0): Promise<MemeResponse> {
	const response = await fetch(buildApiUrl(`memes?page=${page}`));

	if (!response.ok) {
		throw new Error(`Failed to fetch memes: ${response.statusText}`);
	}

	return response.json();
}

// Get meme by slug
export async function getMemeBySlug(slug: string): Promise<Meme> {
	const response = await fetch(buildApiUrl(`memes/${slug}`));

	if (!response.ok) {
		throw new Error(`Failed to fetch meme: ${response.statusText}`);
	}

	return response.json();
}

// Stream random memes using Server-Sent Events
export function createRandomMemeStream(
	onMeme: (meme: Meme) => void,
	onError?: (error: Error) => void,
) {
	const eventSource = new EventSource(buildApiUrl("memes/random-stream"));

	eventSource.addEventListener("random-meme", (event) => {
		try {
			const meme = JSON.parse(event.data);
			onMeme(meme);
		} catch (error) {
			onError?.(new Error("Failed to parse meme data"));
		}
	});

	eventSource.onerror = (error) => {
		onError?.(new Error("Stream connection error"));
	};

	return eventSource;
}
