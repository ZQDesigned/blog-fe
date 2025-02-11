import { useState, useEffect } from 'react';

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
    const saved = localStorage.getItem('backgroundType');
    return (saved as BackgroundType) || 'default';
  });
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(() => {
    const saved = localStorage.getItem('backgroundUrl');
    return saved || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewBackground = async () => {
    setIsLoading(true);
    try {
      // 使用时间戳作为参数来避免缓存
      const timestamp = Date.now();
      const url = `https://www.loliapi.com/acg/?timestamp=${timestamp}`;
      setBackgroundUrl(url);
      localStorage.setItem('backgroundUrl', url);
    } catch (error) {
      console.error('Failed to fetch background:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 当背景类型改变时的处理
  useEffect(() => {
    localStorage.setItem('backgroundType', backgroundType);
    if (backgroundType === 'anime' && !backgroundUrl) {
      fetchNewBackground();
    }
  }, [backgroundType]);

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
