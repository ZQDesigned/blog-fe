import { Board, Player, Position, IReversiAI, AIDifficulty, POSITION_WEIGHTS } from './types';
import { getValidMoves, makeMove, getFlippableDiscs } from './utils';
import { MCTSAI } from './mcts';

// 贪心策略 AI（简单模式）
export class GreedyAI implements IReversiAI {
  getDifficulty(): AIDifficulty {
    return 'easy';
  }

  async getMove(board: Board, player: Player): Promise<Position | null> {
    const validMoves = getValidMoves(player, board);
    if (validMoves.length === 0) return null;

    let bestMove = validMoves[0];
    let maxFlips = 0;

    validMoves.forEach(move => {
      const flips = getFlippableDiscs(move, player, board).length;
      if (flips > maxFlips) {
        maxFlips = flips;
        bestMove = move;
      }
    });

    return bestMove;
  }
}

// 启发式策略 AI（中等模式）
export class HeuristicAI implements IReversiAI {
  getDifficulty(): AIDifficulty {
    return 'medium';
  }

  async getMove(board: Board, player: Player): Promise<Position | null> {
    const validMoves = getValidMoves(player, board);
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

  private evaluateMove(move: Position, player: Player, board: Board): number {
    let score = 0;
    const [row, col] = move;
    const flips = getFlippableDiscs(move, player, board);

    // 位置权重评分
    score += POSITION_WEIGHTS[row][col];

    // 翻转数量评分
    score += flips.length * 10;

    // 行动力评分（对手下一步可用位置数量）
    const newBoard = makeMove(move, player, board);
    const opponent = player === 'black' ? 'white' : 'black';
    const opponentMoves = getValidMoves(opponent, newBoard);
    score -= opponentMoves.length * 5;

    return score;
  }
}

// 极小化极大策略 AI（困难模式）
export class MinimaxAI implements IReversiAI {
  private readonly searchDepth = 5;

  getDifficulty(): AIDifficulty {
    return 'hard';
  }

  async getMove(board: Board, player: Player): Promise<Position | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const [, bestMove] = this.minimax(
          board,
          this.searchDepth,
          -Infinity,
          Infinity,
          true,
          player
        );
        resolve(bestMove);
      }, 500);
    });
  }

  private minimax(
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean,
    player: Player
  ): [number, Position | null] {
    if (depth === 0) {
      return [this.evaluateBoard(board, player), null];
    }

    const moves = getValidMoves(player, board);
    if (moves.length === 0) {
      return [this.evaluateBoard(board, player), null];
    }

    const opponent = player === 'black' ? 'white' : 'black';
    let bestMove: Position | null = null;

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newBoard = makeMove(move, player, board);
        const [evaluation] = this.minimax(
          newBoard,
          depth - 1,
          alpha,
          beta,
          false,
          opponent
        );
        if (evaluation > maxEval) {
          maxEval = evaluation;
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return [maxEval, bestMove];
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newBoard = makeMove(move, player, board);
        const [evaluation] = this.minimax(
          newBoard,
          depth - 1,
          alpha,
          beta,
          true,
          opponent
        );
        if (evaluation < minEval) {
          minEval = evaluation;
          bestMove = move;
        }
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return [minEval, bestMove];
    }
  }

  private evaluateBoard(board: Board, player: Player): number {
    let score = 0;
    const opponent = player === 'black' ? 'white' : 'black';

    // 位置权重评分
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === player) {
          score += POSITION_WEIGHTS[i][j];
        } else if (board[i][j] === opponent) {
          score -= POSITION_WEIGHTS[i][j];
        }
      }
    }

    // 行动力评分
    const playerMoves = getValidMoves(player, board).length;
    const opponentMoves = getValidMoves(opponent, board).length;
    score += (playerMoves - opponentMoves) * 5;

    return score;
  }
}

// AI 工厂
export class ReversiAIFactory {
  private static instances: Map<AIDifficulty, IReversiAI> = new Map();

  static createAI(difficulty: AIDifficulty): IReversiAI {
    // 检查是否已有实例
    const existingInstance = this.instances.get(difficulty);
    if (existingInstance) {
      return existingInstance;
    }

    // 创建新实例
    let instance: IReversiAI;
    switch (difficulty) {
      case 'easy':
        instance = new GreedyAI();
        break;
      case 'medium':
        instance = new HeuristicAI();
        break;
      case 'hard':
        instance = new MinimaxAI();
        break;
      case 'hell':
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
