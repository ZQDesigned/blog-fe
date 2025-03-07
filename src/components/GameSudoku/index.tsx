import React, { useState, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Modal } from 'antd';
import { globalStyles } from '../../styles/theme';

const GameContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: ${globalStyles.spacing.lg};
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1px;
  background: ${globalStyles.colors.border};
  border-radius: 8px;
  padding: ${globalStyles.spacing.xs};
  aspect-ratio: 1;

  // 添加粗边框分隔 3x3 区块
  & > div:nth-of-type(3n) {
    border-right: 2px solid ${globalStyles.colors.border};
  }
  & > div:nth-of-type(n+19):nth-of-type(-n+27),
  & > div:nth-of-type(n+46):nth-of-type(-n+54) {
    border-bottom: 2px solid ${globalStyles.colors.border};
  }
`;

const Cell = styled.div<{ $isFixed: boolean; $isSelected: boolean; $isError: boolean }>`
  aspect-ratio: 1;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: ${props => props.$isFixed ? 'bold' : 'normal'};
  cursor: ${props => props.$isFixed ? 'default' : 'pointer'};
  user-select: none;
  background-color: ${props => 
    props.$isError ? '#ff4d4f20' :
    props.$isSelected ? globalStyles.colors.primary + '20' :
    '#fff'
  };
  color: ${props => 
    props.$isError ? '#ff4d4f' :
    props.$isFixed ? globalStyles.colors.text :
    globalStyles.colors.primary
  };
  transition: all 0.1s ease;

  &:hover {
    background-color: ${props => 
      !props.$isFixed && globalStyles.colors.primary + '10'
    };
  }
`;
const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${globalStyles.spacing.xs};
  margin-top: ${globalStyles.spacing.md};

  @media (min-width: 768px) {
    grid-template-columns: repeat(9, 1fr);
  }
`;

const NumberButton = styled(Button)`
  height: 40px;
  padding: 0;
`;

const GameInfo = styled.div`
  display: flex;
  gap: ${globalStyles.spacing.md};
  margin-bottom: ${globalStyles.spacing.md};
`;

const InfoItem = styled.div`
  background: ${globalStyles.colors.border};
  padding: ${globalStyles.spacing.sm} ${globalStyles.spacing.md};
  border-radius: 4px;
  color: ${globalStyles.colors.text};
  font-weight: bold;
`;

// 生成数独解决方案
const generateSolution = () => {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));

  const isValid = (num: number, pos: [number, number]) => {
    const [row, col] = pos;

    // 检查行
    for(let x = 0; x < 9; x++) {
      if(board[row][x] === num && x !== col) {
        return false;
      }
    }

    // 检查列
    for(let x = 0; x < 9; x++) {
      if(board[x][col] === num && x !== row) {
        return false;
      }
    }

    // 检查3x3方格
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(board[boxRow + i][boxCol + j] === num &&
           (boxRow + i !== row || boxCol + j !== col)) {
          return false;
        }
      }
    }

    return true;
  };

  const solve = () => {
    for(let row = 0; row < 9; row++) {
      for(let col = 0; col < 9; col++) {
        if(board[row][col] === 0) {
          const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
          for(const num of nums) {
            if(isValid(num, [row, col])) {
              board[row][col] = num;
              if(solve()) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solve();
  return board;
};

// 从解决方案生成游戏板
const generateGame = (solution: number[][], difficulty: number = 0.5) => {
  const game = solution.map(row => [...row]);
  const positions = Array(81).fill(0).map((_, i) => [Math.floor(i / 9), i % 9]);
  positions.sort(() => Math.random() - 0.5);

  const cellsToRemove = Math.floor(81 * difficulty);
  for(let i = 0; i < cellsToRemove; i++) {
    const [row, col] = positions[i];
    game[row][col] = 0;
  }

  return game;
};

const GameSudoku: React.FC = () => {
  const [, setSolution] = useState<number[][]>([]);
  const [game, setGame] = useState<number[][]>([]);
  const [current, setCurrent] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // 初始化游戏
  const initGame = useCallback(() => {
    const newSolution = generateSolution();
    const newGame = generateGame(newSolution);
    setSolution(newSolution);
    setGame(newGame);
    setCurrent(newGame.map(row => [...row]));
    setSelectedCell(null);
    setErrors(new Set());
    setTimeElapsed(0);
    setIsComplete(false);
  }, []);

  // 检查错误
  const checkErrors = useCallback((board: number[][]) => {
    const newErrors = new Set<string>();

    // 检查每一行
    for(let row = 0; row < 9; row++) {
      const seen = new Set();
      for(let col = 0; col < 9; col++) {
        const num = board[row][col];
        if(num !== 0) {
          if(seen.has(num)) {
            for(let c = 0; c <= col; c++) {
              if(board[row][c] === num) {
                newErrors.add(`\${row}-\${c}`);
              }
            }
          }
          seen.add(num);
        }
      }
    }

    // 检查每一列
    for(let col = 0; col < 9; col++) {
      const seen = new Set();
      for(let row = 0; row < 9; row++) {
        const num = board[row][col];
        if(num !== 0) {
          if(seen.has(num)) {
            for(let r = 0; r <= row; r++) {
              if(board[r][col] === num) {
                newErrors.add(`\${r}-\${col}`);
              }
            }
          }
          seen.add(num);
        }
      }
    }

    // 检查每个3x3方格
    for(let boxRow = 0; boxRow < 9; boxRow += 3) {
      for(let boxCol = 0; boxCol < 9; boxCol += 3) {
        const seen = new Set();
        for(let i = 0; i < 3; i++) {
          for(let j = 0; j < 3; j++) {
            const row = boxRow + i;
            const col = boxCol + j;
            const num = board[row][col];
            if(num !== 0) {
              if(seen.has(num)) {
                for(let di = 0; di < 3; di++) {
                  for(let dj = 0; dj < 3; dj++) {
                    const r = boxRow + di;
                    const c = boxCol + dj;
                    if(board[r][c] === num) {
                      newErrors.add(`\${r}-\${c}`);
                    }
                  }
                }
              }
              seen.add(num);
            }
          }
        }
      }
    }

    setErrors(newErrors);

    // 检查是否完成
    if(newErrors.size === 0) {
      let complete = true;
      for(let row = 0; row < 9; row++) {
        for(let col = 0; col < 9; col++) {
          if(board[row][col] === 0) {
            complete = false;
            break;
          }
        }
      }
      setIsComplete(complete);
    }
  }, []);

  // 处理数字输入
  const handleNumberInput = useCallback((num: number) => {
    if(!selectedCell) return;
    const [row, col] = selectedCell;
    if(game[row][col] !== 0) return;

    const newCurrent = current.map(r => [...r]);
    newCurrent[row][col] = num;
    setCurrent(newCurrent);
    checkErrors(newCurrent);
  }, [selectedCell, game, current, checkErrors]);

  // 计时器
  useEffect(() => {
    if(isComplete) return;
    const timer = setInterval(() => {
      setTimeElapsed(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <GameContainer>
      <GameInfo>
        <InfoItem>⏱️ {timeElapsed}s</InfoItem>
        <Button onClick={initGame}>重新开始</Button>
      </GameInfo>

      <GameBoard>
        {current.map((row, i) =>
          row.map((num, j) => (
            <Cell
              key={`\${i}-\${j}`}
              onClick={() => game[i][j] === 0 && setSelectedCell([i, j])}
              $isFixed={game[i][j] !== 0}
              $isSelected={selectedCell?.[0] === i && selectedCell?.[1] === j}
              $isError={errors.has(`\${i}-\${j}`)}
            >
              {num || ''}
            </Cell>
          ))
        )}
      </GameBoard>

      <NumberPad>
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <NumberButton
            key={num}
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell}
          >
            {num}
          </NumberButton>
        ))}
      </NumberPad>

      <Modal
        title="恭喜！"
        open={isComplete}
        onOk={initGame}
        okText="再来一局"
        cancelText="关闭"
        onCancel={() => setIsComplete(false)}
      >
        <p>你成功完成了数独！用时：{timeElapsed}秒</p>
      </Modal>
    </GameContainer>
  );
};

export default GameSudoku;
