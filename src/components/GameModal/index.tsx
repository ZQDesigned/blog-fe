import React, { Suspense, useState, useEffect } from 'react';
import { Modal } from 'antd';
import styled from '@emotion/styled';
import { useMediaQuery } from 'react-responsive';
import PageLoading from '../PageLoading';

const Game2048 = React.lazy(() => import('../Game2048'));
const GameSnake = React.lazy(() => import('../GameSnake'));

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .ant-modal-content {
      border-radius: 0;
    }
  }
`;

interface GameModalProps {
  open: boolean;
  onClose: () => void;
}

const GAMES = [
  { component: Game2048, title: '2048' },
  { component: GameSnake, title: '贪吃蛇' }
];

const GameModal: React.FC<GameModalProps> = ({ open, onClose }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [selectedGame, setSelectedGame] = useState(0);

  useEffect(() => {
    if (open) {
      // 当模态框打开时随机选择一个游戏
      const randomIndex = Math.floor(Math.random() * GAMES.length);
      setSelectedGame(randomIndex);
    }
  }, [open]);

  const SelectedGame = GAMES[selectedGame].component;
  const gameTitle = GAMES[selectedGame].title;

  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={isMobile ? '100%' : 600}
      style={isMobile ? { top: 0, margin: 0, maxWidth: '100%', height: '100vh' } : {}}
      bodyStyle={isMobile ? { height: 'calc(100vh - 55px)', padding: 0 } : {}}
      title={`休息一下，来玩${gameTitle}吧！`}
      maskStyle={isMobile ? { background: 'rgba(0, 0, 0, 0.85)' } : {}}
    >
      <Suspense fallback={<PageLoading tip="游戏加载中" />}>
        <SelectedGame />
      </Suspense>
    </StyledModal>
  );
};

export default GameModal; 