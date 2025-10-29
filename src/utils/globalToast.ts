import { ToastOptions } from '../hooks/useToast';

// 全局Toast管理器类型
type GlobalToastFunction = (message: string, options?: ToastOptions) => void;

// 全局Toast管理器
class GlobalToastManager {
  private toastFunction: GlobalToastFunction | null = null;

  // 注册Toast函数（在ToastProvider中调用）
  register(toastFunction: GlobalToastFunction) {
    this.toastFunction = toastFunction;
  }

  // 取消注册
  unregister() {
    this.toastFunction = null;
  }

  // 显示Toast
  show(message: string, options?: ToastOptions) {
    if (this.toastFunction) {
      this.toastFunction(message, options);
    } else {
      // 如果Toast系统未初始化，回退到console
      console.warn('[GlobalToast] Toast system not initialized, falling back to console:', message);
    }
  }

  // 便捷方法
  success(message: string, options?: Omit<ToastOptions, 'type'>) {
    this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options?: Omit<ToastOptions, 'type'>) {
    this.show(message, { ...options, type: 'error' });
  }

  warning(message: string, options?: Omit<ToastOptions, 'type'>) {
    this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options?: Omit<ToastOptions, 'type'>) {
    this.show(message, { ...options, type: 'info' });
  }
}

// 导出单例实例
export const globalToast = new GlobalToastManager();
