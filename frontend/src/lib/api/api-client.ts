import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getValidAccessToken, clearTokens } from './token-refresh';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Don't add token for auth endpoints
        if (config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh')) {
          return config;
        }

        const token = await getValidAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // If error is not 401 or request already retried, reject
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        // If token refresh is in progress, queue the request
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          // Try to get a valid token
          const token = await getValidAccessToken();
          
          // Process the queue with the new token
          this.processQueue(null, token);
          
          if (!token) {
            clearTokens();
            return Promise.reject(error);
          }

          // Retry the original request with the new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.client(originalRequest);
        } catch (refreshError) {
          this.processQueue(refreshError, null);
          clearTokens();
          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
        }
      }
    );
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        resolve(this.client(config));
      } else {
        reject(new Error('Token refresh failed'));
      }
    });
    
    this.failedQueue = [];
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Handle specific error cases
      if (axiosError.response) {
        // Server responded with an error status
        console.error('API Error Response:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
        });
        
        // Handle specific status codes
        switch (axiosError.response.status) {
          case 401:
            // Unauthorized - handled by interceptor
            break;
          case 403:
            // Forbidden
            console.error('Access forbidden');
            break;
          case 404:
            // Not found
            console.error('Resource not found');
            break;
          case 500:
            // Server error
            console.error('Server error');
            break;
          default:
            console.error(`API error: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        // Request was made but no response received
        console.error('No response received:', axiosError.request);
      } else {
        // Error setting up the request
        console.error('Request setup error:', axiosError.message);
      }
    } else {
      // Non-Axios error
      console.error('API client error:', error);
    }
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

