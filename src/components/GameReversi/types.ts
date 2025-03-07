export type Player = 'black' | 'white';
export type Board = (Player | null)[][];
export type Position = [number, number];
export type AIDifficulty = 'easy' | 'medium' | 'hard';

// AI 策略接口
export interface IReversiAI {
  getMove(board: Board, player: Player): Promise<Position | null>;
  getDifficulty(): AIDifficulty;
}

// 位置权重配置
export const POSITION_WEIGHTS = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
]; 