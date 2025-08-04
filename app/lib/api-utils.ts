import axiosInstance from '~/config/axios';

export const checkBackendConnection = async () => {
  try {
    const response = await axiosInstance.get('/health');
    console.log('Backend connection successful:', response.data);
    return true;
  } catch (error: any) {
    console.error('Backend connection failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      }
    });
    return false;
  }
};

export const debugApiCall = async (method: string, url: string, data?: any) => {
  console.log(`API Call: ${method} ${url}`, data ? { data } : '');
  
  try {
    const response = await axiosInstance.request({
      method,
      url,
      data,
    });
    console.log(`API Success: ${method} ${url}`, response.data);
    return response;
  } catch (error: any) {
    console.error(`API Error: ${method} ${url}`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};

// Utility to normalize API responses
export const normalizeApiResponse = <T>(response: any): { data: T; message: string; success: boolean } => {
  console.log('Normalizing API response:', response);
  
  // If response already has the expected format
  if (response && typeof response === 'object' && 'data' in response && 'success' in response) {
    return response;
  }
  
  // If response is the data directly
  if (response && typeof response === 'object') {
    return {
      data: response,
      message: 'Success',
      success: true
    };
  }
  
  // Fallback
  return {
    data: response,
    message: 'Success',
    success: true
  };
};

// Utility to normalize paginated responses
export const normalizePaginatedResponse = <T>(response: any): { 
  content: T[]; 
  totalElements: number; 
  totalPages: number; 
  size: number; 
  number: number 
} => {
  console.log('Normalizing paginated response:', response);
  
  // If response already has the expected format
  if (response && typeof response === 'object' && 'content' in response) {
    return response;
  }
  
  // If response is an array directly
  if (Array.isArray(response)) {
    return {
      content: response,
      totalElements: response.length,
      totalPages: 1,
      size: response.length,
      number: 0
    };
  }
  
  // Fallback
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0
  };
}; 