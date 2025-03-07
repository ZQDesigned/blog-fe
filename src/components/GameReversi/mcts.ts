import { Board, Player, Position, IReversiAI, MCTSNode, CORNERS, DANGER_ZONES } from './types';
import { getValidMoves, makeMove, calculateScores } from './utils';

export class MCTSAI implements IReversiAI {
  private readonly maxTime = 1500; // 最大计算时间（毫秒）
  private readonly explorationConstant = 1.414; // UCT 探索常数
  private startTime: number = 0;

  getDifficulty() {
    return 'hell' as const;
  }

  async getMove(board: Board, player: Player): Promise<Position | null> {
    const validMoves = getValidMoves(player, board);
    if (validMoves.length === 0) return null;

    // 如果有角落位置可下，直接选择角落
    const cornerMove = validMoves.find(move => 
      CORNERS.some(([r, c]) => r === move[0] && c === move[1])
    );
    if (cornerMove) return cornerMove;

    // 避免危险区域，除非没有其他选择
    const safeMoves = validMoves.filter(move => 
      !DANGER_ZONES.some(([r, c]) => r === move[0] && c === move[1])
    );
    if (safeMoves.length > 0) {
      validMoves.length = 0;
      validMoves.push(...safeMoves);
    }

    return new Promise(resolve => {
      // 使用 setTimeout 确保 UI 不被阻塞
      setTimeout(() => {
        this.startTime = performance.now();
        const rootNode = this.createNode(board, player, null, null);
        const bestMove = this.findBestMove(rootNode);
        resolve(bestMove);
      }, 0);
    });
  }

  private createNode(board: Board, player: Player, move: Position | null, parent: MCTSNode | null): MCTSNode {
    return {
      board,
      player,
      move,
      parent,
      children: [],
      visits: 0,
      wins: 0,
      untriedMoves: getValidMoves(player, board),
    };
  }

  private findBestMove(rootNode: MCTSNode): Position | null {
    while (performance.now() - this.startTime < this.maxTime) {
      const node = this.select(rootNode);
      const winner = this.simulate(node);
      this.backpropagate(node, winner);
    }

    // 选择访问次数最多的子节点
    if (rootNode.children.length === 0) return null;
    
    const bestChild = rootNode.children.reduce((best, child) => 
      child.visits > best.visits ? child : best
    );

    return bestChild.move;
  }

  private select(node: MCTSNode): MCTSNode {
    while (node.untriedMoves.length === 0 && node.children.length > 0) {
      node = this.selectUCT(node);
    }

    // 如果还有未尝试的移动，创建新节点
    if (node.untriedMoves.length > 0) {
      const move = this.selectRandomMove(node.untriedMoves);
      const nextBoard = makeMove(move, node.player, node.board);
      const nextPlayer = node.player === 'black' ? 'white' : 'black';
      
      const childNode = this.createNode(nextBoard, nextPlayer, move, node);
      node.children.push(childNode);
      return childNode;
    }

    return node;
  }

  private selectUCT(node: MCTSNode): MCTSNode {
    const totalVisits = node.visits;
    return node.children.reduce((selected, child) => {
      const uctValue = 
        (child.wins / child.visits) + 
        this.explorationConstant * Math.sqrt(Math.log(totalVisits) / child.visits);
      
      if (!selected || uctValue > selected.uctValue) {
        return { node: child, uctValue };
      }
      return selected;
    }, { node: null as unknown as MCTSNode, uctValue: -Infinity }).node;
  }

  private simulate(node: MCTSNode): Player | null {
    let currentBoard = JSON.parse(JSON.stringify(node.board));
    let currentPlayer = node.player;
    let consecutivePasses = 0;

    // 快速模拟到游戏结束
    while (consecutivePasses < 2 && performance.now() - this.startTime < this.maxTime) {
      const moves = getValidMoves(currentPlayer, currentBoard);
      
      if (moves.length === 0) {
        consecutivePasses++;
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        continue;
      }
      
      consecutivePasses = 0;
      const move = this.selectRandomMove(moves);
      currentBoard = makeMove(move, currentPlayer, currentBoard);
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }

    // 确定获胜者
    const scores = calculateScores(currentBoard);
    if (scores.black > scores.white) return 'black';
    if (scores.white > scores.black) return 'white';
    return null;
  }

  private backpropagate(node: MCTSNode, winner: Player | null) {
    while (node !== null) {
      node.visits++;
      if (winner === node.player) {
        node.wins++;
      } else if (winner === null) {
        node.wins += 0.5; // 平局算半胜
      }
      node = node.parent!;
    }
  }

  private selectRandomMove(moves: Position[]): Position {
    return moves[Math.floor(Math.random() * moves.length)];
  }
} 