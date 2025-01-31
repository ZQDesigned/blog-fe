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

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${globalStyles.spacing.xs};
  background: #bbada0;
  border-radius: 8px;
  padding: ${globalStyles.spacing.xs};
`;

const Cell = styled.div<{ value: number }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  background-color: ${props => {
    const colors: { [key: number]: string } = {
      0: '#ccc0b3',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    };
    return colors[props.value] || '#cdc1b4';
  }};
  color: ${props => props.value <= 4 ? '#776e65' : '#f9f6f2'};
  border-radius: 4px;
  transition: all 0.15s ease;
`;

const Score = styled.div`
  background: #bbada0;
  padding: ${globalStyles.spacing.sm} ${globalStyles.spacing.md};
  border-radius: 4px;
  color: white;
  font-weight: bold;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${globalStyles.spacing.md};
`;

const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialized = useRef(false);

  const initializeGrid = useCallback(() => {
    const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    return addNewTile(addNewTile(newGrid));
  }, []);

  const checkGameOver = useCallback((currentGrid: number[][]) => {
    // 防止在初始化之前检查
    if (!initialized.current) return false;

    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) return false;
        if (currentGrid[i][j] === 2048 && !hasWon) {
          setHasWon(true);
          return false;
        }
      }
    }

    // 检查是否有相邻的相同数字
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && currentGrid[i][j] === currentGrid[i + 1][j]) ||
          (j < 3 && currentGrid[i][j] === currentGrid[i][j + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }, [hasWon]);

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setHasWon(false);
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const addNewTile = (currentGrid: number[][]) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }
    if (emptyCells.length === 0) return currentGrid;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[x][y] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const moveGrid = (direction: 'up' | 'down' | 'left' | 'right') => {
    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const rotate = (grid: number[][]) => {
      const N = grid.length;
      const rotated = Array(N).fill(0).map(() => Array(N).fill(0));
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          rotated[j][N - 1 - i] = grid[i][j];
        }
      }
      return rotated;
    };

    const moveLeft = (grid: number[][]) => {
      const N = grid.length;
      const newGrid = Array(N).fill(0).map(() => Array(N).fill(0));
      let moved = false;

      for (let i = 0; i < N; i++) {
        let pos = 0;
        let merged = false;

        for (let j = 0; j < N; j++) {
          if (grid[i][j] === 0) continue;

          if (pos > 0 && !merged && newGrid[i][pos - 1] === grid[i][j]) {
            newGrid[i][pos - 1] *= 2;
            newScore += newGrid[i][pos - 1];
            merged = true;
            moved = true;
          } else {
            if (j !== pos) moved = true;
            newGrid[i][pos] = grid[i][j];
            pos++;
            merged = false;
          }
        }
      }

      return { grid: newGrid, moved };
    };

    switch (direction) {
      case 'left': {
        const result = moveLeft(newGrid);
        newGrid = result.grid;
        moved = result.moved;
        break;
      }
      case 'right': {
        newGrid = newGrid.map(row => row.reverse());
        const result = moveLeft(newGrid);
        newGrid = result.grid.map(row => row.reverse());
        moved = result.moved;
        break;
      }
      case 'up': {
        newGrid = rotate(rotate(rotate(newGrid)));
        const result = moveLeft(newGrid);
        newGrid = rotate(result.grid);
        moved = result.moved;
        break;
      }
      case 'down': {
        newGrid = rotate(newGrid);
        const result = moveLeft(newGrid);
        newGrid = rotate(rotate(rotate(result.grid)));
        moved = result.moved;
        break;
      }
    }

    if (moved) {
      setGrid(addNewTile(newGrid));
      setScore(newScore);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault(); // 防止页面滚动
    switch (e.key) {
      case 'ArrowUp':
        moveGrid('up');
        break;
      case 'ArrowDown':
        moveGrid('down');
        break;
      case 'ArrowLeft':
        moveGrid('left');
        break;
      case 'ArrowRight':
        moveGrid('right');
        break;
    }
  }, [grid]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          moveGrid('right');
        } else {
          moveGrid('left');
        }
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          moveGrid('down');
        } else {
          moveGrid('up');
        }
      }
    }

    touchStartRef.current = null;
  };

  useEffect(() => {
    const newGrid = initializeGrid();
    setGrid(newGrid);
    initialized.current = true;

    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialized.current && checkGameOver(grid)) {
      setGameOver(true);
    }
  }, [grid, checkGameOver]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleModalClose = () => {
    if (hasWon) {
      setHasWon(false);
    } else if (gameOver) {
      setGameOver(false);
    }
  };

  return (
    <GameContainer
      ref={containerRef}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GameControls>
        <Score>分数: {score}</Score>
        <Button onClick={resetGame}>重新开始</Button>
      </GameControls>
      <GameGrid>
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <Cell key={`${i}-${j}`} value={cell}>
              {cell !== 0 ? cell : ''}
            </Cell>
          ))
        )}
      </GameGrid>

      <Modal
        title={hasWon ? "恭喜你赢了！" : "游戏结束"}
        open={gameOver || hasWon}
        onOk={resetGame}
        onCancel={handleModalClose}
        okText="再来一局"
        cancelText={hasWon ? "继续游戏" : "关闭"}
        maskClosable={false}
        closable={true}
      >
        <p>
          {hasWon
            ? `太棒了！你达到了2048！最终得分：${score}`
            : `游戏结束了！最终得分：${score}`}
        </p>
      </Modal>
    </GameContainer>
  );
};

export default Game2048;
