import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Modal, Select, Tooltip } from 'antd';
import { Global, css } from '@emotion/react';
import { globalStyles } from '../../styles/theme';
import { Board, Player, Position, AIDifficulty, BOARD_SIZE, STAR_POINTS } from './types';
import { getValidMoves, makeMove, calculateScore } from './utils';
import { GoAIFactory } from './ai';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${globalStyles.spacing.lg};
  padding: ${globalStyles.spacing.lg};
  max-width: 100%;
  margin: 0 auto;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 400px;
  gap: ${globalStyles.spacing.md};
`;

const InfoItem = styled.div`
  padding: ${globalStyles.spacing.sm} ${globalStyles.spacing.md};
  background: ${globalStyles.colors.secondary};
  border-radius: 4px;
  font-weight: 500;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
  position: relative;
  background: #E8C285; /* 棋盘木色 */
  padding: 2px;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  box-shadow: ${globalStyles.shadows.medium};
`;

const BoardLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
  pointer-events: none;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: #000;
  }
  
  /* 横线 */
  &::before {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent calc(100% / ${BOARD_SIZE} / 2),
      #000 calc(100% / ${BOARD_SIZE} / 2),
      #000 calc(100% / ${BOARD_SIZE} / 2 + 1px),
      transparent calc(100% / ${BOARD_SIZE} / 2 + 1px),
      transparent calc(100% / ${BOARD_SIZE} + 100% / ${BOARD_SIZE} / 2)
    );
  }
  
  /* 竖线 */
  &::after {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      to right,
      transparent calc(100% / ${BOARD_SIZE} / 2),
      #000 calc(100% / ${BOARD_SIZE} / 2),
      #000 calc(100% / ${BOARD_SIZE} / 2 + 1px),
      transparent calc(100% / ${BOARD_SIZE} / 2 + 1px),
      transparent calc(100% / ${BOARD_SIZE} + 100% / ${BOARD_SIZE} / 2)
    );
  }
`;

const Cell = styled.div<{ $canPlace?: boolean }>`
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$canPlace ? 'pointer' : 'default'};
  z-index: 1;
  
  &:hover {
    background-color: ${props => props.$canPlace ? 'rgba(0, 0, 0, 0.1)' : 'transparent'};
  }
`;

const Stone = styled.div<{ $color: 'black' | 'white' }>`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: ${props => props.$color === 'black' ? '#000' : '#fff'};
  border: 1px solid ${props => props.$color === 'black' ? '#000' : '#ccc'};
  box-shadow: ${globalStyles.shadows.small};
  transition: transform 0.3s;
  animation: place 0.3s ease-out;
  z-index: 2;

  @keyframes place {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const StarPoint = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  z-index: 1;
`;

const PassButton = styled(Button)`
  margin-top: ${globalStyles.spacing.md};
`;

const GlobalStyles = () => (
  <Global
    styles={css`
      .hard-mode-option {
        color: ${globalStyles.colors.error} !important;
        font-weight: 500;
      }
    `}
  />
);

const GameGo: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  });
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ black: 0, white: 0 });
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [ai, setAi] = useState(() => GoAIFactory.createAI('medium'));
  const [lastCapturedPosition, setLastCapturedPosition] = useState<Position | null>(null);
  const [, setTerritory] = useState<Board>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [consecutivePasses, setConsecutivePasses] = useState(0);

  // 初始化游戏
  const initGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer('black');
    setGameOver(false);
    setScores({ black: 0, white: 0 });
    setValidMoves([]);
    setLastCapturedPosition(null);
    setTerritory(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setConsecutivePasses(0);
  };

  // 处理玩家移动
  const handleMove = async (pos: Position) => {
    if (isThinking || gameOver || !validMoves.some(([r, c]) => r === pos[0] && c === pos[1])) {
      return;
    }

    // 玩家落子
    const { newBoard, capturedPosition } = makeMove(board, pos, currentPlayer);
    setBoard(newBoard);
    setLastCapturedPosition(capturedPosition);
    setConsecutivePasses(0);

    // 计算得分
    const scoreResult = calculateScore(newBoard);
    setScores({ black: scoreResult.black, white: scoreResult.white });
    setTerritory(scoreResult.territory);

    // AI回合
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    const opponentMoves = getValidMoves(newBoard, opponent, capturedPosition);

    if (opponentMoves.length > 0) {
      setCurrentPlayer(opponent);
      setIsThinking(true);
      const aiMove = await ai.getMove(newBoard, opponent);
      setIsThinking(false);

      if (aiMove) {
        const { newBoard: aiBoard, capturedPosition: aiCapturedPos } = makeMove(newBoard, aiMove, opponent);
        setBoard(aiBoard);
        setLastCapturedPosition(aiCapturedPos);
        setConsecutivePasses(0);

        // 更新得分
        const aiScoreResult = calculateScore(aiBoard);
        setScores({ black: aiScoreResult.black, white: aiScoreResult.white });
        setTerritory(aiScoreResult.territory);

        const playerMoves = getValidMoves(aiBoard, 'black', aiCapturedPos);
        if (playerMoves.length > 0) {
          setCurrentPlayer('black');
        } else {
          // 玩家无法落子，游戏结束
          setGameOver(true);
        }
      } else {
        // AI选择虚着
        setCurrentPlayer('black');
        setConsecutivePasses(prev => prev + 1);
        if (consecutivePasses >= 1) {
          // 双方连续虚着，游戏结束
          setGameOver(true);
        }
      }
    } else {
      // 对手无法落子，游戏结束
      setGameOver(true);
    }
  };

  // 处理虚着
  const handlePass = async () => {
    if (isThinking || gameOver) return;

    setConsecutivePasses(prev => prev + 1);

    // 如果双方连续虚着，游戏结束
    if (consecutivePasses >= 1) {
      setGameOver(true);
      return;
    }

    // AI回合
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    setCurrentPlayer(opponent);
    setIsThinking(true);
    const aiMove = await ai.getMove(board, opponent);
    setIsThinking(false);

    if (aiMove) {
      const { newBoard: aiBoard, capturedPosition: aiCapturedPos } = makeMove(board, aiMove, opponent);
      setBoard(aiBoard);
      setLastCapturedPosition(aiCapturedPos);
      setConsecutivePasses(0);

      // 更新得分
      const aiScoreResult = calculateScore(aiBoard);
      setScores({ black: aiScoreResult.black, white: aiScoreResult.white });
      setTerritory(aiScoreResult.territory);

      setCurrentPlayer('black');
    } else {
      // AI也选择虚着
      setCurrentPlayer('black');
      setConsecutivePasses(prev => prev + 1);
      if (consecutivePasses >= 1) {
        // 双方连续虚着，游戏结束
        setGameOver(true);
      }
    }
  };

  // 更新有效移动
  useEffect(() => {
    if (!isThinking && currentPlayer === 'black' && board) {
      const moves = getValidMoves(board, 'black', lastCapturedPosition);
      setValidMoves(moves);
    } else {
      setValidMoves([]);
    }
  }, [board, currentPlayer, isThinking, lastCapturedPosition]);

  // 处理难度变更
  const handleDifficultyChange = (newDifficulty: AIDifficulty) => {
    setDifficulty(newDifficulty);
    setAi(GoAIFactory.createAI(newDifficulty));
    initGame();
  };

  return (
    <GameContainer>
      <GlobalStyles />
      <GameInfo>
        <InfoItem>黑棋: {scores.black}</InfoItem>
        <InfoItem>白棋: {scores.white}</InfoItem>
        <Tooltip
          title={difficulty === 'hard' ? "困难模式下，AI每次落子会有约1.5秒的思考时间，请耐心等待" : null}
          placement="top"
        >
          <Select
            value={difficulty}
            onChange={handleDifficultyChange}
            style={{ width: 100 }}
            options={[
              { label: '简单', value: 'easy' },
              { label: '中等', value: 'medium' },
              { label: '困难', value: 'hard', className: 'hard-mode-option' }
            ]}
          />
        </Tooltip>
        <Button onClick={initGame}>重新开始</Button>
      </GameInfo>

      <GameBoard>
        <BoardLines />
        {board.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              onClick={() => handleMove([i, j])}
              $canPlace={validMoves.some(([r, c]) => r === i && c === j)}
            >
              {STAR_POINTS.some(([r, c]) => r === i && c === j) && <StarPoint />}
              {cell && <Stone $color={cell} />}
            </Cell>
          ))
        )}
      </GameBoard>

      <PassButton onClick={handlePass} disabled={isThinking || gameOver}>
        虚着（Pass）
      </PassButton>

      <Modal
        title="游戏结束"
        open={gameOver}
        onOk={initGame}
        onCancel={initGame}
        okText="再来一局"
        cancelText="重新开始"
      >
        <p>
          {scores.black > scores.white
            ? '恭喜！你赢了！'
            : scores.black < scores.white
            ? 'AI赢了，再接再厉！'
            : '平局！'}
        </p>
        <p>最终比分 - 黑棋: {scores.black} vs 白棋: {scores.white}</p>
      </Modal>
    </GameContainer>
  );
};

export default GameGo;
