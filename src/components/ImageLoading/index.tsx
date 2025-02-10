import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { globalStyles } from '../../styles/theme';

interface ImageLoadingProps {
  size?: number;
  color?: string;
}

const LoadingContainer = styled.div<{ $size: number }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background-color: ${globalStyles.colors.secondary};
`;

const LoadingRing = styled(motion.div)<{ $size: number; $color: string }>`
  width: ${props => props.$size * 0.8}px;
  height: ${props => props.$size * 0.8}px;
  border: 2px solid ${props => props.$color};
  border-top-color: transparent;
  border-radius: 50%;
  position: absolute;
`;

const LoadingDot = styled(motion.div)<{ $size: number; $color: string }>`
  width: ${props => props.$size * 0.2}px;
  height: ${props => props.$size * 0.2}px;
  background-color: ${props => props.$color};
  border-radius: 50%;
  position: absolute;
`;

const ImageLoading: React.FC<ImageLoadingProps> = ({
  size = 40,
  color = globalStyles.colors.primary,
}) => {
  return (
    <LoadingContainer $size={size}>
      <LoadingRing
        $size={size}
        $color={color}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <LoadingDot
        $size={size}
        $color={color}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </LoadingContainer>
  );
};

export default ImageLoading; 