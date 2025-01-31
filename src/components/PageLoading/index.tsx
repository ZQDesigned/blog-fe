import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { globalStyles } from '../../styles/theme';

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
  gap: ${globalStyles.spacing.md};
`;

const LoadingText = styled(motion.div)`
  font-size: 16px;
  color: ${globalStyles.colors.primary};
  margin-top: ${globalStyles.spacing.md};
  text-align: center;
`;

const EmojisContainer = styled(motion.div)`
  display: flex;
  gap: 16px;
  margin-bottom: ${globalStyles.spacing.md};
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

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const createEmojiAnimation = (index: number) => ({
  animate: {
    y: [-10, 10],
    rotate: [-10, 10],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        ease: "easeInOut",
        // 设置动画延迟，创造波浪效果
        delay: index * 0.2,
        // 设置偏移，使动画看起来更自然
        offset: index * 0.2,
      },
      rotate: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        ease: "easeInOut",
        // 设置动画延迟，与上下移动同步
        delay: index * 0.2,
        offset: index * 0.2,
      },
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
                animate={createEmojiAnimation(index).animate}
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
