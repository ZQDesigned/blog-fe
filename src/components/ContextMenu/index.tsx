import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { globalStyles } from '../../styles/theme';

interface Position {
  x: number;
  y: number;
}

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

// New divider item type
interface DividerItem {
  key: string;
  type: 'divider';
}

// Accept union of menu and divider items
interface ContextMenuProps {
  items: Array<MenuItem | DividerItem>;
}

const MenuContainer = styled(motion.div)`
  position: fixed;
  background: white;
  border-radius: 8px;
  padding: 4px;
  min-width: 200px;
  box-shadow: ${globalStyles.shadows.medium};
  z-index: 1000;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    transform: none !important;
    border-radius: 16px 16px 0 0;
    padding: ${globalStyles.spacing.md};
    padding-bottom: calc(${globalStyles.spacing.md} + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const MenuItem = styled.div<{ danger?: boolean; disabled?: boolean }>`
  padding: ${globalStyles.spacing.sm} ${globalStyles.spacing.md};
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.sm};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => {
    if (props.disabled) return globalStyles.colors.lightText;
    if (props.danger) return '#ff4d4f';
    return 'inherit';
  }};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s ease;
  border-radius: 4px;

  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : globalStyles.colors.secondary};
  }

  .icon {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    padding: ${globalStyles.spacing.md};
    font-size: 16px;
    border-radius: 8px;
    margin-bottom: ${globalStyles.spacing.xs};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// Divider style
const Divider = styled.div`
  height: 1px;
  background-color: ${globalStyles.colors.border};
  margin: 4px 0;

  @media (max-width: 768px) {
    margin: ${globalStyles.spacing.xs} 0;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

const menuAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2 }
};

const mobileMenuAnimation = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      y: { type: 'spring', damping: 25, stiffness: 300 },
      opacity: { duration: 0.2 }
    }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      y: { type: 'spring', damping: 35, stiffness: 400 },
      opacity: { duration: 0.2 }
    }
  }
};

const overlayAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

const MenuHandle = styled.div`
  width: 36px;
  height: 4px;
  background-color: ${globalStyles.colors.border};
  border-radius: 2px;
  margin: 0 auto ${globalStyles.spacing.sm};
  opacity: 0.8;
`;

export const ContextMenu: React.FC<ContextMenuProps> = ({ items }) => {
  const [position, setPosition] = useState<Position | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isMobile = window.innerWidth <= 768;

  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (isMobile) return; // 移动端不响应右键事件
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    setPosition({ x, y });
  }, [isMobile]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!isMobile) return;
    const touch = event.touches[0];
    touchStartTime.current = Date.now();
    longPressTimer.current = window.setTimeout(() => {
      const x = touch.clientX;
      const y = touch.clientY;
      setPosition({ x, y });
      // 震动反馈（如果设备支持）
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms 长按触发
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    // 如果是短按（小于500ms）并且菜单已经显示，则关闭菜单
    if (Date.now() - touchStartTime.current < 500 && position) {
      setPosition(null);
    }
  }, [isMobile, position]);

  const handleTouchMove = useCallback(() => {
    if (!isMobile) return;
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, [isMobile]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setPosition(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handleClick, handleContextMenu, handleTouchEnd, handleTouchMove, handleTouchStart]);

  // 处理菜单位置，确保不会超出视窗
  const adjustedPosition = position ? {
    x: isMobile ? window.innerWidth / 2 : Math.min(position.x, window.innerWidth - (menuRef.current?.offsetWidth || 0)),
    y: isMobile ? window.innerHeight - (menuRef.current?.offsetHeight || 0) - 20 : Math.min(position.y, window.innerHeight - (menuRef.current?.offsetHeight || 0))
  } : null;

  return (
    <AnimatePresence>
      {position && (
        <>
          {isMobile && (
            <Overlay
              {...overlayAnimation}
              onClick={() => setPosition(null)}
            />
          )}
          <MenuContainer
            ref={menuRef}
            style={!isMobile ? {
              left: adjustedPosition?.x,
              top: adjustedPosition?.y,
            } : undefined}
            {...(isMobile ? mobileMenuAnimation : menuAnimation)}
          >
            {isMobile && <MenuHandle />}
            {items.map((item) => {
              if ((item as DividerItem).type === 'divider') {
                return <Divider key={item.key} />;
              }
              const mi = item as MenuItem;
              return (
                <MenuItem
                  key={mi.key}
                  danger={mi.danger}
                  disabled={mi.disabled}
                  onClick={() => {
                    if (!mi.disabled && mi.onClick) {
                      mi.onClick();
                      setPosition(null);
                    }
                  }}
                >
                  {mi.icon && <span className="icon">{mi.icon}</span>}
                  {mi.label}
                </MenuItem>
              );
            })}
          </MenuContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
