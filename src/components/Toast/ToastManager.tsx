import React, { useState, useCallback } from 'react';
import Toast from './index';
import { ToastContext, ToastOptions } from '../../hooks/useToast.ts';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    options?: ToastOptions;
  }>({
    visible: false,
    message: '',
  });

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    // 如果已经有 toast 显示，先关闭它
    setToast(prev => {
      if (prev.visible) {
        return { ...prev, visible: false };
      }
      return prev;
    });

    // 使用 setTimeout 确保前一个 toast 的退出动画完成
    setTimeout(() => {
      setToast({
        visible: true,
        message,
        options,
      });
    }, 100);
  }, []);

  const handleClose = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        onClose={handleClose}
        visible={toast.visible}
        {...toast.options}
      />
    </ToastContext.Provider>
  );
};
