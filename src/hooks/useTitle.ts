import { useEffect, useRef } from 'react';

interface UseTitleOptions {
  restoreOnUnmount?: boolean;
}

export const useTitle = (title: string, options: UseTitleOptions = {}) => {
  const { restoreOnUnmount = true } = options;
  const previousTitle = useRef(document.title);

  useEffect(() => {
    // 保存当前标题作为前一个标题
    if (restoreOnUnmount) {
      previousTitle.current = document.title;
    }
    
    // 设置新标题
    document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`;

    // 清理函数
    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitle.current;
      }
    };
  }, [title, restoreOnUnmount]);

  // 返回一个函数用于手动更新标题
  return (newTitle: string) => {
    document.title = `${newTitle} - ${import.meta.env.VITE_APP_TITLE}`;
  };
}; 