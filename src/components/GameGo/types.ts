export type Player = 'black' | 'white';
export type Stone = Player | null;
export type Board = Stone[][];
export type Position = [number, number];
export type AIDifficulty = 'easy' | 'medium' | 'hard';

// AI 策略接口
export interface IGoAI {
  getMove(board: Board, player: Player): Promise<Position | null>;
  getDifficulty(): AIDifficulty;
}

// 棋盘大小
export const BOARD_SIZE = 9; // 使用9x9的小棋盘

// 方向数组，用于检查相邻位置
export const DIRECTIONS = [
  [-1, 0], // 上
  [1, 0],  // 下
  [0, -1], // 左
  [0, 1],  // 右
] as const;

// 位置权重配置（用于AI评估）
export const POSITION_WEIGHTS = [
  [3, 2, 3, 2, 3, 2, 3, 2, 3],
  [2, 1, 2, 1, 2, 1, 2, 1, 2],
  [3, 2, 3, 2, 3, 2, 3, 2, 3],
  [2, 1, 2, 1, 2, 1, 2, 1, 2],
  [3, 2, 3, 2, 4, 2, 3, 2, 3],
  [2, 1, 2, 1, 2, 1, 2, 1, 2],
  [3, 2, 3, 2, 3, 2, 3, 2, 3],
  [2, 1, 2, 1, 2, 1, 2, 1, 2],
  [3, 2, 3, 2, 3, 2, 3, 2, 3],
];

// 星位（天元和星位点）
export const STAR_POINTS: Position[] = [
  [2, 2], [2, 6], [4, 4], [6, 2], [6, 6]
];