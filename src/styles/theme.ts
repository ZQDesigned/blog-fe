import { ThemeConfig } from 'antd/es/config-provider/context';

// 自定义主题配置
export const customTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorBgContainer: '#ffffff',
    colorTextBase: '#333333',
    borderRadius: 4,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 4,
      controlHeight: 36,
    },
    Card: {
      borderRadius: 8,
    },
  },
};

// 导出全局样式变量
export const globalStyles = {
  colors: {
    primary: '#1890ff',
    secondary: '#f0f7ff',
    text: '#333333',
    lightText: '#666666',
    border: '#e8e8e8',
    background: '#ffffff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.15)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    large: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
};
