import { message } from 'antd';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 拼接完整的资源 URL
export const getFullResourceUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${BASE_URL}${path}`;
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  signal?: AbortSignal;
}

interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  try {
    const { params, signal, ...restOptions } = options;
    
    // 处理查询参数
    const url = new URL(endpoint, BASE_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {  // 只添加非空值
          url.searchParams.append(key, value);
        }
      });
    }

    // 默认配置
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 cookies
      signal, // 添加 signal 用于取消请求
    };

    // 合并配置
    const finalOptions = {
      ...defaultOptions,
      ...restOptions,
      headers: {
        ...defaultOptions.headers,
        ...restOptions.headers,
      },
    };

    // 如果是 POST/PUT/DELETE 请求，自动转换 body
    if (finalOptions.body && typeof finalOptions.body === 'object') {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }

    const response = await fetch(url.toString(), finalOptions);
    
    // 如果请求被取消，直接返回
    if (signal?.aborted) {
      return Promise.reject(new Error('Request aborted'));
    }

    const result = await response.json() as ApiResponse<T>;

    if (result.code !== 200) {
      throw new Error(result.msg || '请求失败');
    }

    return result.data;
  } catch (error) {
    // 如果是取消请求的错误，不显示错误消息
    if ((error as Error).name === 'AbortError') {
      return Promise.reject(error);
    }
    message.error((error as Error).message || '网络错误');
    throw error;
  }
}

// HTTP 方法封装
export const http = {
  get: <T>(endpoint: string, params?: Record<string, string>, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'GET', params, signal }),

  post: <T>(endpoint: string, data?: any, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'POST', body: data, signal }),

  put: <T>(endpoint: string, data?: any, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'PUT', body: data, signal }),

  delete: <T>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'DELETE', signal }),
}; 