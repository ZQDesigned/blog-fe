import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import ImageLoading from '../ImageLoading';

// 定义一个新的类型，继承自 motion.img 的属性
type LazyImageProps = Omit<HTMLMotionProps<"img">, "src" | "alt" | "initial" | "animate" | "transition"> & {
  src: string;
  alt: string;
  loadingSize?: number;
  loadingColor?: string;
  containerClassName?: string;
};

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
`;

const StyledImage = styled(motion.img)`
  display: block;
  width: 100%;
  height: 100%;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  loadingSize,
  loadingColor,
  containerClassName,
  ...imgProps
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setIsLoading(true);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <ImageContainer className={containerClassName}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingWrapper
            key={`loading-${src}`}
          >
            <ImageLoading size={loadingSize} color={loadingColor} />
          </LoadingWrapper>
        )}
      </AnimatePresence>
      <StyledImage
        {...imgProps}
        key={`image-${src}`}
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </ImageContainer>
  );
};

export default LazyImage; 