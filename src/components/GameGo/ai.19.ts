import { Board, Player, Position, IGoAI, AIDifficulty, POSITION_WEIGHTS } from './types.19';
import {
  getValidMoves,
  makeMove,
  countLiberties,
  findGroup,
  isValidPosition,
  getAdjacentPositions,
  calculateScore
} from './utils.19';

// 随机策略 AI（简单模式）
export class RandomAI implements IGoAI {
  getDifficulty(): AIDifficulty {
    return 'easy';
  }

  async getMove(board: Board, player: Player): Promise<Position | null> {
    const validMoves = getValidMoves(board, player, null);
    if (validMoves.length === 0) return null;

    // 随机选择一个有效位置
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
}

// 启发式策略 AI（中等模式）
export class HeuristicAI implements IGoAI {
  getDifficulty(): AIDifficulty {
    return 'medium';
  }

  async getMove(board: Board, player: Player): Promise<Position | null> {
    const validMoves = getValidMoves(board, player, null);
    if (validMoves.length === 0) return null;

    let bestMove = validMoves[0];
    let bestScore = -Infinity;

    validMoves.forEach(move => {
      const score = this.evaluateMove(move, player, board);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove;
  }

  // 检测可以吃掉对手棋子的位置
  private detectCaptureMoves(board: Board, player: Player): Map<string, number> {
    const opponent = player === 'black' ? 'white' : 'black';
    const captureMoves = new Map<string, number>();

    // 检查对手的每个棋子组
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === opponent) {
          const group = findGroup(board, [row, col]);
          const liberties = countLiberties(board, group);

          // 如果对手棋子组只有一口气，找出这口气的位置
          if (liberties === 1) {
            // 找出这口气的位置
            const libertiesPositions = new Set<string>();
            group.forEach(([r, c]) => {
              getAdjacentPositions([r, c]).forEach(([adjRow, adjCol]) => {
                if (board[adjRow][adjCol] === null) {
                  libertiesPositions.add(`${adjRow},${adjCol}`);
                }
              });
            });

            // 将这个位置标记为可以吃子的位置，并记录可以吃掉的棋子数量
            libertiesPositions.forEach(pos => {
              const [r, c] = pos.split(',').map(Number);
              if (isValidPosition([r, c])) {
                captureMoves.set(pos, group.length);
              }
            });
          }
        }
      }
    }

    return captureMoves;
  }

  private evaluateMove(move: Position, player: Player, board: Board): number {
    let score = 0;
    const [row, col] = move;

    // 位置权重评分
    score += POSITION_WEIGHTS[row][col];

    // 模拟落子
    const { newBoard, capturedCount } = makeMove(board, move, player);

    // 提子数量评分 - 增加权重以提高进攻性
    score += capturedCount * 25;

    // 检测是否是可以吃子的位置
    const captureMoves = this.detectCaptureMoves(board, player);
    const moveKey = `${row},${col}`;
    if (captureMoves.has(moveKey)) {
      // 如果这个位置可以吃子，给予额外的高分
      score += captureMoves.get(moveKey)! * 30;
    }

    // 气数评分
    const group = findGroup(newBoard, move);
    const liberties = countLiberties(newBoard, group);
    score += liberties * 5;

    // 避免被提子
    const opponent = player === 'black' ? 'white' : 'black';
    const opponentMoves = getValidMoves(newBoard, opponent, null);

    // 检查对手是否能提我们的子
    let dangerScore = 0;
    opponentMoves.forEach(oppMove => {
      const { capturedCount: oppCaptured } = makeMove(newBoard, oppMove, opponent);
      dangerScore += oppCaptured * 10;
    });

    score -= dangerScore;

    return score;
  }
}

// 蒙特卡洛树搜索 AI（困难模式）
export class MCTSAI implements IGoAI {
  private readonly simulations = 300; // 减少模拟次数以适应更大的棋盘
  private readonly explorationConstant = 1.414;
  private readonly maxTime = 2000; // 增加计算时间（毫秒）
  private startTime: number = 0;

  getDifficulty(): AIDifficulty {
    return 'hard';
  }

  async getMove(board: Board, player: Player): Promise<Position | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const validMoves = getValidMoves(board, player, null);
        if (validMoves.length === 0) return resolve(null);

        // 如果只有一个有效移动，直接返回
        if (validMoves.length === 1) return resolve(validMoves[0]);

        // 对每个可能的移动进行蒙特卡洛模拟
        const moveScores = new Map<string, { wins: number, visits: number }>();

        validMoves.forEach(move => {
          moveScores.set(`${move[0]},${move[1]}`, { wins: 0, visits: 0 });
        });

        // 设置开始时间
        this.startTime = performance.now();

        // 在时间限制内进行尽可能多的模拟
        let simulationCount = 0;
        while (performance.now() - this.startTime < this.maxTime && simulationCount < this.simulations) {
          simulationCount++;
          const moveIndex = simulationCount % validMoves.length;
          const move = validMoves[moveIndex];
          const moveKey = `${move[0]},${move[1]}`;

          // 模拟落子
          const { newBoard } = makeMove(board, move, player);

          // 随机模拟到游戏结束
          const winner = this.simulateRandomPlayout(newBoard, player === 'black' ? 'white' : 'black');

          // 更新统计
          const stats = moveScores.get(moveKey)!;
          stats.visits++;
          if (winner === player) {
            stats.wins++;
          } else if (winner === null) {
            // 平局算半胜
            stats.wins += 0.5;
          }
        }

        // 选择最佳移动（使用UCT公式）
        let bestMove = validMoves[0];
        let bestScore = -Infinity;

        moveScores.forEach((stats, key) => {
          const [row, col] = key.split(',').map(Number);
          // 使用UCT公式计算分数
          const totalVisits = simulationCount;
          const winRate = stats.visits > 0 ? stats.wins / stats.visits : 0;
          const explorationScore = stats.visits > 0 ?
            this.explorationConstant * Math.sqrt(Math.log(totalVisits) / stats.visits) : 0;
          const score = winRate + explorationScore;

          if (score > bestScore) {
            bestScore = score;
            bestMove = [row, col];
          }
        });

        resolve(bestMove);
      }, 0);
    });
  }

  private simulateRandomPlayout(board: Board, player: Player): Player | null {
    let currentBoard = JSON.parse(JSON.stringify(board));
    let currentPlayer = player;
    let passes = 0;
    const maxMoves = Math.floor(board.length * board[0].length * 0.8); // 限制最大模拟步数
    let moves = 0;

    while (passes < 2 && moves < maxMoves) {
      const validMoves = getValidMoves(currentBoard, currentPlayer, null);

      if (validMoves.length === 0) {
        passes++;
      } else {
        passes = 0;
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        const { newBoard } = makeMove(currentBoard, randomMove, currentPlayer);
        currentBoard = newBoard;
      }

      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
      moves++;
    }

    // 计算得分
    const { black, white } = calculateScore(currentBoard);
    if (black > white) return 'black';
    if (white > black) return 'white';
    return null; // 平局
  }
}

// AI 工厂
export class GoAIFactory {
  private static instances: Map<AIDifficulty, IGoAI> = new Map();

  static createAI(difficulty: AIDifficulty): IGoAI {
    // 检查是否已有实例
    const existingInstance = this.instances.get(difficulty);
    if (existingInstance) {
      return existingInstance;
    }

    // 创建新实例
    let instance: IGoAI;
    switch (difficulty) {
      case 'easy':
        instance = new RandomAI();
        break;
      case 'medium':
        instance = new HeuristicAI();
        break;
      case 'hard':
        instance = new MCTSAI();
        break;
      default:
        instance = new HeuristicAI();
    }

    // 缓存实例
    this.instances.set(difficulty, instance);
    return instance;
  }
}
