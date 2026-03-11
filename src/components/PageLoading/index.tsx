import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence, type Variants, type TargetAndTransition } from 'framer-motion';
import { themeVars } from '../../theme';

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
  gap: ${themeVars.spacing.md};
`;

const LoadingText = styled(motion.div)`
  font-size: 16px;
  color: ${themeVars.colors.primary};
  margin-top: ${themeVars.spacing.md};
  text-align: center;
`;

const EmojisContainer = styled(motion.div)`
  display: flex;
  gap: 16px;
  margin-bottom: ${themeVars.spacing.md};
`;

const EmojiWrapper = styled(motion.div)`
  font-size: 32px;
  line-height: 1;
  user-select: none;
`;

// 加载动画使用的 emoji 池
const LOADING_EMOJIS = [
  '✨', '⭐️', '💫', '🌟', '⚡️', '🎯', '🎨', '🎭', '🎪', 
  '🎡', '🎢', '🎠', '🎮', '🎲', '🎸', '🎹', '🎺', '🎻',
  '🎬', '🎤', '🎧', '🎵', '🎶', '🎼', '🎪', '🎭', '🎨',
  '🌈', '🌙', '☀️', '⚡️', '🍀', '🌸', '🌺', '🌼', '🌻'
];

const container: Variants = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const createEmojiAnimation = (index: number): TargetAndTransition => ({
  y: [-10, 10],
  rotate: [-10, 10],
  transition: {
    y: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1,
      ease: 'easeInOut',
      // 设置动画延迟，创造波浪效果
      delay: index * 0.2,
    },
    rotate: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1,
      ease: 'easeInOut',
      // 设置动画延迟，与上下移动同步
      delay: index * 0.2,
    },
  },
});

interface PageLoadingProps {
  tip?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ tip = "加载中" }) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [key, setKey] = useState(0);

  // 每次组件挂载或key变化时重新选择emoji
  useEffect(() => {
    const shuffled = [...LOADING_EMOJIS].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 5));
  }, [key]);

  // 每隔一定时间更新key，触发重新选择
  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 3000); // 每3秒更换一次emoji组合

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingContainer
      variants={container}
      initial="hidden"
      animate="show"
    >
      <EmojisContainer variants={item}>
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', gap: '16px' }}
          >
            {selectedEmojis.map((emoji, index) => (
              <EmojiWrapper
                key={index}
                initial={{ y: 0, rotate: 0 }}
                animate={createEmojiAnimation(index)}
              >
                {emoji}
              </EmojiWrapper>
            ))}
          </motion.div>
        </AnimatePresence>
      </EmojisContainer>

      <LoadingText variants={item}>
        {tip}
      </LoadingText>
    </LoadingContainer>
  );
};

export default PageLoading;
