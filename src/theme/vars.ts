import { getThemeConfig } from './config';

const themeConfig = getThemeConfig();
const common = themeConfig.tokens.common;
const light = themeConfig.tokens.light;

const cssVar = (name: string, fallback: string): string => `var(${name}, ${fallback})`;

export const withThemeAlpha = (color: string, alpha: number): string => {
  const percent = Number((Math.max(0, Math.min(1, alpha)) * 100).toFixed(2));
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
};

const game2048Tiles = Object.fromEntries(
  Object.entries(light.games.game2048.tiles).map(([level, value]) => [
    level,
    cssVar(`--theme-game-2048-tile-${level}`, value),
  ]),
) as Record<string, string>;

const tetrisPieces = Object.fromEntries(
  Object.entries(light.games.tetris.pieces).map(([piece, value]) => [
    piece,
    cssVar(`--theme-game-tetris-piece-${piece.toLowerCase()}`, value),
  ]),
) as Record<'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L', string>;

const minesweeperNumbers = Object.fromEntries(
  Object.entries(light.games.minesweeper.numberColors).map(([level, value]) => [
    level,
    cssVar(`--theme-game-minesweeper-number-${level}`, value),
  ]),
) as Record<string, string>;

const hanoiPalette = light.games.hanoi.diskPalette.map((color, index) =>
  cssVar(`--theme-game-hanoi-disk-${index + 1}`, color),
);

export const themeVars = {
  colors: {
    primary: cssVar('--theme-color-brand-primary', light.semantic.brand.primary),
    primaryHover: cssVar('--theme-color-brand-primary-hover', light.semantic.brand.primaryHover),
    primaryActive: cssVar('--theme-color-brand-primary-active', light.semantic.brand.primaryActive),
    secondary: cssVar('--theme-color-surface-subtle', light.semantic.surface.subtle),
    text: cssVar('--theme-color-text-primary', light.semantic.text.primary),
    lightText: cssVar('--theme-color-text-secondary', light.semantic.text.secondary),
    mutedText: cssVar('--theme-color-text-muted', light.semantic.text.muted),
    border: cssVar('--theme-color-border-default', light.semantic.border.default),
    borderStrong: cssVar('--theme-color-border-strong', light.semantic.border.strong),
    background: cssVar('--theme-color-surface-base', light.semantic.surface.base),
    appBackground: cssVar('--theme-color-surface-app', light.semantic.surface.app),
    error: cssVar('--theme-color-status-error', light.semantic.status.error),
    success: cssVar('--theme-color-status-success', light.semantic.status.success),
    warning: cssVar('--theme-color-status-warning', light.semantic.status.warning),
    info: cssVar('--theme-color-status-info', light.semantic.status.info),
    onPrimary: cssVar('--theme-color-brand-on-primary', light.semantic.brand.onPrimary),
    primaryA10: cssVar('--theme-color-brand-primary-a10', withThemeAlpha(light.semantic.brand.primary, 0.0625)),
    primaryA20: cssVar('--theme-color-brand-primary-a20', withThemeAlpha(light.semantic.brand.primary, 0.125)),
    primaryA40: cssVar('--theme-color-brand-primary-a40', withThemeAlpha(light.semantic.brand.primary, 0.25)),
    primaryA60: cssVar('--theme-color-brand-primary-a60', withThemeAlpha(light.semantic.brand.primary, 0.375)),
    primaryA80: cssVar('--theme-color-brand-primary-a80', withThemeAlpha(light.semantic.brand.primary, 0.5)),
    primaryAcc: cssVar('--theme-color-brand-primary-acc', withThemeAlpha(light.semantic.brand.primary, 0.8)),
    primaryAdd: cssVar('--theme-color-brand-primary-add', withThemeAlpha(light.semantic.brand.primary, 0.8667)),
    overlayMask: cssVar('--theme-color-overlay-mask', light.semantic.overlay.mask),
    overlayGlass: cssVar('--theme-color-overlay-glass', light.semantic.overlay.glass),
    overlayGlassStrong: cssVar('--theme-color-overlay-glass-strong', light.semantic.overlay.glassStrong),
  },
  spacing: {
    xs: cssVar('--theme-space-xs', common.spacing.xs),
    sm: cssVar('--theme-space-sm', common.spacing.sm),
    md: cssVar('--theme-space-md', common.spacing.md),
    lg: cssVar('--theme-space-lg', common.spacing.lg),
    xl: cssVar('--theme-space-xl', common.spacing.xl),
  },
  transitions: {
    default: cssVar('--theme-motion-normal', common.transitions.normal),
    fast: cssVar('--theme-motion-fast', common.transitions.fast),
    slow: cssVar('--theme-motion-slow', common.transitions.slow),
  },
  shadows: {
    small: cssVar('--theme-shadow-sm', common.shadows.sm),
    medium: cssVar('--theme-shadow-md', common.shadows.md),
    large: cssVar('--theme-shadow-lg', common.shadows.lg),
  },
  borderRadius: {
    small: cssVar('--theme-radius-sm', common.radius.sm),
    medium: cssVar('--theme-radius-md', common.radius.md),
    large: cssVar('--theme-radius-lg', common.radius.lg),
    circle: cssVar('--theme-radius-circle', common.radius.circle),
  },
  typography: {
    fontFamilyBase: cssVar('--theme-font-family-base', common.typography.fontFamilyBase),
    fontFamilyMono: cssVar('--theme-font-family-mono', common.typography.fontFamilyMono),
    fontSizeBase: cssVar('--theme-font-size-base', common.typography.fontSizeBase),
    lineHeightBase: cssVar('--theme-line-height-base', common.typography.lineHeightBase),
  },
  cursor: {
    dotSize: cssVar('--theme-cursor-dot-size', common.cursor.dotSize),
    ringSize: cssVar('--theme-cursor-ring-size', common.cursor.ringSize),
    ringBorderWidth: cssVar('--theme-cursor-ring-border-width', common.cursor.ringBorderWidth),
    hoverScale: cssVar('--theme-cursor-hover-scale', String(common.cursor.hoverScale)),
    activeScale: cssVar('--theme-cursor-active-scale', String(common.cursor.activeScale)),
    dotActiveScale: cssVar('--theme-cursor-dot-active-scale', String(common.cursor.dotActiveScale)),
    dotBackground: cssVar('--theme-component-cursor-dot-background', light.components.cursor.dotBackground),
    dotBorder: cssVar('--theme-component-cursor-dot-border', light.components.cursor.dotBorder),
    dotShadow: cssVar('--theme-component-cursor-dot-shadow', light.components.cursor.dotShadow),
    ringBorder: cssVar('--theme-component-cursor-ring-border', light.components.cursor.ringBorder),
    ringHoverBorder: cssVar('--theme-component-cursor-ring-hover-border', light.components.cursor.ringHoverBorder),
    ringActiveBorder: cssVar('--theme-component-cursor-ring-active-border', light.components.cursor.ringActiveBorder),
    ringBackground: cssVar('--theme-component-cursor-ring-background', light.components.cursor.ringBackground),
    ringShadow: cssVar('--theme-component-cursor-ring-shadow', light.components.cursor.ringShadow),
  },
  zIndex: {
    dropdown: 'var(--theme-zindex-dropdown)',
    modal: 'var(--theme-zindex-modal)',
    toast: 'var(--theme-zindex-toast)',
    cursor: 'var(--theme-zindex-cursor)',
  },
  games: {
    game2048: {
      boardBackground: cssVar('--theme-game-2048-board-background', light.games.game2048.boardBackground),
      emptyCell: cssVar('--theme-game-2048-empty-cell', light.games.game2048.emptyCell),
      textDark: cssVar('--theme-game-2048-text-dark', light.games.game2048.textDark),
      textLight: cssVar('--theme-game-2048-text-light', light.games.game2048.textLight),
      tiles: game2048Tiles,
    },
    snake: {
      snake: cssVar('--theme-game-snake-snake', light.games.snake.snake),
      food: cssVar('--theme-game-snake-food', light.games.snake.food),
      empty: cssVar('--theme-game-snake-empty', light.games.snake.empty),
    },
    tetris: {
      pieces: tetrisPieces,
    },
    minesweeper: {
      mine: cssVar('--theme-game-minesweeper-mine', light.games.minesweeper.mine),
      flag: cssVar('--theme-game-minesweeper-flag', light.games.minesweeper.flag),
      danger: cssVar('--theme-game-minesweeper-danger', light.games.minesweeper.danger),
      numberColors: minesweeperNumbers,
    },
    sudoku: {
      errorBackground: cssVar('--theme-game-sudoku-error-background', light.games.sudoku.errorBackground),
      errorText: cssVar('--theme-game-sudoku-error-text', light.games.sudoku.errorText),
    },
    hanoi: {
      pole: cssVar('--theme-game-hanoi-pole', light.games.hanoi.pole),
      diskPalette: hanoiPalette,
    },
    reversi: {
      black: cssVar('--theme-game-reversi-black', light.games.reversi.black),
      white: cssVar('--theme-game-reversi-white', light.games.reversi.white),
      whiteBorder: cssVar('--theme-game-reversi-white-border', light.games.reversi.whiteBorder),
    },
    go: {
      board9: cssVar('--theme-game-go-board-9', light.games.go.board9),
      board19: cssVar('--theme-game-go-board-19', light.games.go.board19),
      line: cssVar('--theme-game-go-line', light.games.go.line),
      starPoint: cssVar('--theme-game-go-star-point', light.games.go.starPoint),
      blackStone: cssVar('--theme-game-go-black-stone', light.games.go.blackStone),
      whiteStone: cssVar('--theme-game-go-white-stone', light.games.go.whiteStone),
      whiteStoneBorder: cssVar('--theme-game-go-white-stone-border', light.games.go.whiteStoneBorder),
      hover: cssVar('--theme-game-go-hover', light.games.go.hover),
    },
    devilRoulette: {
      shellBackground: cssVar('--theme-game-devil-shell-background', light.games.devilRoulette.shellBackground),
      sectionBackground: cssVar('--theme-game-devil-section-background', light.games.devilRoulette.sectionBackground),
      sectionBorder: cssVar('--theme-game-devil-section-border', light.games.devilRoulette.sectionBorder),
      dealerAccent: cssVar('--theme-game-devil-dealer-accent', light.games.devilRoulette.dealerAccent),
      playerAccent: cssVar('--theme-game-devil-player-accent', light.games.devilRoulette.playerAccent),
    },
  },
} as const;

export type ThemeVars = typeof themeVars;
