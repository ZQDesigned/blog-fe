import { useRef, useCallback } from 'react';

interface RequestCache {
  [key: string]: {
    promise: Promise<any>;
    timestamp: number;
  }
}

const cache: RequestCache = {};
const CACHE_TIME = 2000; // 缓存时间 2 秒

export function useDedupeRequest() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const dedupe = useCallback(<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    const now = Date.now();

    // 如果存在缓存且未过期，返回缓存的 Promise
    if (
      cache[key] &&
      now - cache[key].timestamp < CACHE_TIME
    ) {
      return cache[key].promise;
    }

    // 取消之前的请求（如果存在）
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    // 创建新的请求
    const promise = requestFn()
      .finally(() => {
        // 请求完成后清除缓存
        setTimeout(() => {
          delete cache[key];
        }, CACHE_TIME);
      });

    // 缓存请求
    cache[key] = {
      promise,
      timestamp: now
    };

    return promise;
  }, []);

  return dedupe;
} 