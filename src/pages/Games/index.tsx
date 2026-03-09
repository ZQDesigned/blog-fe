import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Card, Modal, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { themeVars, withThemeAlpha } from '../../theme';
import Game2048 from '../../components/Game2048';
import GameSnake from '../../components/GameSnake';
import GameTetris from '../../components/GameTetris';
import GameMinesweeper from '../../components/GameMinesweeper';
import GameSudoku from '../../components/GameSudoku';
import GameReversi from '../../components/GameReversi';
import GameHanoi from '../../components/GameHanoi';
import GameGo from '../../components/GameGo';
import GameDevilRoulette from '../../components/GameDevilRoulette';
import LazyImage from '../../components/LazyImage';
import { useTitle } from '../../hooks/useTitle';
import { useStandaloneMode } from '../../hooks/useStandaloneMode';

const { Title } = Typography;

const GamesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${themeVars.spacing.xl};
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${themeVars.spacing.lg};
  margin-top: ${themeVars.spacing.lg};
`;

const GameCard = styled(motion(Card))`
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .ant-card-cover {
    padding: ${themeVars.spacing.md};
    background: ${themeVars.colors.secondary};
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
  margin-bottom: ${themeVars.spacing.xl};
  color: ${themeVars.colors.text};
`;

const GameTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.sm};
  
  .game-emoji {
    font-size: 20px;
    line-height: 1;
  }
`;

const CategoryTitle = styled(Title)`
  margin-top: ${themeVars.spacing.xl} !important;
  margin-bottom: ${themeVars.spacing.lg} !important;
  color: ${themeVars.colors.text};
  
  &:first-of-type {
    margin-top: 0 !important;
  }
`;

const WebGameCard = styled(motion(Card))`
  cursor: pointer;
  transition: transform 0.2s ease;
  background: ${themeVars.colors.secondary};

  &:hover {
    transform: translateY(-5px);
  }

  .ant-card-body {
    padding: ${themeVars.spacing.lg};
  }
`;

const MINI_GAMES = [
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
  {
    id: 'tetris',
    title: '俄罗斯方块',
    description: '经典的俄罗斯方块游戏，使用方向键控制方块移动和旋转，尽可能多地消除行数获得高分！',
    image: '/images/tetris.png',
    component: GameTetris,
  },
  {
    id: 'minesweeper',
    title: '扫雷',
    description: '经典的扫雷游戏，左键点击揭开方块，按F键或使用按钮切换插旗模式。小心不要踩到地雷！',
    image: '/images/minesweeper.png',
    component: GameMinesweeper,
  },
  {
    id: 'sudoku',
    title: '数独',
    description: '经典的数独游戏，每行、每列和每个3x3宫格都需要填入1-9的数字，考验你的逻辑思维能力！',
    image: '/images/sudoku.png',
    component: GameSudoku,
  },
  {
    id: 'hanoi',
    title: '汉诺塔',
    description: '经典的汉诺塔益智游戏，目标是将所有圆盘从第一根柱子移动到最后一根柱子，每次只能移动一个圆盘，且不能将大圆盘放在小圆盘上。',
    image: '/images/hanoi.png',
    component: GameHanoi,
  },
  {
    id: 'devil-roulette',
    title: '恶魔轮盘',
    description: '与发牌者对决的赌命轮盘：实弹/空包弹随机装填，善用道具获取优势，撑到最后一刻。',
    image: '/images/devil-roulette.png',
    component: GameDevilRoulette,
  },
];

const BOARD_GAMES = [
  {
    id: 'reversi',
    title: '黑白棋',
    description: '经典的黑白棋游戏，与智能AI对战。占领棋盘上更多的格子来获得胜利！',
    image: '/images/reversi.png',
    component: GameReversi,
  },
  {
    id: 'go',
    title: '围棋',
    description: '古老的东方棋类游戏，通过落子围地和吃子获取领地。与AI对弈，体验围棋的深邃魅力！',
    image: '/images/go.png',
    component: GameGo,
  },
];

const WEB_GAMES = [
  {
    id: 'minecraft',
    title: 'Minecraft 1.8',
    description: '在浏览器中体验经典的 Minecraft 1.8 版本，支持完整的游戏功能。使用 WASD 移动，空格跳跃，鼠标控制视角。',
    url: '/minecraft/index.html'
  }
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
      padding: ${themeVars.spacing.md};
    }

    .ant-modal-body {
      height: calc(100vh - 55px);
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .ant-modal-close {
      top: ${themeVars.spacing.md};
      right: ${themeVars.spacing.md};
    }
  }
`;

const GamesPage: React.FC = () => {
  useTitle('休闲游戏', { restoreOnUnmount: true });
  const isStandalone = useStandaloneMode();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<{ [key: string]: boolean }>({});
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleWebGameClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const handleImageError = (gameId: string) => {
    setImageLoadError(prev => ({ ...prev, [gameId]: true }));
  };

  const selectedGameData = [...MINI_GAMES, ...BOARD_GAMES].find(game => game.id === selectedGame);

  return (
    <GamesContainer>
      {!isStandalone && <PageTitle>休闲游戏</PageTitle>}

      <CategoryTitle level={3}>小游戏</CategoryTitle>
      <GamesGrid>
        {MINI_GAMES.map((game, index) => (
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

      <CategoryTitle level={3}>经典棋类游戏</CategoryTitle>
      <GamesGrid>
        {BOARD_GAMES.map((game, index) => (
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
                  <span className="game-emoji">♟️</span>
                  {game.title}
                </GameTitle>
              }
              description={game.description}
            />
          </GameCard>
        ))}
      </GamesGrid>

      <CategoryTitle level={3}>网页游戏</CategoryTitle>
      <GamesGrid>
        {WEB_GAMES.map((game, index) => (
          <WebGameCard
            key={game.id}
            hoverable
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleWebGameClick(game.url)}
          >
            <Card.Meta
              title={
                <GameTitle>
                  <span className="game-emoji">⛏️</span>
                  {game.title}
                </GameTitle>
              }
              description={game.description}
            />
          </WebGameCard>
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
        maskStyle={isMobile ? { background: withThemeAlpha(themeVars.colors.text, 0.85) } : undefined}
      >
        {selectedGameData?.component && <selectedGameData.component />}
      </StyledModal>
    </GamesContainer>
  );
};

export default GamesPage;
