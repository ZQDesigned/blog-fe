import React, { useState, useEffect } from 'react';
import GameGo19 from './GameGo.19';
import GameGo9 from './GameGo.9';
import { Select, Alert } from 'antd';
import styled from '@emotion/styled';
import { globalStyles } from '../../styles/theme';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${globalStyles.spacing.lg};
  padding: ${globalStyles.spacing.lg};
  max-width: 100%;
  margin: 0 auto;
`;

const BoardSizeSelector = styled(Select)`
  width: 120px;
  margin-bottom: ${globalStyles.spacing.md};
`;

const isPC = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return !(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
};

const GoGameProxy: React.FC = () => {
  const [boardSize, setBoardSize] = useState<'9' | '19'>('9');
  const [isPCDevice, setIsPCDevice] = useState(false);

  useEffect(() => {
    setIsPCDevice(isPC());
  }, []);

  const handleBoardSizeChange = (size: '9' | '19') => {
    setBoardSize(size);
  };

  return (
    <GameContainer>
      <BoardSizeSelector
        value={boardSize}
        // @ts-ignore
        onChange={handleBoardSizeChange}
        options={[
          { label: '9×9棋盘', value: '9' },
          { label: '19×19棋盘', value: '19' }
        ]}
      />
      {boardSize === '19' ? <GameGo19 /> : <GameGo9 />}
      {isPCDevice && boardSize === '9' && (
        <Alert
          message="提示：您正在使用PC端浏览器，可以切换到19×19棋盘来获得完整的游戏体验"
          type="warning"
          showIcon
          style={{ marginTop: globalStyles.spacing.md }}
        />
      )}
    </GameContainer>
  );
};

export default GoGameProxy;