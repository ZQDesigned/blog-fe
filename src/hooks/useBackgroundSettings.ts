import { safeLocalStorage } from '../utils/storage';
import { useState, useEffect, useCallback } from 'react';

export type BackgroundType = 'default' | 'anime';

interface UseBackgroundSettingsReturn {
  backgroundType: BackgroundType;
  backgroundUrl: string | null;
  isLoading: boolean;
  setBackgroundType: (type: BackgroundType) => void;
  refreshBackground: () => Promise<void>;
}

export const useBackgroundSettings = (): UseBackgroundSettingsReturn => {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(() => {
    const saved = safeLocalStorage.getItem('backgroundType');
    return (saved as BackgroundType) || 'default';
  });
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(() => {
    const saved = safeLocalStorage.getItem('backgroundUrl');
    return saved || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewBackground = useCallback(async () => {
    setIsLoading(true);
    try {
      // 使用时间戳作为参数来避免缓存
      const timestamp = Date.now();
      const url = `https://www.loliapi.com/acg/?timestamp=${timestamp}`;
      setBackgroundUrl(url);
      safeLocalStorage.setItem('backgroundUrl', url);
    } catch (error) {
      console.error('Failed to fetch background:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 当背景类型改变时的处理
  useEffect(() => {
    safeLocalStorage.setItem('backgroundType', backgroundType);
    if (backgroundType === 'anime' && !backgroundUrl) {
      fetchNewBackground();
    }
  }, [backgroundType, backgroundUrl, fetchNewBackground]);

  const refreshBackground = async () => {
    if (backgroundType === 'anime') {
      await fetchNewBackground();
    }
  };

  return {
    backgroundType,
    backgroundUrl,
    isLoading,
    setBackgroundType: (type: BackgroundType) => {
      setBackgroundType(type);
    },
    refreshBackground,
  };
};
