import { Board, Player, Position } from './types';

export const BOARD_SIZE = 8;
export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
] as const;

// 检查位置是否在棋盘内
export const isValidPosition = ([row, col]: Position): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

// 获取可以翻转的棋子
export const getFlippableDiscs = (pos: Position, player: Player, board: Board): Position[] => {
  const [row, col] = pos;
  if (!isValidPosition([row, col]) || board[row][col] !== null) return [];

  const flippable: Position[] = [];
  const opponent = player === 'black' ? 'white' : 'black';

  for (const [dx, dy] of DIRECTIONS) {
    let currentRow = row + dx;
    let currentCol = col + dy;
    const temp: Position[] = [];

    while (isValidPosition([currentRow, currentCol])) {
      const current = board[currentRow][currentCol];
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
export const getValidMoves = (player: Player, board: Board): Position[] => {
  const moves: Position[] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (getFlippableDiscs([i, j], player, board).length > 0) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
};

// 执行移动
export const makeMove = (pos: Position, player: Player, board: Board): Board => {
  const [row, col] = pos;
  const newBoard = JSON.parse(JSON.stringify(board));
  const flippable = getFlippableDiscs(pos, player, board);

  if (flippable.length === 0) return board;

  newBoard[row][col] = player;
  for (const [r, c] of flippable) {
    newBoard[r][c] = player;
  }

  return newBoard;
};

// 计算分数
export const calculateScores = (board: Board) => {
  let black = 0, white = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === 'black') black++;
      else if (board[i][j] === 'white') white++;
    }
  }
  return { black, white };
}; 