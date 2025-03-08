import React, { useState, useEffect } from 'react';
import { Select, Button, Modal, Tooltip } from 'antd';
import styled from '@emotion/styled';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Board, Player, Position, AIDifficulty } from './types.19';
import { getValidMoves, makeMove, calculateScore } from './utils.19';
import { GoAIFactory } from './ai.19';

// 样式组件
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

const GameInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const InfoItem = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const GameBoard = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(19, 30px);
  grid-template-rows: repeat(19, 30px);
  background-color: #DEB887;
  padding: 15px;
  border: 2px solid #8B4513;
`;

const BoardLines = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #000;
  }

  &::before {
    top: 0;
    bottom: 0;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      transparent 14px,
      #000 14px,
      #000 44px
    );
    background-position: 0 0;
    left: 14px;
    box-shadow: ${Array(19).fill(0).map((_, i) => `${i * 30}px 0`).join(', ')};
  }

  &::after {
    left: 0;
    right: 0;
    height: 1px;
    background: repeating-linear-gradient(
      to right,
      transparent 14px,
      #000 14px,
      #000 44px
    );
    background-position: 0 0;
    top: 14px;
    box-shadow: ${Array(19).fill(0).map((_, i) => `0 ${i * 30}px`).join(', ')};
  }
`;

const Cell = styled.div<{ $canPlace: boolean }>`
  width: 30px;
  height: 30px;
  position: relative;
  cursor: ${props => props.$canPlace ? 'pointer' : 'not-allowed'};
  z-index: 1;

  &:hover {
    ${props => props.$canPlace && `
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 26px;
        height: 26px;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
      }
    `}
  }
`;

const Stone = styled.div<{ $color: Player }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26px;
  height: 26px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: ${props => props.$color === 'black' ? '#000' : '#fff'};
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.$color === 'black' ? '#000' : '#ccc'};
`;

const StarPoint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: #000;
`;

const PassButton = styled(Button)`
  margin-top: 10px;
`;

const GameGo19: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => {
    return Array(19).fill(null).map(() => Array(19).fill(null));
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
    Array(19).fill(null).map(() => Array(19).fill(null))
  );
  const [consecutivePasses, setConsecutivePasses] = useState(0);

  // 初始化游戏
  const initGame = () => {
    setBoard(Array(19).fill(null).map(() => Array(19).fill(null)));
    setCurrentPlayer('black');
    setGameOver(false);
    setScores({ black: 0, white: 0 });
    setValidMoves([]);
    setLastCapturedPosition(null);
    setTerritory(Array(19).fill(null).map(() => Array(19).fill(null)));
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
          title={difficulty === 'hard' ? "困难模式下，AI每次落子会有约2秒的思考时间，请耐心等待" : null}
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
              {/* 星位点 */}
              {[[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]]
                .some(([r, c]) => r === i && c === j) && <StarPoint />}
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
        <p>游戏结束！</p>
        <p>黑棋得分：{scores.black}</p>
        <p>白棋得分：{scores.white}</p>
        <p>
          {scores.black > scores.white
            ? '黑棋胜利！'
            : scores.white > scores.black
            ? '白棋胜利！'
            : '平局！'}
        </p>
      </Modal>
    </GameContainer>
  );
};

export default GameGo19;