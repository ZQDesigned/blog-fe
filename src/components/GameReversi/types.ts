export type Player = 'black' | 'white';
export type Board = (Player | null)[][];
export type Position = [number, number];
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'hell';

// AI 策略接口
export interface IReversiAI {
  getMove(board: Board, player: Player): Promise<Position | null>;
  getDifficulty(): AIDifficulty;
}

// MCTS 节点接口
export interface MCTSNode {
  board: Board;
  player: Player;
  move: Position | null;
  parent: MCTSNode | null;
  children: MCTSNode[];
  visits: number;
  wins: number;
  untriedMoves: Position[];
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

// 角落位置
export const CORNERS: Position[] = [
  [0, 0], [0, 7], [7, 0], [7, 7]
];

// 危险区域（C形位置）
export const DANGER_ZONES: Position[] = [
  [0, 1], [1, 0], [1, 1],  // 左上角周围
  [0, 6], [1, 6], [1, 7],  // 右上角周围
  [6, 0], [6, 1], [7, 1],  // 左下角周围
  [6, 6], [6, 7], [7, 6],  // 右下角周围
]; 