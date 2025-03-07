import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Modal } from 'antd';
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

type Player = 'black' | 'white';
type Board = (Player | null)[][];
type Position = [number, number];

const BOARD_SIZE = 8;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
] as const;

// 评估函数权重
const WEIGHTS = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, 1, 1, 1, 1, -2, 10],
  [5, -2, 1, 1, 1, 1, -2, 5],
  [5, -2, 1, 1, 1, 1, -2, 5],
  [10, -2, 1, 1, 1, 1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100]
];

const GameReversi: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => {
    // 初始化棋盘
    const newBoard: Board = Array(BOARD_SIZE).fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));
    
    // 放置初始棋子
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

  // 初始化游戏
  const initGame = useCallback(() => {
    const newBoard: Board = Array(BOARD_SIZE).fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));
    
    // 放置初始棋子
    const center = BOARD_SIZE / 2;
    newBoard[center-1][center-1] = 'white';
    newBoard[center-1][center] = 'black';
    newBoard[center][center-1] = 'black';
    newBoard[center][center] = 'white';

    setBoard(newBoard);
    setCurrentPlayer('black');
    setGameOver(false);
    setScores({ black: 2, white: 2 });
    setValidMoves([]); // 清空有效移动，等待下一次 useEffect 更新
  }, []);

  // 检查位置是否在棋盘内
  const isValidPosition = ([row, col]: Position): boolean => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  // 获取可以翻转的棋子
  const getFlippableDiscs = (pos: Position, player: Player, boardState: Board): Position[] => {
    if (!boardState || !Array.isArray(boardState)) return [];
    
    const [row, col] = pos;
    if (!isValidPosition([row, col]) || boardState[row][col] !== null) return [];

    const flippable: Position[] = [];
    const opponent = player === 'black' ? 'white' : 'black';

    for (const [dx, dy] of DIRECTIONS) {
      let currentRow = row + dx;
      let currentCol = col + dy;
      const temp: Position[] = [];

      while (isValidPosition([currentRow, currentCol])) {
        const current = boardState[currentRow][currentCol];
        if (current === opponent) {
          temp.push([currentRow, currentCol]);
        } else if (current === player && temp.length > 0) {
          flippable.push(...temp);
          break;
        } else {
          break;
        }
        currentRow += dx;
        currentCol += dy;
      }
    }

    return flippable;
  };

  // 获取有效移动位置
  const getValidMoves = (player: Player, boardState: Board): Position[] => {
    const moves: Position[] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (getFlippableDiscs([i, j], player, boardState).length > 0) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  };

  // 评估局面分数
  const evaluateBoard = (boardState: Board, player: Player): number => {
    let score = 0;
    const opponent = player === 'black' ? 'white' : 'black';

    // 位置权重评分
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (boardState[i][j] === player) {
          score += WEIGHTS[i][j];
        } else if (boardState[i][j] === opponent) {
          score -= WEIGHTS[i][j];
        }
      }
    }

    // 行动力评分（可下位置数量）
    const playerMoves = getValidMoves(player, boardState).length;
    const opponentMoves = getValidMoves(opponent, boardState).length;
    score += (playerMoves - opponentMoves) * 5;

    return score;
  };

  // AI移动（极小化极大算法）
  const minimax = (
    boardState: Board,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean,
    player: Player
  ): [number, Position | null] => {
    if (depth === 0) {
      return [evaluateBoard(boardState, player), null];
    }

    const moves = getValidMoves(player, boardState);
    if (moves.length === 0) {
      return [evaluateBoard(boardState, player), null];
    }

    let bestMove: Position | null = null;
    const opponent = player === 'black' ? 'white' : 'black';

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newBoard = makeMove(move, player, JSON.parse(JSON.stringify(boardState)));
        const [evaluation] = minimax(newBoard, depth - 1, alpha, beta, false, opponent);
        if (evaluation > maxEval) {
          maxEval = evaluation;
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return [maxEval, bestMove];
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newBoard = makeMove(move, player, JSON.parse(JSON.stringify(boardState)));
        const [evaluation] = minimax(newBoard, depth - 1, alpha, beta, true, opponent);
        if (evaluation < minEval) {
          minEval = evaluation;
          bestMove = move;
        }
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return [minEval, bestMove];
    }
  };

  // AI决策
  const getAIMove = async (boardState: Board, player: Player): Promise<Position | null> => {
    setIsThinking(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const [, move] = minimax(boardState, 5, -Infinity, Infinity, true, player);
        setIsThinking(false);
        resolve(move);
      }, 500);
    });
  };

  // 执行移动
  const makeMove = (pos: Position, player: Player, boardState: Board): Board => {
    const [row, col] = pos;
    const newBoard = JSON.parse(JSON.stringify(boardState));
    const flippable = getFlippableDiscs(pos, player, boardState);

    if (flippable.length === 0) return boardState;

    newBoard[row][col] = player;
    for (const [r, c] of flippable) {
      newBoard[r][c] = player;
    }

    return newBoard;
  };

  // 计算分数
  const calculateScores = (boardState: Board) => {
    let black = 0, white = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (boardState[i][j] === 'black') black++;
        else if (boardState[i][j] === 'white') white++;
      }
    }
    return { black, white };
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
      const aiMove = await getAIMove(newBoard, opponent);
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
    if (!isThinking && currentPlayer === 'black' && board && Array.isArray(board)) {
      const moves = getValidMoves('black', board);
      setValidMoves(moves);
    } else {
      setValidMoves([]);
    }
  }, [board, currentPlayer, isThinking]);

  return (
    <GameContainer>
      <GameInfo>
        <InfoItem>黑棋: {scores.black}</InfoItem>
        <Button onClick={initGame}>重新开始</Button>
        <InfoItem>白棋: {scores.white}</InfoItem>
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