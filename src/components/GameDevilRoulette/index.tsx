import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Modal, Tag } from 'antd';
import { themeVars, withThemeAlpha } from '../../theme';

type Turn = 'player' | 'dealer';

type ItemType = 'magnifier' | 'cigarette' | 'beer' | 'saw' | 'handcuff';

type Item = {
  id: ItemType;
  name: string;
  icon: string;
};

type GameState = {
  playerHealth: number;
  dealerHealth: number;
  maxHealth: number;
  playerItems: Item[];
  dealerItems: Item[];
  ammo: number[];
  currentTurn: Turn;
  isSawedOff: boolean;
  isHandcuffed: boolean;
  dealerKnowsNext: number | null;
  totalEarnings: number;
  round: number;
  isBusy: boolean;
};

type LogEntry = {
  id: number;
  message: string;
  tone: 'default' | 'info' | 'danger' | 'success';
  time: string;
};

const ITEM_POOL: Item[] = [
  { id: 'magnifier', name: '放大镜', icon: '🔍' },
  { id: 'cigarette', name: '香烟', icon: '🚬' },
  { id: 'beer', name: '啤酒', icon: '🍺' },
  { id: 'saw', name: '锯子', icon: '🪚' },
  { id: 'handcuff', name: '手铐', icon: '⛓️' },
];

const AI_DELAY = 1000;

const GameShell = styled.div`
  background: linear-gradient(
    180deg,
    ${themeVars.colors.background} 0%,
    ${themeVars.colors.secondary} 100%
  );
  border: 1px solid ${themeVars.colors.border};
  border-radius: 12px;
  padding: ${themeVars.spacing.lg};
  color: ${themeVars.colors.text};
  font-family: 'JetBrains Mono', 'SFMono-Regular', Menlo, monospace;
  box-shadow: ${themeVars.shadows.medium};
`;

const Section = styled.div`
  padding: ${themeVars.spacing.md};
  border-radius: 10px;
  background: ${themeVars.colors.background};
  border: 1px solid ${themeVars.colors.border};
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${themeVars.spacing.lg};
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.div`
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${themeVars.colors.mutedText};
  margin-bottom: ${themeVars.spacing.sm};
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: ${themeVars.spacing.sm};
`;

const ItemCard = styled.button<{ $variant?: 'dealer' | 'player'; $disabled?: boolean }>`
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'dealer'
        ? withThemeAlpha(themeVars.games.devilRoulette.dealerAccent, 0.45)
        : themeVars.colors.borderStrong};
  background: ${({ $variant }) =>
    $variant === 'dealer'
      ? withThemeAlpha(themeVars.games.devilRoulette.dealerAccent, 0.1)
      : withThemeAlpha(themeVars.colors.borderStrong, 0.2)};
  color: ${({ $variant }) =>
    $variant === 'dealer' ? themeVars.games.devilRoulette.dealerAccent : themeVars.colors.text};
  padding: ${themeVars.spacing.sm} ${themeVars.spacing.xs};
  border-radius: 8px;
  min-height: 68px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: ${({ $disabled }) => ($disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${({ $disabled }) =>
      $disabled ? 'none' : `0 8px 24px ${withThemeAlpha(themeVars.games.devilRoulette.dealerAccent, 0.15)}`};
  }
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${themeVars.spacing.sm};
`;

const HealthBar = styled.div`
  height: 12px;
  background: ${withThemeAlpha(themeVars.colors.text, 0.07)};
  border: 1px solid ${themeVars.colors.borderStrong};
  width: 100%;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 0 10px ${withThemeAlpha(themeVars.colors.text, 0.6)};
`;

const HealthFill = styled.div<{ $ratio: number; $variant: 'player' | 'dealer' }>`
  height: 100%;
  width: ${({ $ratio }) => Math.max(0, Math.min(1, $ratio)) * 100}%;
  background: ${({ $variant }) =>
    $variant === 'player'
      ? `linear-gradient(90deg, ${withThemeAlpha(themeVars.games.devilRoulette.playerAccent, 0.45)}, ${themeVars.games.devilRoulette.playerAccent})`
      : `linear-gradient(90deg, ${withThemeAlpha(themeVars.games.devilRoulette.dealerAccent, 0.45)}, ${themeVars.games.devilRoulette.dealerAccent})`};
  transition: width 0.35s ease;
  box-shadow: 0 0 12px
    ${({ $variant }) =>
      $variant === 'player'
        ? withThemeAlpha(themeVars.games.devilRoulette.playerAccent, 0.4)
        : withThemeAlpha(themeVars.games.devilRoulette.dealerAccent, 0.5)};
`;

const AmmoRow = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
`;

const AmmoIcon = styled.div<{ $type: 'live' | 'blank' }>`
  width: 12px;
  height: 22px;
  border-radius: 3px;
  background: ${({ $type }) =>
    $type === 'live' ? themeVars.games.devilRoulette.dealerAccent : themeVars.colors.borderStrong};
  box-shadow: ${({ $type }) =>
    $type === 'live'
      ? `0 0 8px ${withThemeAlpha(themeVars.games.devilRoulette.dealerAccent, 0.6)}`
      : 'none'};
`;

const GunContainer = styled.div<{ $shake?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${themeVars.spacing.md};
  margin: ${themeVars.spacing.sm} 0 ${themeVars.spacing.md};
  background: linear-gradient(
    135deg,
    ${withThemeAlpha(themeVars.colors.onPrimary, 0.02)},
    transparent
  );
  border: 1px solid ${withThemeAlpha(themeVars.colors.onPrimary, 0.04)};
  border-radius: 12px;
  transform: ${({ $shake }) => ($shake ? 'rotate(-1deg) translateY(-2px)' : 'none')};
  transition: transform 0.2s ease;
`;

const LogPanel = styled(Section)`
  height: 200px;
  overflow: auto;
  background: ${themeVars.colors.background};
  border: 1px solid ${themeVars.colors.border};
`;

const LogEntryRow = styled.div<{ $tone: LogEntry['tone'] }>`
  padding: 8px 10px;
  border-left: 2px solid
    ${({ $tone }) => {
      if ($tone === 'danger') return themeVars.games.devilRoulette.dealerAccent;
      if ($tone === 'info') return themeVars.colors.warning;
      if ($tone === 'success') return themeVars.games.devilRoulette.playerAccent;
      return themeVars.colors.borderStrong;
    }};
  color: ${({ $tone }) => {
    if ($tone === 'danger') return themeVars.colors.error;
    if ($tone === 'info') return themeVars.colors.warning;
    if ($tone === 'success') return themeVars.colors.success;
    return themeVars.colors.mutedText;
  }};
  font-size: 13px;
  display: flex;
  gap: ${themeVars.spacing.sm};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeVars.spacing.md};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${themeVars.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${themeVars.colors.mutedText};
  align-items: center;
  flex-wrap: wrap;
  gap: ${themeVars.spacing.sm};
`;

const GunInfo = styled.div`
  font-weight: 900;
  font-size: 20px;
  letter-spacing: 0.12em;
  color: ${themeVars.games.devilRoulette.dealerAccent};
  text-shadow: 0 0 6px ${withThemeAlpha(themeVars.games.devilRoulette.dealerAccent, 0.3)};
`;

const gunSvg = (
  <svg width="320" height="100" viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 40C10 40 5 45 5 60C5 75 10 85 40 85H60L55 40H10Z"
      fill={withThemeAlpha(themeVars.colors.text, 0.16)}
    />
    <rect
      x="65"
      y="65"
      width="30"
      height="15"
      rx="5"
      stroke={withThemeAlpha(themeVars.colors.text, 0.2)}
      strokeWidth="3"
    />
    <rect
      x="55"
      y="40"
      width="120"
      height="30"
      fill={withThemeAlpha(themeVars.colors.text, 0.1)}
      stroke={withThemeAlpha(themeVars.colors.text, 0.2)}
      strokeWidth="2"
    />
    <rect
      x="175"
      y="42"
      width="140"
      height="18"
      fill={withThemeAlpha(themeVars.colors.text, 0.07)}
      stroke={withThemeAlpha(themeVars.colors.text, 0.2)}
      strokeWidth="2"
    />
    <rect
      x="120"
      y="65"
      width="50"
      height="12"
      rx="2"
      fill={withThemeAlpha(themeVars.colors.text, 0.13)}
    />
  </svg>
);

const initialState: GameState = {
  playerHealth: 2,
  dealerHealth: 2,
  maxHealth: 2,
  playerItems: [],
  dealerItems: [],
  ammo: [],
  currentTurn: 'player',
  isSawedOff: false,
  isHandcuffed: false,
  dealerKnowsNext: null,
  totalEarnings: 0,
  round: 1,
  isBusy: false,
};

const GameDevilRoulette: React.FC = () => {
  const [state, setState] = useState<GameState>(initialState);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: Date.now(),
      message: '系统连接中...',
      tone: 'info',
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [result, setResult] = useState<{ open: boolean; title: string; desc: string; canContinue: boolean }>({
    open: false,
    title: '',
    desc: '',
    canContinue: false,
  });
  const [shake, setShake] = useState(false);

  const stateRef = useRef(state);
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLDivElement | null>(null);
  const dealerTurnRef = useRef<() => void>(() => {});
  const gameOverRef = useRef(false);
  const didInitRef = useRef(false);
  const refillingRef = useRef(false);

  const updateState = useCallback(
    (updater: (prev: GameState) => GameState) => {
      setState(prev => {
        const next = updater(prev);
        stateRef.current = next;
        return next;
      });
    },
    [setState],
  );

  const addLog = useCallback((message: string, tone: LogEntry['tone'] = 'default') => {
    setLogs(prev => [
      ...prev.slice(-80),
      { id: Date.now() + Math.random(), message, tone, time: new Date().toLocaleTimeString() },
    ]);
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
  }, []);

  const ammoStats = useMemo(() => {
    const live = state.ammo.filter(a => a === 1).length;
    const blank = state.ammo.filter(a => a === 0).length;
    return { live, blank };
  }, [state.ammo]);

  const fillItems = useCallback((current: Item[], count: number) => {
    const next = [...current];
    for (let i = 0; i < count && next.length < 8; i++) {
      next.push(ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)]);
    }
    return next;
  }, []);

  const createAmmo = useCallback(() => {
    const count = Math.min(8, 3 + Math.floor(Math.random() * 5)); // 3-7 发
    const liveCount = Math.max(1, Math.min(count - 1, 1 + Math.floor(Math.random() * (count - 1))));
    const blankCount = count - liveCount;
    const ammo = [...Array(liveCount).fill(1), ...Array(blankCount).fill(0)].sort(() => Math.random() - 0.5);
    return { ammo, liveCount, blankCount };
  }, []);

  const sleep = (ms: number) => new Promise<void>(resolve => schedule(() => resolve(), ms));

  const queueDealerTurn = useCallback(
    (delay = AI_DELAY) => {
      schedule(() => dealerTurnRef.current(), delay);
    },
    [schedule],
  );

  const checkTurn = useCallback(() => {
    const current = stateRef.current;
    if (refillingRef.current) return;
    if (current.currentTurn === 'dealer' && !current.isBusy && !gameOverRef.current && !result.open) {
      queueDealerTurn();
    }
  }, [queueDealerTurn, result.open]);

  const checkGameOver = useCallback(() => {
    if (gameOverRef.current) return true;

    const current = stateRef.current;
    if (current.playerHealth <= 0 || current.dealerHealth <= 0) {
      const win = current.dealerHealth <= 0;
      const newTotal = win ? current.totalEarnings + 1000 * current.round : current.totalEarnings;

      updateState(prev => ({ ...prev, isBusy: true, totalEarnings: newTotal }));
      gameOverRef.current = true;

      schedule(() => {
        setResult({
          open: true,
          title: win ? '胜利' : '终止',
          desc: win ? `奖励积累: $${newTotal}` : '你未能履行契约。',
          canContinue: win,
        });
      }, 600);
      return true;
    }
    return false;
  }, [schedule, updateState]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      timers.current.forEach(id => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    checkGameOver();
  }, [state.playerHealth, state.dealerHealth, checkGameOver]);

  const distributeItems = useCallback(() => {
    updateState(prev => {
      const count = prev.round === 1 ? 2 : 4;
      return {
        ...prev,
        playerItems: fillItems(prev.playerItems, count),
        dealerItems: fillItems(prev.dealerItems, count),
      };
    });
    addLog('道具已分发，双方可见。');
  }, [addLog, fillItems, updateState]);

  const loadAmmo = useCallback(() => {
    const { ammo, liveCount, blankCount } = createAmmo();
    updateState(prev => ({ ...prev, ammo }));
    addLog(`装填完毕: ${liveCount} 实弹, ${blankCount} 空包弹.`, 'danger');
  }, [addLog, createAmmo, updateState]);

  const refill = useCallback(async () => {
    if (refillingRef.current) return;
    refillingRef.current = true;
    updateState(prev => ({ ...prev, isBusy: true }));
    addLog('重新装填中...', 'info');
    await sleep(1000);
    loadAmmo();
    distributeItems();
    refillingRef.current = false;
    updateState(prev => ({ ...prev, isBusy: false }));
    checkTurn();
  }, [addLog, checkTurn, distributeItems, loadAmmo, updateState]);

  const switchTurn = useCallback(
    (force = false) => {
      const current = stateRef.current;
      if (current.isHandcuffed && !force) {
        addLog('对方被手铐限制。', 'info');
        updateState(prev => ({ ...prev, isHandcuffed: false, isBusy: false }));
        if (current.currentTurn === 'dealer') {
          queueDealerTurn();
        } else {
          checkTurn();
        }
        return;
      }

      const nextTurn = current.currentTurn === 'player' ? 'dealer' : 'player';
      updateState(prev => ({
        ...prev,
        currentTurn: nextTurn,
        isBusy: false,
      }));
      if (nextTurn === 'dealer') {
        queueDealerTurn();
      } else {
        checkTurn();
      }
    },
    [addLog, checkTurn, queueDealerTurn, updateState],
  );

  const useItem = useCallback(
    async (owner: Turn, index: number) => {
      if (gameOverRef.current || result.open) return;
      if (stateRef.current.isBusy) return;
      if (owner === 'player' && stateRef.current.currentTurn !== 'player') return;
      const item = owner === 'player' ? stateRef.current.playerItems[index] : stateRef.current.dealerItems[index];
      if (!item) return;

      updateState(prev => ({
        ...prev,
        isBusy: true,
        playerItems: owner === 'player' ? prev.playerItems.filter((_, i) => i !== index) : prev.playerItems,
        dealerItems: owner === 'dealer' ? prev.dealerItems.filter((_, i) => i !== index) : prev.dealerItems,
      }));

      addLog(`${owner === 'player' ? '你' : '发牌者'} 使用了 [${item.name}]`, owner === 'player' ? 'info' : 'danger');
    await sleep(600);
    await sleep(AI_DELAY - 600 > 0 ? AI_DELAY - 600 : 0);

      switch (item.id) {
        case 'magnifier': {
          const next = stateRef.current.ammo[0];
          if (next !== undefined) {
            if (owner === 'player') {
              addLog(
                `查看枪膛... 下一发是: ${
                  next === 1
                    ? `<span style="color:${themeVars.games.devilRoulette.dealerAccent}">实弹</span>`
                    : `<span style="color:${themeVars.colors.mutedText}">空包弹</span>`
                }`,
              );
            } else {
              updateState(prev => ({ ...prev, dealerKnowsNext: next }));
            }
          }
          break;
        }
        case 'cigarette': {
          updateState(prev => {
            if (owner === 'player') {
              return { ...prev, playerHealth: Math.min(prev.maxHealth, prev.playerHealth + 1) };
            }
            return { ...prev, dealerHealth: Math.min(prev.maxHealth, prev.dealerHealth + 1) };
          });
          break;
        }
        case 'saw': {
          updateState(prev => ({ ...prev, isSawedOff: true }));
          break;
        }
        case 'handcuff': {
          updateState(prev => ({ ...prev, isHandcuffed: true }));
          break;
        }
        case 'beer': {
          const out = stateRef.current.ammo[0];
          updateState(prev => ({ ...prev, ammo: prev.ammo.slice(1), dealerKnowsNext: null }));
          addLog(`退弹: ${out === 1 ? '实弹' : '空包弹'}`);
          const willRefill = stateRef.current.ammo.length <= 1 && stateRef.current.playerHealth > 0 && stateRef.current.dealerHealth > 0;
          if (willRefill) await refill();
          break;
        }
      }

      updateState(prev => ({ ...prev, isBusy: false }));
      if (owner === 'dealer') {
        queueDealerTurn();
      } else {
        checkTurn();
      }
    },
    [addLog, checkTurn, queueDealerTurn, refill, updateState],
  );

  const fire = useCallback(
    async (target: 'self' | 'opponent') => {
      const current = stateRef.current;
      if (current.isBusy || current.ammo.length === 0) return;

      updateState(prev => ({ ...prev, isBusy: true }));
      setShake(true);
      schedule(() => setShake(false), 220);

      const bullet = current.ammo[0];
      updateState(prev => ({ ...prev, ammo: prev.ammo.slice(1) }));

      const shooter = current.currentTurn;
      addLog(`${shooter === 'player' ? '你' : '发牌者'} 扣动了扳机...`);
      await sleep(1000);

      const damage = current.isSawedOff ? 2 : 1;

      if (bullet === 1) {
        addLog('砰！实弹。', 'danger');
        updateState(prev => {
          if (shooter === 'player') {
            if (target === 'self') {
              return { ...prev, playerHealth: Math.max(0, prev.playerHealth - damage), isSawedOff: false };
            }
            return { ...prev, dealerHealth: Math.max(0, prev.dealerHealth - damage), isSawedOff: false };
          }
          if (target === 'self') {
            return { ...prev, dealerHealth: Math.max(0, prev.dealerHealth - damage), isSawedOff: false };
          }
          return { ...prev, playerHealth: Math.max(0, prev.playerHealth - damage), isSawedOff: false };
        });
        if (!checkGameOver()) {
          await sleep(AI_DELAY);
          switchTurn(false);
        }
      } else {
        addLog('咔。空包弹。', 'info');
        updateState(prev => ({ ...prev, isSawedOff: false }));
        if (target === 'self') {
          addLog('额外获得一个回合。', 'success');
          await sleep(AI_DELAY);
          updateState(prev => ({ ...prev, isBusy: false }));
          if (shooter === 'dealer') {
            queueDealerTurn();
          } else {
            checkTurn();
          }
        } else {
          await sleep(AI_DELAY);
          switchTurn(false);
        }
      }

    if (gameOverRef.current) {
      return;
    }

    if (stateRef.current.ammo.length === 0 && stateRef.current.playerHealth > 0 && stateRef.current.dealerHealth > 0) {
      await refill();
    } else {
      updateState(prev => ({ ...prev, isBusy: false }));
    }

      updateState(prev => ({ ...prev, dealerKnowsNext: null }));
    },
    [addLog, checkGameOver, checkTurn, refill, schedule, switchTurn, updateState],
  );

  const dealerTurn = useCallback(async () => {
    const current = stateRef.current;
    if (current.currentTurn !== 'dealer' || gameOverRef.current || result.open) return;
    if (current.isBusy || refillingRef.current) return;

    if (current.ammo.length === 0) {
      await refill();
      checkTurn();
      return;
    }

    const liveCount = current.ammo.filter(a => a === 1).length;
    const liveProb = liveCount / current.ammo.length;

    const cigIdx = current.dealerItems.findIndex(i => i.id === 'cigarette');
    if (cigIdx !== -1 && current.dealerHealth < current.maxHealth) return useItem('dealer', cigIdx);

    const magIdx = current.dealerItems.findIndex(i => i.id === 'magnifier');
    if (magIdx !== -1 && current.dealerKnowsNext === null) return useItem('dealer', magIdx);

    if (current.dealerKnowsNext === 1 || (current.dealerKnowsNext === null && liveProb >= 0.7)) {
      const sawIdx = current.dealerItems.findIndex(i => i.id === 'saw');
      if (sawIdx !== -1 && !current.isSawedOff) return useItem('dealer', sawIdx);
      const hcIdx = current.dealerItems.findIndex(i => i.id === 'handcuff');
      if (hcIdx !== -1 && !current.isHandcuffed) return useItem('dealer', hcIdx);
    }

    if (stateRef.current.dealerKnowsNext === 1) return fire('opponent');
    if (stateRef.current.dealerKnowsNext === 0) return fire('self');
    return liveProb > 0.5 ? fire('opponent') : fire('self');
  }, [fire, useItem]);

  useEffect(() => {
    dealerTurnRef.current = dealerTurn;
  }, [dealerTurn]);

  const playerAction = useCallback(
    (target: 'self' | 'opponent') => {
      const current = stateRef.current;
      if (gameOverRef.current || result.open) return;
      if (current.isBusy || current.currentTurn !== 'player') return;
      fire(target);
    },
    [fire, result.open],
  );

  const initRound = useCallback(
    (resetItems = false) => {
      gameOverRef.current = false;
      updateState(prev => {
        const maxHealth = Math.min(6, 2 + Math.floor(prev.round / 2));
        return {
          ...prev,
          maxHealth,
          playerHealth: maxHealth,
          dealerHealth: maxHealth,
          currentTurn: 'player',
          isHandcuffed: false,
          isSawedOff: false,
          dealerKnowsNext: null,
          isBusy: true,
          ammo: [],
          playerItems: resetItems ? [] : prev.playerItems,
          dealerItems: resetItems ? [] : prev.dealerItems,
        };
      });
      setResult({ open: false, title: '', desc: '', canContinue: false });
      addLog(`第 ${stateRef.current.round} 轮博弈开始.`, 'info');
      loadAmmo();
      distributeItems();
      updateState(prev => ({ ...prev, isBusy: false }));
      checkTurn();
    },
    [addLog, checkTurn, distributeItems, loadAmmo, updateState],
  );

  const resetGame = useCallback(() => {
    updateState(() => initialState);
    initRound(true);
  }, [initRound, updateState]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    initRound();
  }, [initRound]);

  const controlsLocked = state.isBusy || state.currentTurn !== 'player' || result.open || gameOverRef.current;

  return (
    <GameShell>
      <Header>
        <Section>
          <SectionTitle>Dealer&apos;s Inventory [发牌者道具]</SectionTitle>
          <ItemGrid>
            {state.dealerItems.map((item, idx) => (
              <ItemCard key={`${item.id}-${idx}`} $variant="dealer" $disabled>
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <div>{item.name}</div>
              </ItemCard>
            ))}
            {state.dealerItems.length === 0 && <div className="text-gray-600 text-xs">等待发牌...</div>}
          </ItemGrid>
        </Section>

        <Section>
          <SectionTitle>Status</SectionTitle>
          <StatRow>
            <div style={{ minWidth: 60, textAlign: 'right' }}>DEALER</div>
            <HealthBar>
              <HealthFill $ratio={state.dealerHealth / state.maxHealth} $variant="dealer" />
            </HealthBar>
          </StatRow>
          <StatRow style={{ marginTop: 8 }}>
            <div style={{ minWidth: 60, textAlign: 'right' }}>YOU</div>
            <HealthBar>
              <HealthFill $ratio={state.playerHealth / state.maxHealth} $variant="player" />
            </HealthBar>
          </StatRow>

          <div style={{ marginTop: themeVars.spacing.md }}>
            <SectionTitle>Ammo</SectionTitle>
            <AmmoRow>
              {Array.from({ length: ammoStats.live }).map((_, idx) => (
                <AmmoIcon key={`live-${idx}`} $type="live" />
              ))}
              {Array.from({ length: ammoStats.blank }).map((_, idx) => (
                <AmmoIcon key={`blank-${idx}`} $type="blank" />
              ))}
              {state.ammo.length === 0 && <span className="text-gray-500 text-xs">空</span>}
            </AmmoRow>
          </div>

          <div style={{ marginTop: themeVars.spacing.sm, textAlign: 'right' }}>
            <GunInfo>{state.isSawedOff ? 'SAWED OFF' : 'READY'}</GunInfo>
          </div>
        </Section>
      </Header>

      <GunContainer $shake={shake}>{gunSvg}</GunContainer>

      <Section>
        <SectionTitle>Action Log</SectionTitle>
        <LogPanel ref={logRef}>
          {logs.map(log => (
            <LogEntryRow key={log.id} $tone={log.tone}>
              <span style={{ opacity: 0.45 }}>{log.time}</span>
              <span dangerouslySetInnerHTML={{ __html: log.message }} />
            </LogEntryRow>
          ))}
        </LogPanel>
      </Section>

      <Actions>
        <div>
          <SectionTitle>Your Inventory [玩家道具]</SectionTitle>
          <ItemGrid>
            {state.playerItems.map((item, idx) => (
              <ItemCard
                key={`${item.id}-${idx}`}
                $variant="player"
                disabled={controlsLocked}
                onClick={() => useItem('player', idx)}
                $disabled={controlsLocked}
              >
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <div>{item.name}</div>
              </ItemCard>
            ))}
            {state.playerItems.length === 0 && <div className="text-gray-600 text-xs">等待发牌...</div>}
          </ItemGrid>
        </div>

        <ActionButtons>
          <Button
            type="default"
            size="large"
            onClick={() => playerAction('self')}
            disabled={controlsLocked}
          >
            对自己
          </Button>
          <Button
            danger
            type="primary"
            size="large"
            onClick={() => playerAction('opponent')}
            disabled={controlsLocked}
          >
            对发牌者
          </Button>
        </ActionButtons>

        <FooterRow>
          <div>
            <Tag color={state.currentTurn === 'player' ? 'green' : 'red'}>
              {state.currentTurn === 'player' ? '你的回合' : '发牌者回合'}
            </Tag>
            <span style={{ marginLeft: 8 }}>Round {state.round}</span>
          </div>
          <div>累积奖励：${state.totalEarnings}</div>
        </FooterRow>
      </Actions>

      <Modal
        open={result.open}
        onCancel={() => setResult(prev => ({ ...prev, open: false }))}
        footer={null}
        centered
        title={result.title}
        closable={false}
        maskClosable={false}
      >
        <p>{result.desc}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {result.canContinue && (
            <Button
              type="primary"
              onClick={() => {
                updateState(prev => ({ ...prev, round: prev.round + 1 }));
                setResult({ open: false, title: '', desc: '', canContinue: false });
                initRound();
              }}
            >
              下一关
            </Button>
          )}
          <Button onClick={resetGame} danger>
            重新开始
          </Button>
        </div>
      </Modal>
    </GameShell>
  );
};

export default GameDevilRoulette;
