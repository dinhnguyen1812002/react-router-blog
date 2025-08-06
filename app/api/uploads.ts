
import { apiClient } from './client';
import type { ApiResponse, Comment as CommentType, Upload } from '~/types';



export const upload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<Upload>(
    '/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return  response.data.url;
};
