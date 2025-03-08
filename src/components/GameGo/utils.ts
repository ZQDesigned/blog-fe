import { Board, Player, Position, DIRECTIONS, BOARD_SIZE } from './types';

// 检查位置是否在棋盘内
export const isValidPosition = ([row, col]: Position): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

// 获取一个位置的所有相邻位置
export const getAdjacentPositions = ([row, col]: Position): Position[] => {
  return DIRECTIONS.map(([dx, dy]) => [row + dx, col + dy] as Position)
    .filter(isValidPosition);
};

// 检查一个棋子组的气数
export const countLiberties = (board: Board, group: Position[]): number => {
  const liberties = new Set<string>();

  group.forEach(([row, col]) => {
    getAdjacentPositions([row, col]).forEach(([adjRow, adjCol]) => {
      if (board[adjRow][adjCol] === null) {
        liberties.add(`${adjRow},${adjCol}`);
      }
    });
  });

  return liberties.size;
};

// 找出一个棋子所在的整个连通棋子组
export const findGroup = (board: Board, [row, col]: Position): Position[] => {
  const color = board[row][col];
  if (color === null) return [];

  const group: Position[] = [];
  const visited = new Set<string>();
  const queue: Position[] = [[row, col]];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;

    if (visited.has(key)) continue;
    visited.add(key);
    group.push([r, c]);

    getAdjacentPositions([r, c]).forEach(([adjRow, adjCol]) => {
      if (board[adjRow][adjCol] === color && !visited.has(`${adjRow},${adjCol}`)) {
        queue.push([adjRow, adjCol]);
      }
    });
  }

  return group;
};

// 移除没有气的棋子组
export const removeDeadStones = (board: Board, player: Player): { newBoard: Board, capturedCount: number } => {
  const opponent = player === 'black' ? 'white' : 'black';
  const newBoard = JSON.parse(JSON.stringify(board));
  let capturedCount = 0;

  // 检查对手的棋子
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard[row][col] === opponent) {
        const group = findGroup(newBoard, [row, col]);
        if (countLiberties(newBoard, group) === 0) {
          // 移除没有气的棋子
          group.forEach(([r, c]) => {
            newBoard[r][c] = null;
            capturedCount++;
          });
        }
      }
    }
  }

  return { newBoard, capturedCount };
};

// 检查是否是自杀着法
export const isSuicideMove = (board: Board, [row, col]: Position, player: Player): boolean => {
  if (board[row][col] !== null) return false;

  // 模拟落子
  const tempBoard = JSON.parse(JSON.stringify(board));
  tempBoard[row][col] = player;

  // 移除对手的死子
  const { newBoard } = removeDeadStones(tempBoard, player);

  // 检查刚刚放下的棋子是否有气
  const group = findGroup(newBoard, [row, col]);
  return countLiberties(newBoard, group) === 0;
};

// 检查是否是劫争
export const isKoMove = (
  board: Board,
  [row, col]: Position,
  player: Player,
  lastCapturedPosition: Position | null
): boolean => {
  if (!lastCapturedPosition || board[row][col] !== null) return false;

  // 模拟落子
  const tempBoard = JSON.parse(JSON.stringify(board));
  tempBoard[row][col] = player;

  // 检查是否只吃掉一个子
  const { capturedCount } = removeDeadStones(tempBoard, player);
  if (capturedCount !== 1) return false;

  // 检查是否形成劫争局面
  const [lastRow, lastCol] = lastCapturedPosition;
  return row === lastRow && col === lastCol;
};

// 获取有效的落子位置
export const getValidMoves = (
  board: Board,
  player: Player,
  lastCapturedPosition: Position | null
): Position[] => {
  const moves: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null &&
          !isSuicideMove(board, [row, col], player) &&
          !isKoMove(board, [row, col], player, lastCapturedPosition)) {
        moves.push([row, col]);
      }
    }
  }

  return moves;
};

// 执行落子
export const makeMove = (
  board: Board,
  [row, col]: Position,
  player: Player
): { newBoard: Board, capturedPosition: Position | null, capturedCount: number } => {
  // 复制棋盘
  const tempBoard = JSON.parse(JSON.stringify(board));
  tempBoard[row][col] = player;

  // 移除死子
  const { newBoard, capturedCount } = removeDeadStones(tempBoard, player);

  // 记录被吃的最后一个子的位置（用于劫争检测）
  let capturedPosition: Position | null = null;
  if (capturedCount === 1) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] !== null && newBoard[r][c] === null) {
          capturedPosition = [r, c];
          break;
        }
      }
      if (capturedPosition) break;
    }
  }

  return { newBoard, capturedPosition, capturedCount };
};

// 计算领地和得分
export const calculateScore = (board: Board): { black: number, white: number, territory: Board } => {
  // 复制棋盘用于标记领地
  const territory: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  // 标记已经访问过的空点
  const visited = new Set<string>();

  // 计算每个空点所属的领地
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null && !visited.has(`${row},${col}`)) {
        const emptyArea: Position[] = [];
        const surroundingColors = new Set<Player>();

        // BFS找出连通的空点区域
        const queue: Position[] = [[row, col]];
        while (queue.length > 0) {
          const [r, c] = queue.shift()!;
          const key = `${r},${c}`;

          if (visited.has(key)) continue;
          visited.add(key);
          emptyArea.push([r, c]);

          // 检查周围的点
          getAdjacentPositions([r, c]).forEach(([adjRow, adjCol]) => {
            const adjValue = board[adjRow][adjCol];
            if (adjValue === null && !visited.has(`${adjRow},${adjCol}`)) {
              queue.push([adjRow, adjCol]);
            } else if (adjValue !== null) {
              surroundingColors.add(adjValue);
            }
          });
        }

        // 如果空区域只被一种颜色包围，则属于该颜色的领地
        if (surroundingColors.size === 1) {
          const owner = surroundingColors.values().next().value;
          emptyArea.forEach(([r, c]) => {
            // @ts-expect-error 类型错误
            territory[r][c] = owner;
          });
        }
      }
    }
  }

  // 计算得分（棋子数 + 领地数）
  let blackScore = 0;
  let whiteScore = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'black' || territory[row][col] === 'black') {
        blackScore++;
      } else if (board[row][col] === 'white' || territory[row][col] === 'white') {
        whiteScore++;
      }
    }
  }

  return { black: blackScore, white: whiteScore, territory };
};
