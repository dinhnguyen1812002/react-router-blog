import { useState, useEffect, useCallback } from "react";
import { getMemes, uploadMeme, uploadMultipleMemes, type Meme, type MemeResponse, type MemeUploadData } from "~/api/memes";

export function useMemes() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMemes = useCallback(async (page: number = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: MemeResponse = await getMemes(page);
      setMemes(response.content);
      setCurrentPage(response.pageNumber);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch memes');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadSingleMeme = useCallback(async (file: File, memeData: MemeUploadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await uploadMeme(file, memeData);
      // Refresh memes list after upload
      await fetchMemes(currentPage);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload meme');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchMemes]);

  const uploadMultiple = useCallback(async (files: File[], memesData: MemeUploadData[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await uploadMultipleMemes(files, memesData);
      // Refresh memes list after upload
      await fetchMemes(currentPage);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload memes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchMemes]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchMemes(page);
    }
  }, [totalPages, fetchMemes]);

  const refresh = useCallback(() => {
    fetchMemes(currentPage);
  }, [currentPage, fetchMemes]);

  useEffect(() => {
    fetchMemes(0);
  }, [fetchMemes]);

  return {
    memes,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    fetchMemes,
    uploadSingleMeme,
    uploadMultiple,
    goToPage,
    refresh,
  };
}

export function useRandomMemeStream() {
  const [currentMeme, setCurrentMeme] = useState<Meme | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const connect = useCallback(() => {
    // Implementation would go here - this is handled in the component for now
  }, []);

  const disconnect = useCallback(() => {
    // Implementation would go here - this is handled in the component for now
  }, []);

  return {
    currentMeme,
    isConnected,
    error,
    connectionStatus,
    connect,
    disconnect,
    setCurrentMeme,
    setIsConnected,
    setError,
    setConnectionStatus,
  };
}