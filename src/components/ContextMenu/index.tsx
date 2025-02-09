import React, { useEffect, useRef, useState } from 'react';
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

interface ContextMenuProps {
  items: MenuItem[];
}

const MenuContainer = styled(motion.div)`
  position: fixed;
  background: white;
  border-radius: 8px;
  padding: 4px;
  min-width: 200px;
  box-shadow: ${globalStyles.shadows.medium};
  z-index: 1000;
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

  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : globalStyles.colors.secondary};
  }

  .icon {
    font-size: 16px;
  }
`;

const menuAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2 }
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ items }) => {
  const [position, setPosition] = useState<Position | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    setPosition({ x, y });
  };

  const handleClick = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setPosition(null);
    }
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // 处理菜单位置，确保不会超出视窗
  const adjustedPosition = position ? {
    x: Math.min(position.x, window.innerWidth - (menuRef.current?.offsetWidth || 0)),
    y: Math.min(position.y, window.innerHeight - (menuRef.current?.offsetHeight || 0))
  } : null;

  return (
    <AnimatePresence>
      {position && (
        <MenuContainer
          ref={menuRef}
          style={{
            left: adjustedPosition?.x,
            top: adjustedPosition?.y,
          }}
          {...menuAnimation}
        >
          {items.map((item) => (
            <MenuItem
              key={item.key}
              danger={item.danger}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled && item.onClick) {
                  item.onClick();
                  setPosition(null);
                }
              }}
            >
              {item.icon && <span className="icon">{item.icon}</span>}
              {item.label}
            </MenuItem>
          ))}
        </MenuContainer>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu; 