import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';

interface RequestOptions {
  data?: unknown;
  params?: Record<string, any>;
  config?: AxiosRequestConfig;
}

// base URL for all requests (set via your .env)

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

export async function apiRequest<T = any>(
  method: Method,
  url: string,
  opts: RequestOptions = {}
): Promise<T> {
  const { data, params, config } = opts;

  const response = await axiosInstance.request<T>({
    method,
    url,
    data,
    params,
    ...config,
  });

  return response.data;
}

export default axiosInstance;