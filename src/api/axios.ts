import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { getAdminSession, getSession } from '../utils/utils';

interface RequestOptions {
  data?: unknown;
  params?: Record<string, any>;
  config?: AxiosRequestConfig;
}
export interface FetchResult<T> {
  items: T | null;
  error: string | null;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// helper to attach or remove the Authorization header
export function setBearerToken(token: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}

export class ApiError extends Error {
  public status?: number;
  public data?: any;
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

axiosInstance.interceptors.request.use(config => {
  const session = getAdminSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session}`;
  }
  return config;
}, error => Promise.reject(error));

export async function apiRequest<T = any>(
  method: Method,
  url: string,
  opts: RequestOptions = {}
): Promise<T> {
  const { data, params, config } = opts;
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      params,
      ...config,
    });
    return response.data;
  } catch (err: any) {
    // AxiosError guard
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const payload = err.response?.data;
      // you can log here if you like
      throw new ApiError(err.message, status, payload);
    }
    // non-Axios / unexpected
    throw new ApiError(err.message || 'Unknown error');
  }
}

export default axiosInstance;