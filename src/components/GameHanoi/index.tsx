import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Modal, Select } from 'antd';
import { themeVars } from '../../theme';

const GameContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: ${themeVars.spacing.lg};
  outline: none;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${themeVars.spacing.md};
  flex-wrap: wrap;
  gap: ${themeVars.spacing.sm};
`;

const GameInfo = styled.div`
  display: flex;
  gap: ${themeVars.spacing.md};
`;

const InfoItem = styled.div`
  background: ${themeVars.colors.border};
  padding: ${themeVars.spacing.sm} ${themeVars.spacing.md};
  border-radius: 4px;
  color: ${themeVars.colors.text};
  font-weight: bold;
`;

const GameBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${themeVars.spacing.lg};
`;

const TowersContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: ${themeVars.spacing.lg};
  gap: ${themeVars.spacing.md};

  @media (max-width: 500px) {
    gap: ${themeVars.spacing.xs};
  }
`;

const Tower = styled.div<{ $disksCount: number }>`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  flex: 1;
  position: relative;
  cursor: pointer;
  padding-top: ${themeVars.spacing.lg};
  padding-bottom: 8px;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 8px;
    width: 8px;
    background-color: ${themeVars.games.hanoi.pole};
    border-radius: 4px;
    z-index: 1;
    height: calc(max(140px, ${props => (props.$disksCount * 20 + 40)}px));
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 8px;
    width: 80%;
    background-color: ${themeVars.games.hanoi.pole};
    border-radius: 4px;
    z-index: 3;
  }
`;

const Disk = styled.div<{ $size: number; $color: string; $total: number }>`
  height: 20px;
  width: ${props => 40 + (props.$size * 20)}px;
  background-color: ${props => props.$color};
  border-radius: 10px;
  margin-bottom: 0;
  z-index: 2;
  transition: all 0.3s ease;
  
  @media (max-width: 500px) {
    height: 16px;
    width: ${props => 30 + (props.$size * 15)}px;
    border-radius: 8px;
    margin-bottom: 0;
  }
`;

const DifficultySelect = styled(Select)`
  width: 120px;
`;

interface HanoiState {
  towers: number[][];
  selectedTower: number | null;
  moves: number;
  disksCount: number;
  gameComplete: boolean;
}

const DISK_COLORS = [
  themeVars.games.hanoi.diskPalette[0],
  themeVars.games.hanoi.diskPalette[1],
  themeVars.games.hanoi.diskPalette[2],
  themeVars.games.hanoi.diskPalette[3],
  themeVars.games.hanoi.diskPalette[4],
  themeVars.games.hanoi.diskPalette[5],
  themeVars.games.hanoi.diskPalette[6],
  themeVars.games.hanoi.diskPalette[7],
  themeVars.games.hanoi.diskPalette[8],
];

const GameHanoi: React.FC = () => {
  const [state, setState] = useState<HanoiState>({
    towers: [[], [], []],
    selectedTower: null,
    moves: 0,
    disksCount: 3,
    gameComplete: false
  });

  // 初始化游戏
  const initGame = useCallback((disksCount: number) => {
    const firstTower = Array.from({ length: disksCount }, (_, i) => disksCount - i);
    setState({
      towers: [firstTower, [], []],
      selectedTower: null,
      moves: 0,
      disksCount,
      gameComplete: false
    });
  }, []);

  // 检查游戏是否完成
  const checkGameComplete = useCallback((towers: number[][]) => {
    return towers[2].length === state.disksCount;
  }, [state.disksCount]);

  // 处理塔的点击事件
  const handleTowerClick = (towerIndex: number) => {
    const { selectedTower, towers } = state;

    // 如果没有选中的塔，则选中当前塔（如果该塔有圆盘）
    if (selectedTower === null) {
      if (towers[towerIndex].length > 0) {
        setState({ ...state, selectedTower: towerIndex });
      }
      return;
    }

    // 如果点击的是已选中的塔，则取消选中
    if (selectedTower === towerIndex) {
      setState({ ...state, selectedTower: null });
      return;
    }

    // 尝试移动圆盘
    const sourceTopDisk = towers[selectedTower][towers[selectedTower].length - 1];
    const targetTopDisk = towers[towerIndex].length > 0 ? towers[towerIndex][towers[towerIndex].length - 1] : Infinity;

    // 检查移动是否合法（小圆盘可以放在大圆盘上）
    if (sourceTopDisk < targetTopDisk) {
      const newTowers = towers.map((tower, i) => {
        if (i === selectedTower) {
          return tower.slice(0, -1); // 移除源塔顶部的圆盘
        }
        if (i === towerIndex) {
          return [...tower, sourceTopDisk]; // 将圆盘添加到目标塔
        }
        return tower;
      });

      const newMoves = state.moves + 1;
      const gameComplete = checkGameComplete(newTowers);

      setState({
        ...state,
        towers: newTowers,
        selectedTower: null,
        moves: newMoves,
        gameComplete
      });
    } else {
      // 移动不合法，取消选中
      setState({ ...state, selectedTower: null });
    }
  };

  // 处理难度变更
  const handleDifficultyChange = (value: number) => {
    initGame(value);
  };

  // 初始化游戏
  useEffect(() => {
    initGame(state.disksCount);
  }, []);

  return (
    <GameContainer>
      <GameControls>
        <GameInfo>
          <InfoItem>步数: {state.moves}</InfoItem>
          <InfoItem>最少步数: {Math.pow(2, state.disksCount) - 1}</InfoItem>
        </GameInfo>
        <div>
          <DifficultySelect
            value={state.disksCount}
            // @ts-expect-error Select 组件的 onChange 类型不匹配
            onChange={handleDifficultyChange}
            options={[
              { value: 3, label: '简单 (3)' },
              { value: 4, label: '中等 (4)' },
              { value: 5, label: '困难 (5)' },
              { value: 6, label: '专家 (6)' },
              { value: 7, label: '大师 (7)' },
            ]}
          />
          <Button
            onClick={() => initGame(state.disksCount)}
            style={{ marginLeft: themeVars.spacing.sm }}
          >
            重新开始
          </Button>
        </div>
      </GameControls>

      <GameBoard>
        <TowersContainer>
          {state.towers.map((tower, index) => (
            <Tower
              key={index}
              onClick={() => handleTowerClick(index)}
              $disksCount={state.disksCount}
              style={{
                border: state.selectedTower === index ? `2px solid ${themeVars.colors.primary}` : 'none',
                borderRadius: '8px',
              }}
            >
              {tower.map((diskSize, diskIndex) => (
                <Disk
                  key={diskIndex}
                  $size={diskSize}
                  $color={DISK_COLORS[diskSize - 1] || DISK_COLORS[0]}
                  $total={state.disksCount}
                />
              ))}
            </Tower>
          ))}
        </TowersContainer>
      </GameBoard>

      <Modal
        title="恭喜！"
        open={state.gameComplete}
        onOk={() => initGame(state.disksCount)}
        onCancel={() => setState({ ...state, gameComplete: false })}
        okText="再来一局"
        cancelText="关闭"
      >
        <p>你成功完成了汉诺塔！</p>
        <p>移动次数: {state.moves}</p>
        <p>最少步数: {Math.pow(2, state.disksCount) - 1}</p>
        {state.moves === Math.pow(2, state.disksCount) - 1 && (
          <p style={{ color: themeVars.colors.primary, fontWeight: 'bold' }}>
            太棒了！你用最少的步数完成了挑战！
          </p>
        )}
      </Modal>
    </GameContainer>
  );
};

export default GameHanoi;
