import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { Button, Modal } from 'antd';
import { globalStyles } from '../../styles/theme';

const GameContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: ${globalStyles.spacing.lg};
  outline: none;
  touch-action: none;
`;

const GameArea = styled.div`
  display: flex;
  gap: ${globalStyles.spacing.lg};
  justify-content: center;
  margin-bottom: ${globalStyles.spacing.lg};
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 1px;
  background: ${globalStyles.colors.border};
  border-radius: 8px;
  padding: ${globalStyles.spacing.xs};
  aspect-ratio: 1/2;
  width: 50%;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${globalStyles.spacing.md};
  width: 30%;
`;

const NextPieceBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: ${globalStyles.colors.border};
  border-radius: 8px;
  padding: ${globalStyles.spacing.xs};
  aspect-ratio: 1;
`;

const Cell = styled.div<{ $type: 'empty' | 'piece' | 'ghost'; $color?: string }>`
  aspect-ratio: 1;
  border-radius: 2px;
  background-color: ${props => {
    switch (props.$type) {
      case 'piece':
        return props.$color || globalStyles.colors.primary;
      case 'ghost':
        return props.$color ? `${props.$color}40` : `${globalStyles.colors.primary}40`;
      default:
        return globalStyles.colors.secondary;
    }
  }};
  transition: background-color 0.1s ease;
`;

const Score = styled.div`
  background: ${globalStyles.colors.border};
  padding: ${globalStyles.spacing.sm} ${globalStyles.spacing.md};
  border-radius: 4px;
  color: ${globalStyles.colors.text};
  font-weight: bold;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${globalStyles.spacing.md};
`;

const TouchControls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${globalStyles.spacing.sm};
  margin-top: ${globalStyles.spacing.lg};
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  padding: ${globalStyles.spacing.md};
  background: ${globalStyles.colors.secondary}40;
  border-radius: 12px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const DirectionButton = styled(Button)`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  padding: 0;
`;

// 俄罗斯方块的形状定义
const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

const GameTetris: React.FC = () => {
  const [board, setBoard] = useState<Array<Array<{ value: number; color: string }>>>(
    Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill({ value: 0, color: '' }))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<{
    shape: number[][];
    color: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();

  const createNewPiece = useCallback(() => {
    const shapes = Object.entries(TETROMINOES);
    const [type, { shape, color }] = shapes[Math.floor(Math.random() * shapes.length)];
    return { shape, color };
  }, []);

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill({ value: 0, color: '' })));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setNextPiece(createNewPiece());
    setCurrentPiece({
      shape: createNewPiece().shape,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      color: createNewPiece().color
    });
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const isCollision = useCallback((shape: number[][], x: number, y: number) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX].value === 1)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  const rotatePiece = useCallback((shape: number[][]) => {
    const newShape = Array(shape[0].length).fill(0)
      .map(() => Array(shape.length).fill(0));
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        newShape[col][shape.length - 1 - row] = shape[row][col];
      }
    }
    return newShape;
  }, []);

  const mergePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const y = currentPiece.y + rowIndex;
          const x = currentPiece.x + colIndex;
          if (y >= 0) {
            newBoard[y][x] = { value: 1, color: currentPiece.color };
          }
        }
      });
    });

    // 立即检查和清除已满的行
    let linesCleared = 0;
    const finalBoard = newBoard.filter(row => {
      if (row.every(cell => cell.value === 1)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    // 在顶部添加新的空行
    while (finalBoard.length < BOARD_HEIGHT) {
      finalBoard.unshift(Array(BOARD_WIDTH).fill({ value: 0, color: '' }));
    }

    // 更新分数和棋盘状态
    if (linesCleared > 0) {
      const scores = [0, 100, 300, 600, 1000];
      setScore(prev => prev + scores[linesCleared]);
    }
    setBoard(finalBoard);

    // 生成新的当前方块
    if (nextPiece) {
      const newCurrentPiece = {
        shape: nextPiece.shape,
        x: Math.floor(BOARD_WIDTH / 2) - 1,
        y: 0,
        color: nextPiece.color
      };

      // 检查游戏是否结束
      if (isCollision(nextPiece.shape, Math.floor(BOARD_WIDTH / 2) - 1, 0)) {
        setGameOver(true);
      } else {
        setCurrentPiece(newCurrentPiece);
        setNextPiece(createNewPiece());
      }
    }
  }, [currentPiece, board, nextPiece, isCollision, createNewPiece]);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver) return;

    if (!isCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
      setCurrentPiece(prev => prev && {
        ...prev,
        y: prev.y + 1
      });
    } else {
      mergePiece();
    }
  }, [currentPiece, gameOver, isCollision, mergePiece]);

  const moveHorizontal = useCallback((direction: number) => {
    if (!currentPiece || gameOver) return;

    const newX = currentPiece.x + direction;
    if (!isCollision(currentPiece.shape, newX, currentPiece.y)) {
      setCurrentPiece(prev => prev && {
        ...prev,
        x: newX
      });
    }
  }, [currentPiece, gameOver, isCollision]);

  const rotate = useCallback(() => {
    if (!currentPiece || gameOver) return;

    const rotated = rotatePiece(currentPiece.shape);
    if (!isCollision(rotated, currentPiece.x, currentPiece.y)) {
      setCurrentPiece(prev => prev && {
        ...prev,
        shape: rotated
      });
    }
  }, [currentPiece, gameOver, isCollision, rotatePiece]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveHorizontal(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveHorizontal(1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotate();
        break;
      case ' ':
        e.preventDefault();
        setIsPaused(prev => !prev);
        break;
    }
  }, [gameOver, moveHorizontal, moveDown, rotate]);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveDown, INITIAL_SPEED);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameOver, isPaused, moveDown]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderBoard = () => {
    const displayBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (currentPiece) {
      // 添加当前方块
      currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            const y = currentPiece.y + rowIndex;
            const x = currentPiece.x + colIndex;
            if (y >= 0 && y < BOARD_HEIGHT) {
              displayBoard[y][x] = { value: 2, color: currentPiece.color };
            }
          }
        });
      });
    }

    return displayBoard.map((row, rowIndex) => (
      row.map((cell, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          $type={cell.value === 2 ? 'piece' : cell.value === 1 ? 'piece' : 'empty'}
          $color={cell.color}
        />
      ))
    ));
  };

  const renderNextPiece = () => {
    const display = Array(4).fill(0).map(() => Array(4).fill({ value: 0, color: '' }));
    if (nextPiece) {
      const offsetY = Math.floor((4 - nextPiece.shape.length) / 2);
      const offsetX = Math.floor((4 - (nextPiece.shape[0]?.length || 0)) / 2);
      nextPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            display[rowIndex + offsetY][colIndex + offsetX] = { value: 1, color: nextPiece.color };
          }
        });
      });
    }
    return display.map((row, rowIndex) => (
      row.map((cell, colIndex) => (
        <Cell
          key={`next-${rowIndex}-${colIndex}`}
          $type={cell.value ? 'piece' : 'empty'}
          $color={cell.color}
        />
      ))
    ));
  };

  return (
    <GameContainer
      ref={containerRef}
      tabIndex={0}
    >
      <GameControls>
        <Score>分数: {score}</Score>
        <Button onClick={resetGame}>重新开始</Button>
      </GameControls>

      <GameArea>
        <GameBoard>
          {renderBoard()}
        </GameBoard>
        <SidePanel>
          <div>下一个：</div>
          <NextPieceBoard>
            {renderNextPiece()}
          </NextPieceBoard>
        </SidePanel>
      </GameArea>

      <TouchControls>
        <DirectionButton onClick={() => moveHorizontal(-1)}>←</DirectionButton>
        <DirectionButton onClick={rotate}>↻</DirectionButton>
        <DirectionButton onClick={() => moveHorizontal(1)}>→</DirectionButton>
        <div />
        <DirectionButton onClick={moveDown}>↓</DirectionButton>
        <div />
      </TouchControls>

      <Modal
        title="游戏结束"
        open={gameOver}
        onOk={resetGame}
        onCancel={() => setGameOver(false)}
        okText="再来一局"
        cancelText="关闭"
        maskClosable={false}
        closable={true}
      >
        <p>游戏结束了！最终得分：{score}</p>
      </Modal>
    </GameContainer>
  );
};

export default GameTetris; 