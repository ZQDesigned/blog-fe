import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { themeVars, withThemeAlpha } from '../../theme';
import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  onClose?: () => void;
  visible: boolean;
}

const ToastContainer = styled(motion.div)<{ $backgroundColor?: string; $textColor?: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${props => props.$backgroundColor || themeVars.colors.success};
  color: ${props => props.$textColor || themeVars.colors.onPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${themeVars.spacing.xl};
  z-index: 1001;
  box-shadow: ${themeVars.shadows.medium};
  overflow: hidden;
`;

const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.md};
  font-size: 16px;
  font-weight: 500;
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${withThemeAlpha(themeVars.colors.onPrimary, 0.3)};
`;

const getDefaultBackgroundColor = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return themeVars.colors.success;
    case 'info':
      return themeVars.colors.info;
    case 'warning':
      return themeVars.colors.warning;
    case 'error':
      return themeVars.colors.error;
    default:
      return themeVars.colors.success;
  }
};

const getDefaultIcon = (type: ToastType): React.ReactNode => {
  switch (type) {
    case 'success':
      return <CheckCircleOutlined />;
    case 'info':
      return <InfoCircleOutlined />;
    case 'warning':
      return <WarningOutlined />;
    case 'error':
      return <CloseCircleOutlined />;
    default:
      return <CheckCircleOutlined />;
  }
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 2000,
  icon,
  backgroundColor,
  textColor = themeVars.colors.onPrimary,
  onClose,
  visible,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <ToastContainer
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          exit={{ y: -64 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          $backgroundColor={backgroundColor || getDefaultBackgroundColor(type)}
          $textColor={textColor}
        >
          <ToastContent>
            {icon || getDefaultIcon(type)}
            <span>{message}</span>
          </ToastContent>
          <ProgressBar
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </ToastContainer>
      )}
    </AnimatePresence>
  );
};

export default Toast;
