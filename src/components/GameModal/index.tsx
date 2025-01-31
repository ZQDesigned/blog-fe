import React, { Suspense } from 'react';
import { Modal } from 'antd';
import styled from '@emotion/styled';
import { useMediaQuery } from 'react-responsive';
import PageLoading from '../PageLoading';

const Game2048 = React.lazy(() => import('../Game2048'));

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

const GameModal: React.FC<GameModalProps> = ({ open, onClose }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={isMobile ? '100%' : 600}
      style={isMobile ? { top: 0, margin: 0, maxWidth: '100%', height: '100vh' } : {}}
      bodyStyle={isMobile ? { height: 'calc(100vh - 55px)', padding: 0 } : {}}
      title="休息一下，玩个小游戏吧！"
      maskStyle={isMobile ? { background: 'rgba(0, 0, 0, 0.85)' } : {}}
    >
      <Suspense fallback={<PageLoading tip="游戏加载中" />}>
        <Game2048 />
      </Suspense>
    </StyledModal>
  );
};

export default GameModal; 