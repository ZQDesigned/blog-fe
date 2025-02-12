import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Card, Modal } from 'antd';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { globalStyles } from '../../styles/theme';
import Game2048 from '../../components/Game2048';
import GameSnake from '../../components/GameSnake';
import LazyImage from '../../components/LazyImage';
import { useTitle } from '../../hooks/useTitle';

const GamesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${globalStyles.spacing.xl};
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${globalStyles.spacing.lg};
  margin-top: ${globalStyles.spacing.lg};
`;

const GameCard = styled(motion(Card))`
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .ant-card-cover {
    padding: ${globalStyles.spacing.md};
    background: ${globalStyles.colors.secondary};
  }

  &.image-error {
    .ant-card-cover {
      display: none;
    }
  }

  .preview-image {
    width: 100%;
    aspect-ratio: 2/1;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: ${globalStyles.spacing.xl};
  color: ${globalStyles.colors.text};
`;

const GameTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.sm};
  
  .game-emoji {
    font-size: 20px;
    line-height: 1;
  }
`;

const GAMES = [
  {
    id: '2048',
    title: '2048',
    description: '经典的2048数字游戏，通过方向键移动数字，相同数字相遇时会合并。目标是获得2048！',
    image: '/images/2048.png',
    component: Game2048,
  },
  {
    id: 'snake',
    title: '贪吃蛇',
    description: '控制蛇吃掉食物不断成长，注意不要撞到自己或墙壁。使用方向键或屏幕按钮控制方向。',
    image: '/images/snake.png',
    component: GameSnake,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StyledModal = styled(Modal)`
  @media (max-width: 768px) {
    .ant-modal-content {
      min-height: 100vh;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }

    .ant-modal-header {
      border-radius: 0;
      padding: ${globalStyles.spacing.md};
    }

    .ant-modal-body {
      height: calc(100vh - 55px);
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .ant-modal-close {
      top: ${globalStyles.spacing.md};
      right: ${globalStyles.spacing.md};
    }
  }
`;

const GamesPage: React.FC = () => {
  useTitle('休闲游戏', { restoreOnUnmount: true });
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<{ [key: string]: boolean }>({});
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const handleImageError = (gameId: string) => {
    setImageLoadError(prev => ({ ...prev, [gameId]: true }));
  };

  const selectedGameData = GAMES.find(game => game.id === selectedGame);

  return (
    <GamesContainer>
      <PageTitle>休闲游戏</PageTitle>
      <GamesGrid>
        {GAMES.map((game, index) => (
          <GameCard
            key={game.id}
            hoverable
            className={imageLoadError[game.id] ? 'image-error' : ''}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            cover={
              !imageLoadError[game.id] && (
                <LazyImage
                  src={game.image}
                  alt={game.title}
                  onError={() => handleImageError(game.id)}
                  loadingSize={40}
                  className="preview-image"
                />
              )
            }
            onClick={() => handleGameSelect(game.id)}
          >
            <Card.Meta
              title={
                <GameTitle>
                  <span className="game-emoji">🎮</span>
                  {game.title}
                </GameTitle>
              }
              description={game.description}
            />
          </GameCard>
        ))}
      </GamesGrid>

      <StyledModal
        open={!!selectedGame}
        onCancel={handleCloseGame}
        footer={null}
        width={isMobile ? '100%' : '90%'}
        style={isMobile ? 
          { top: 0, margin: 0, maxWidth: '100%', padding: 0 } : 
          { maxWidth: '800px' }
        }
        title={
          selectedGameData && (
            <GameTitle>
              <span className="game-emoji">🎮</span>
              {selectedGameData.title}
            </GameTitle>
          )
        }
        destroyOnClose
        maskStyle={isMobile ? { background: 'rgba(0, 0, 0, 0.85)' } : undefined}
      >
        {selectedGameData?.component && <selectedGameData.component />}
      </StyledModal>
    </GamesContainer>
  );
};

export default GamesPage; 