import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define API response interface
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Create a class for API client
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.get(url, config);
      return {
        data: response.data,
        status: response.status,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // Generic POST method
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.post(url, data, config);
      return {
        data: response.data,
        status: response.status,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // Generic PUT method
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.put(url, data, config);
      return {
        data: response.data,
        status: response.status,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // Generic DELETE method
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.delete(url, config);
      return {
        data: response.data,
        status: response.status,
        success: true,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  // Error handler
  private handleError<T>(error: any): ApiResponse<T> {
    return {
      data: {} as T,
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status || 500,
      success: false,
    };
  }
}

// Export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

