import { getFromSecureStore } from '@/store/secure-store';
import { KeyType } from '@/types/keys.types';
import { logger } from '@/utils/logger.service';
import { ApiResponse } from '@repo/types';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status <= 500
  }
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await getFromSecureStore(KeyType.JWT)
    if (token)
      config.headers.Authorization = `Bearer ${token}`
  } catch (error) {
    logger.error('Api interceptors', 'error sending token with request')
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
  })


const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse<ApiResponse<T>> = await api.get(url, config);
  return response.data;
};

const post = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data, config);
  return response.data;
};

const apiCaller = {
  get,
  post,
};

export default apiCaller;
