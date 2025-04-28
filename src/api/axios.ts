import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';

// base URL for all requests (set via your .env)

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/",
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
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.request<T>({
    method,
    url,
    data,
    ...config,
  });
  return response.data;
}

export default axiosInstance;