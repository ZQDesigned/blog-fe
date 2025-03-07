import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Modal, Select } from 'antd';
import { globalStyles } from '../../styles/theme';
import { Board, Player, Position, AIDifficulty } from './types';
import { BOARD_SIZE, getValidMoves, makeMove, calculateScores } from './utils';
import { ReversiAIFactory } from './ai';

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
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  background: ${globalStyles.colors.border};
  padding: 2px;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
`;

const Cell = styled.div<{ $canPlace?: boolean }>`
  background: ${globalStyles.colors.background};
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$canPlace ? 'pointer' : 'default'};
  transition: background-color 0.3s;

  &:hover {
    background: ${props => props.$canPlace ? globalStyles.colors.secondary : globalStyles.colors.background};
  }
`;

const Disc = styled.div<{ $color: 'black' | 'white' }>`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: ${props => props.$color === 'black' ? '#000' : '#fff'};
  border: 2px solid ${props => props.$color === 'black' ? '#333' : '#ccc'};
  box-shadow: ${globalStyles.shadows.small};
  transition: transform 0.3s;
  animation: place 0.3s ease-out;

  @keyframes place {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const GameReversi: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => {
    const newBoard: Board = Array(BOARD_SIZE).fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));

    const center = BOARD_SIZE / 2;
    newBoard[center-1][center-1] = 'white';
    newBoard[center-1][center] = 'black';
    newBoard[center][center-1] = 'black';
    newBoard[center][center] = 'white';

    return newBoard;
  });
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [ai] = useState(() => ReversiAIFactory.createAI('medium'));

  // 初始化游戏
  const initGame = () => {
    const newBoard: Board = Array(BOARD_SIZE).fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));

    const center = BOARD_SIZE / 2;
    newBoard[center-1][center-1] = 'white';
    newBoard[center-1][center] = 'black';
    newBoard[center][center-1] = 'black';
    newBoard[center][center] = 'white';

    setBoard(newBoard);
    setCurrentPlayer('black');
    setGameOver(false);
    setScores({ black: 2, white: 2 });
    setValidMoves([]);
  };

  // 处理玩家移动
  const handleMove = async (pos: Position) => {
    if (isThinking || gameOver || !validMoves.some(([r, c]) => r === pos[0] && c === pos[1])) {
      return;
    }

    const newBoard = makeMove(pos, currentPlayer, board);
    const newScores = calculateScores(newBoard);
    setBoard(newBoard);
    setScores(newScores);

    // AI回合
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    const opponentMoves = getValidMoves(opponent, newBoard);

    if (opponentMoves.length > 0) {
      setCurrentPlayer(opponent);
      setIsThinking(true);
      const aiMove = await ReversiAIFactory.createAI(difficulty).getMove(newBoard, opponent);
      setIsThinking(false);

      if (aiMove) {
        const aiBoard = makeMove(aiMove, opponent, newBoard);
        const aiScores = calculateScores(aiBoard);
        setBoard(aiBoard);
        setScores(aiScores);

        const playerMoves = getValidMoves('black', aiBoard);
        if (playerMoves.length > 0) {
          setCurrentPlayer('black');
        } else {
          setGameOver(true);
        }
      }
    } else {
      const playerMoves = getValidMoves('black', newBoard);
      if (playerMoves.length === 0) {
        setGameOver(true);
      }
    }
  };

  // 更新有效移动
  useEffect(() => {
    if (!isThinking && currentPlayer === 'black' && board) {
      const moves = getValidMoves('black', board);
      setValidMoves(moves);
    } else {
      setValidMoves([]);
    }
  }, [board, currentPlayer, isThinking]);

  // 处理难度变更
  useEffect(() => {
    if (difficulty !== ai.getDifficulty()) {
      initGame();
    }
  }, [difficulty, ai]);

  return (
    <GameContainer>
      <GameInfo>
        <InfoItem>黑棋: {scores.black}</InfoItem>
        <InfoItem>白棋: {scores.white}</InfoItem>
        <Select
          value={difficulty}
          onChange={(value: AIDifficulty) => setDifficulty(value)}
          style={{ width: 100 }}
          options={[
            { label: '简单', value: 'easy' },
            { label: '中等', value: 'medium' },
            { label: '困难', value: 'hard' },
          ]}
        />
        <Button onClick={initGame}>重新开始</Button>
      </GameInfo>

      <GameBoard>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              onClick={() => handleMove([i, j])}
              $canPlace={validMoves.some(([r, c]) => r === i && c === j)}
            >
              {cell && <Disc $color={cell} />}
            </Cell>
          ))
        )}
      </GameBoard>

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

export default GameReversi;
