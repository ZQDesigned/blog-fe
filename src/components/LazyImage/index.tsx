import React, { useState, useEffect, useRef } from 'react';
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

const ImageContent: React.FC<LazyImageProps> = ({
  src,
  alt,
  loadingSize,
  loadingColor,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...imgProps
}) => {
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Cached images may finish before their load event is observed.
    if (src && imageRef.current?.complete) setIsLoading(false);
  }, [src]);

  const handleLoad: NonNullable<LazyImageProps['onLoad']> = event => {
    setIsLoading(false);
    onLoad?.(event);
  };

  const handleError: NonNullable<LazyImageProps['onError']> = event => {
    setIsLoading(false);
    onError?.(event);
  };

  return (
    <>
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
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
};

const LazyImage: React.FC<LazyImageProps> = ({ containerClassName, ...props }) => (
  <ImageContainer className={containerClassName}>
    {/* Reset load state with the source and ignore events from the old image. */}
    <ImageContent key={props.src} {...props} />
  </ImageContainer>
);

export default LazyImage;
