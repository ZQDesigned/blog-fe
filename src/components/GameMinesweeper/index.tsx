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

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1px;
  background: ${globalStyles.colors.border};
  border-radius: 8px;
  padding: ${globalStyles.spacing.xs};
  aspect-ratio: 1;
`;

const Cell = styled.div<{
  $revealed: boolean;
  $isMine: boolean;
  $isFlagged: boolean;
  $isGameOver: boolean;
  $value: number;
}>`
  aspect-ratio: 1;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  background-color: ${props => 
    props.$revealed 
      ? props.$isMine 
        ? props.$isGameOver ? '#ff4d4f' : globalStyles.colors.secondary
        : globalStyles.colors.secondary
      : globalStyles.colors.primary + '40'
  };
  color: ${props => {
    if (props.$isFlagged) return '#f5222d';
    if (!props.$revealed) return 'transparent';
    if (props.$isMine) return '#000';
    switch (props.$value) {
      case 1: return '#1890ff';
      case 2: return '#52c41a';
      case 3: return '#f5222d';
      case 4: return '#722ed1';
      case 5: return '#fa8c16';
      case 6: return '#13c2c2';
      case 7: return '#eb2f96';
      case 8: return '#faad14';
      default: return 'transparent';
    }
  }};
  transition: all 0.1s ease;

  &:hover {
    background-color: ${props => 
      !props.$revealed && !props.$isGameOver 
        ? globalStyles.colors.primary + '60'
        : undefined
    };
  }
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${globalStyles.spacing.md};
`;

const GameInfo = styled.div`
  display: flex;
  gap: ${globalStyles.spacing.md};
`;

const InfoItem = styled.div`
  background: ${globalStyles.colors.border};
  padding: ${globalStyles.spacing.sm} ${globalStyles.spacing.md};
  border-radius: 4px;
  color: ${globalStyles.colors.text};
  font-weight: bold;
`;

const TouchControls = styled.div`
  display: flex;
  justify-content: center;
  gap: ${globalStyles.spacing.md};
  margin-top: ${globalStyles.spacing.lg};

  @media (min-width: 769px) {
    display: none;
  }
`;

const ModeButton = styled(Button)<{ $active: boolean }>`
  flex: 1;
  max-width: 120px;
  background-color: ${props => props.$active ? globalStyles.colors.primary : undefined};
  color: ${props => props.$active ? '#fff' : undefined};

  &:hover {
    background-color: ${props => props.$active ? globalStyles.colors.primary + 'dd' : undefined};
    color: ${props => props.$active ? '#fff' : undefined};
  }
`;

const BOARD_SIZE = 9;
const MINES_COUNT = 10;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  value: number;
}

const GameMinesweeper: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [flagsCount, setFlagsCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>();
  const firstMoveRef = useRef(true);

  const initializeBoard = useCallback(() => {
    const newBoard: Cell[][] = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        value: 0
      }))
    );
    return newBoard;
  }, []);

  const placeMines = useCallback((board: Cell[][], firstX: number, firstY: number) => {
    let minesPlaced = 0;
    const newBoard = [...board];

    while (minesPlaced < MINES_COUNT) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);

      // 确保不在首次点击的位置及其周围放置地雷
      if (!newBoard[y][x].isMine &&
          !(Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1)) {
        newBoard[y][x].isMine = true;
        minesPlaced++;
      }
    }

    // 计算每个格子周围的地雷数
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (!newBoard[y][x].isMine) {
          let count = 0;
          // 检查周围8个方向
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < BOARD_SIZE && nx >= 0 && nx < BOARD_SIZE) {
                if (newBoard[ny][nx].isMine) count++;
              }
            }
          }
          newBoard[y][x].value = count;
        }
      }
    }

    return newBoard;
  }, []);

  const revealCell = useCallback((board: Cell[][], x: number, y: number): Cell[][] => {
    if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return board;
    if (board[y][x].isRevealed || board[y][x].isFlagged) return board;

    let newBoard = [...board.map(row => [...row])];
    newBoard[y][x].isRevealed = true;

    // 如果是空格子，递归显示周围的格子
    if (newBoard[y][x].value === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < BOARD_SIZE && nx >= 0 && nx < BOARD_SIZE) {
            if (!newBoard[ny][nx].isRevealed) {
              newBoard = revealCell(newBoard, nx, ny);
            }
          }
        }
      }
    }

    return newBoard;
  }, []);

  const checkWinCondition = useCallback((board: Cell[][]) => {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = board[y][x];
        if (!cell.isMine && !cell.isRevealed) return false;
      }
    }
    return true;
  }, []);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (gameOver || hasWon) return;

    setBoard(prevBoard => {
      let newBoard = [...prevBoard.map(row => [...row])];
      const cell = newBoard[y][x];

      if (flagMode) {
        // 处理插旗模式
        if (!cell.isRevealed) {
          if (cell.isFlagged) {
            cell.isFlagged = false;
            setFlagsCount(prev => prev - 1);
          } else if (flagsCount < MINES_COUNT) {
            cell.isFlagged = true;
            setFlagsCount(prev => prev + 1);
          }
        }
      } else {
        // 处理普通点击
        if (cell.isFlagged) return newBoard;

        if (firstMoveRef.current) {
          // 首次点击
          firstMoveRef.current = false;
          newBoard = placeMines(newBoard, x, y);
          // 开始计时
          timerRef.current = window.setInterval(() => {
            setTimeElapsed(prev => prev + 1);
          }, 1000);
        }

        if (cell.isMine) {
          // 游戏结束，显示所有地雷
          newBoard = newBoard.map(row => row.map(cell => ({
            ...cell,
            isRevealed: cell.isMine ? true : cell.isRevealed
          })));
          setGameOver(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        } else {
          newBoard = revealCell(newBoard, x, y);
          // 检查是否获胜
          if (checkWinCondition(newBoard)) {
            setHasWon(true);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          }
        }
      }

      return newBoard;
    });
  }, [gameOver, hasWon, flagMode, placeMines, revealCell, checkWinCondition]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setGameOver(false);
    setHasWon(false);
    setFlagMode(false);
    setFlagsCount(0);
    setTimeElapsed(0);
    firstMoveRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [initializeBoard]);

  useEffect(() => {
    resetGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetGame]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'f') {
      setFlagMode(prev => !prev);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <GameContainer ref={containerRef} tabIndex={0}>
      <GameControls>
        <GameInfo>
          <InfoItem>💣 {MINES_COUNT - flagsCount}</InfoItem>
          <InfoItem>⏱️ {timeElapsed}s</InfoItem>
        </GameInfo>
        <Button onClick={resetGame}>重新开始</Button>
      </GameControls>

      <GameBoard>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              onClick={() => handleCellClick(x, y)}
              $revealed={cell.isRevealed}
              $isMine={cell.isMine}
              $isFlagged={cell.isFlagged}
              $isGameOver={gameOver}
              $value={cell.value}
            >
              {cell.isFlagged ? '🚩' :
               cell.isRevealed ?
                 cell.isMine ? '💣' :
                 cell.value > 0 ? cell.value : ''
               : ''}
            </Cell>
          ))
        )}
      </GameBoard>

      <TouchControls>
        <ModeButton
          $active={!flagMode}
          onClick={() => setFlagMode(false)}
        >
          挖开模式
        </ModeButton>
        <ModeButton
          $active={flagMode}
          onClick={() => setFlagMode(true)}
        >
          插旗模式
        </ModeButton>
      </TouchControls>

      <Modal
        title={hasWon ? "恭喜你赢了！" : "游戏结束"}
        open={gameOver || hasWon}
        onOk={resetGame}
        onCancel={() => setGameOver(false)}
        okText="再来一局"
        cancelText="关闭"
        maskClosable={false}
        closable={true}
      >
        <p>
          {hasWon
            ? `太棒了！你成功找出了所有地雷！用时：${timeElapsed}秒`
            : "很遗憾，你触发了地雷！"}
        </p>
      </Modal>
    </GameContainer>
  );
};

export default GameMinesweeper;
