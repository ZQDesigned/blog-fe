import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { globalStyles } from '../../styles/theme';
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
  background-color: ${props => props.$backgroundColor || '#4CAF50'};
  color: ${props => props.$textColor || '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${globalStyles.spacing.xl};
  z-index: 1001;
  box-shadow: ${globalStyles.shadows.medium};
  overflow: hidden;
`;

const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.md};
  font-size: 16px;
  font-weight: 500;
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
`;

const getDefaultBackgroundColor = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return '#4CAF50';
    case 'info':
      return '#2196F3';
    case 'warning':
      return '#FF9800';
    case 'error':
      return '#F44336';
    default:
      return '#4CAF50';
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
  duration = 3000,
  icon,
  backgroundColor,
  textColor = '#fff',
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