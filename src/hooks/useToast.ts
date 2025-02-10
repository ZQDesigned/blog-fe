import { createContext, useContext } from 'react';
import { ToastType } from '../components/Toast';

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
