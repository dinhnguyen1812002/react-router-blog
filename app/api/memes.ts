import axiosInstance from '~/config/axios';
import type { Meme, MemeResponse, ApiResponse } from '~/types';

export const memesApi = {
    /**
     * Get paginated list of memes
     */
    getMemes: async (page = 0, size = 10): Promise<MemeResponse> => {
        try {
            const response = await axiosInstance.get(`/memes?page=${page}&size=${size}`);
            console.log('Memes API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Memes API Error:', error);
            throw error;
        }
    },

    /**
     * Get meme by slug
     */
    getMemeBySlug: async (slug: string): Promise<Meme> => {
        try {
            const response = await axiosInstance.get(`/memes/${slug}`);
            console.log('Meme detail API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Meme detail API Error:', error);
            throw error;
        }
    },

    /**
     * Upload single meme
     */
    uploadMeme: async (file: File, memeData: { title: string; userId: string }): Promise<Meme> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('meme', JSON.stringify(memeData));

            const response = await axiosInstance.post('/memes/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload meme response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Upload meme error:', error);
            throw error;
        }
    },

    /**
     * Upload multiple memes
     */
    uploadMultipleMemes: async (
        files: File[],
        memesData: Array<{ title: string; userId: string }>
    ): Promise<Meme[]> => {
        try {
            const formData = new FormData();

            files.forEach(file => {
                formData.append('file', file);
            });

            formData.append('memes', JSON.stringify(memesData));

            const response = await axiosInstance.post('/memes/upload/multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload multiple memes response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Upload multiple memes error:', error);
            throw error;
        }
    },

    /**
     * Get random meme stream (SSE)
     */
    getRandomMemeStream: (onMeme: (meme: Meme) => void, onError?: (error: Error) => void) => {
        const eventSource = new EventSource(`${axiosInstance.defaults.baseURL}/memes/random-stream`);

        eventSource.addEventListener('random-meme', (event) => {
            try {
                const meme = JSON.parse(event.data);
                onMeme(meme);
            } catch (error) {
                console.error('Error parsing random meme data:', error);
                onError?.(error as Error);
            }
        });

        eventSource.onerror = (error) => {
            console.error('Random meme stream error:', error);
            // onError?.(error as Error);
        };

        return () => {
            eventSource.close();
        };
    },

    /**
     * Get meme image URL
     */
    getMemeImageUrl: (memeUrl: string): string => {
        // If memeUrl is already a full URL, return as is
        if (memeUrl.startsWith('http')) {
            return memeUrl;
        }

        // Otherwise, construct full URL
        const baseUrl = axiosInstance.defaults.baseURL?.replace('/api/v1', '') || 'http://localhost:8888';
        return `${baseUrl}/${memeUrl}`;
    },
};