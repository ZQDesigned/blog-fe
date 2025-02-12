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
  grid-template-columns: repeat(20, 1fr);
  gap: 1px;
  background: ${globalStyles.colors.border};
  border-radius: 8px;
  padding: ${globalStyles.spacing.xs};
  aspect-ratio: 1;
`;

const Cell = styled.div<{ $type: 'empty' | 'snake' | 'food' }>`
  aspect-ratio: 1;
  border-radius: 2px;
  background-color: ${props => {
    switch (props.$type) {
      case 'snake':
        return globalStyles.colors.primary;
      case 'food':
        return '#F44336';
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
  max-width: 200px;
  margin-left: auto;
  margin-right: auto;

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

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

const GameSnake: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood();
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDirection = nextDirectionRef.current;

      let newHead: Position;
      switch (currentDirection) {
        case 'UP':
          newHead = { x: head.x, y: (head.y - 1 + BOARD_SIZE) % BOARD_SIZE };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: (head.y + 1) % BOARD_SIZE };
          break;
        case 'LEFT':
          newHead = { x: (head.x - 1 + BOARD_SIZE) % BOARD_SIZE, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: (head.x + 1) % BOARD_SIZE, y: head.y };
          break;
        default:
          newHead = head;
      }

      // 检查是否吃到食物
      const ateFood = newHead.x === food.x && newHead.y === food.y;

      // 检查是否撞到自己
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake.slice(0, ateFood ? prevSnake.length : -1)];

      if (ateFood) {
        setScore(prev => prev + 10);
        generateFood();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const currentDirection = nextDirectionRef.current;

    switch (e.key) {
      case 'ArrowUp':
        if (currentDirection !== 'DOWN') nextDirectionRef.current = 'UP';
        break;
      case 'ArrowDown':
        if (currentDirection !== 'UP') nextDirectionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
        if (currentDirection !== 'RIGHT') nextDirectionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
        if (currentDirection !== 'LEFT') nextDirectionRef.current = 'RIGHT';
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
    }
  }, []);

  const handleDirectionButton = (newDirection: Direction) => {
    const currentDirection = nextDirectionRef.current;
    switch (newDirection) {
      case 'UP':
        if (currentDirection !== 'DOWN') nextDirectionRef.current = 'UP';
        break;
      case 'DOWN':
        if (currentDirection !== 'UP') nextDirectionRef.current = 'DOWN';
        break;
      case 'LEFT':
        if (currentDirection !== 'RIGHT') nextDirectionRef.current = 'LEFT';
        break;
      case 'RIGHT':
        if (currentDirection !== 'LEFT') nextDirectionRef.current = 'RIGHT';
        break;
    }
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameOver, isPaused, moveSnake]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleModalClose = () => {
    if (gameOver) {
      resetGame();
    }
  };

  const board = Array(BOARD_SIZE).fill(null).map((_, y) =>
    Array(BOARD_SIZE).fill(null).map((_, x) => {
      const isSnake = snake.some(segment => segment.x === x && segment.y === y);
      const isFood = food.x === x && food.y === y;
      return (
        <Cell
          key={`${x}-${y}`}
          $type={isSnake ? 'snake' : isFood ? 'food' : 'empty'}
        />
      );
    })
  );

  return (
    <GameContainer
      ref={containerRef}
      tabIndex={0}
    >
      <GameControls>
        <Score>分数: {score}</Score>
        <Button onClick={resetGame}>重新开始</Button>
      </GameControls>
      <GameBoard>
        {board.flat()}
      </GameBoard>

      <TouchControls>
        <div />
        <DirectionButton onClick={() => handleDirectionButton('UP')}>↑</DirectionButton>
        <div />
        <DirectionButton onClick={() => handleDirectionButton('LEFT')}>←</DirectionButton>
        <DirectionButton onClick={() => handleDirectionButton('DOWN')}>↓</DirectionButton>
        <DirectionButton onClick={() => handleDirectionButton('RIGHT')}>→</DirectionButton>
      </TouchControls>

      <Modal
        title="游戏结束"
        open={gameOver}
        onOk={resetGame}
        onCancel={handleModalClose}
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

export default GameSnake;
