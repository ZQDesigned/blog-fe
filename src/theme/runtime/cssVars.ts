import type {
  ResolvedThemeMode,
  ThemeConfigCenter,
  ThemeRuntimeTokens,
} from '../types';
import { buildRuntimeTokens } from './tokens';

const withAlpha = (color: string, alpha: number): string => {
  const percent = Number((Math.max(0, Math.min(1, alpha)) * 100).toFixed(2));
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
};

const toCssVarRecord = (tokens: ThemeRuntimeTokens): Record<string, string> => {
  const cssVars: Record<string, string> = {
    '--theme-font-family-base': tokens.typography.fontFamilyBase,
    '--theme-font-family-mono': tokens.typography.fontFamilyMono,
    '--theme-font-size-base': tokens.typography.fontSizeBase,
    '--theme-line-height-base': tokens.typography.lineHeightBase,

    '--theme-cursor-dot-size': tokens.cursor.dotSize,
    '--theme-cursor-ring-size': tokens.cursor.ringSize,
    '--theme-cursor-ring-border-width': tokens.cursor.ringBorderWidth,
    '--theme-cursor-hover-scale': String(tokens.cursor.hoverScale),
    '--theme-cursor-active-scale': String(tokens.cursor.activeScale),
    '--theme-cursor-dot-active-scale': String(tokens.cursor.dotActiveScale),
    '--theme-cursor-follow-ease': String(tokens.cursor.followEase),
    '--theme-cursor-click-particles': String(tokens.cursor.clickParticles),
    '--theme-cursor-click-min-distance': String(tokens.cursor.clickParticleMinDistance),
    '--theme-cursor-click-max-distance': String(tokens.cursor.clickParticleMaxDistance),
    '--theme-cursor-click-duration-ms': String(tokens.cursor.clickParticleDurationMs),
    '--theme-cursor-particle-size': tokens.cursor.particleSize,

    '--theme-space-xs': tokens.spacing.xs,
    '--theme-space-sm': tokens.spacing.sm,
    '--theme-space-md': tokens.spacing.md,
    '--theme-space-lg': tokens.spacing.lg,
    '--theme-space-xl': tokens.spacing.xl,

    '--theme-radius-sm': tokens.radius.sm,
    '--theme-radius-md': tokens.radius.md,
    '--theme-radius-lg': tokens.radius.lg,
    '--theme-radius-circle': tokens.radius.circle,

    '--theme-shadow-sm': tokens.shadows.sm,
    '--theme-shadow-md': tokens.shadows.md,
    '--theme-shadow-lg': tokens.shadows.lg,

    '--theme-motion-fast': tokens.transitions.fast,
    '--theme-motion-normal': tokens.transitions.normal,
    '--theme-motion-slow': tokens.transitions.slow,

    '--theme-zindex-dropdown': String(tokens.zIndex.dropdown),
    '--theme-zindex-modal': String(tokens.zIndex.modal),
    '--theme-zindex-toast': String(tokens.zIndex.toast),
    '--theme-zindex-cursor': String(tokens.zIndex.cursor),

    '--theme-color-brand-primary': tokens.semantic.brand.primary,
    '--theme-color-brand-primary-hover': tokens.semantic.brand.primaryHover,
    '--theme-color-brand-primary-active': tokens.semantic.brand.primaryActive,
    '--theme-color-brand-on-primary': tokens.semantic.brand.onPrimary,
    '--theme-color-brand-primary-a10': withAlpha(tokens.semantic.brand.primary, 0.0625),
    '--theme-color-brand-primary-a20': withAlpha(tokens.semantic.brand.primary, 0.125),
    '--theme-color-brand-primary-a40': withAlpha(tokens.semantic.brand.primary, 0.25),
    '--theme-color-brand-primary-a60': withAlpha(tokens.semantic.brand.primary, 0.375),
    '--theme-color-brand-primary-a80': withAlpha(tokens.semantic.brand.primary, 0.5),
    '--theme-color-brand-primary-acc': withAlpha(tokens.semantic.brand.primary, 0.8),
    '--theme-color-brand-primary-add': withAlpha(tokens.semantic.brand.primary, 0.8667),

    '--theme-color-text-primary': tokens.semantic.text.primary,
    '--theme-color-text-secondary': tokens.semantic.text.secondary,
    '--theme-color-text-muted': tokens.semantic.text.muted,
    '--theme-color-text-inverse': tokens.semantic.text.inverse,

    '--theme-color-surface-app': tokens.semantic.surface.app,
    '--theme-color-surface-base': tokens.semantic.surface.base,
    '--theme-color-surface-raised': tokens.semantic.surface.raised,
    '--theme-color-surface-subtle': tokens.semantic.surface.subtle,

    '--theme-color-border-default': tokens.semantic.border.default,
    '--theme-color-border-strong': tokens.semantic.border.strong,
    '--theme-color-border-inverse': tokens.semantic.border.inverse,

    '--theme-color-status-success': tokens.semantic.status.success,
    '--theme-color-status-warning': tokens.semantic.status.warning,
    '--theme-color-status-error': tokens.semantic.status.error,
    '--theme-color-status-info': tokens.semantic.status.info,

    '--theme-color-overlay-mask': tokens.semantic.overlay.mask,
    '--theme-color-overlay-glass': tokens.semantic.overlay.glass,
    '--theme-color-overlay-glass-strong': tokens.semantic.overlay.glassStrong,

    '--theme-color-scrollbar-track': tokens.semantic.scrollbar.track,
    '--theme-color-scrollbar-thumb-start': tokens.semantic.scrollbar.thumbStart,
    '--theme-color-scrollbar-thumb-end': tokens.semantic.scrollbar.thumbEnd,

    '--theme-component-menu-pill-background': tokens.components.menu.pillBackground,
    '--theme-component-menu-pill-border': tokens.components.menu.pillBorder,
    '--theme-component-card-backdrop': tokens.components.card.backdrop,
    '--theme-component-cursor-dot-background': tokens.components.cursor.dotBackground,
    '--theme-component-cursor-dot-border': tokens.components.cursor.dotBorder,
    '--theme-component-cursor-dot-shadow': tokens.components.cursor.dotShadow,
    '--theme-component-cursor-ring-border': tokens.components.cursor.ringBorder,
    '--theme-component-cursor-ring-hover-border': tokens.components.cursor.ringHoverBorder,
    '--theme-component-cursor-ring-active-border': tokens.components.cursor.ringActiveBorder,
    '--theme-component-cursor-ring-background': tokens.components.cursor.ringBackground,
    '--theme-component-cursor-ring-shadow': tokens.components.cursor.ringShadow,

    '--theme-game-2048-board-background': tokens.games.game2048.boardBackground,
    '--theme-game-2048-empty-cell': tokens.games.game2048.emptyCell,
    '--theme-game-2048-text-dark': tokens.games.game2048.textDark,
    '--theme-game-2048-text-light': tokens.games.game2048.textLight,

    '--theme-game-snake-snake': tokens.games.snake.snake,
    '--theme-game-snake-food': tokens.games.snake.food,
    '--theme-game-snake-empty': tokens.games.snake.empty,

    '--theme-game-minesweeper-mine': tokens.games.minesweeper.mine,
    '--theme-game-minesweeper-flag': tokens.games.minesweeper.flag,
    '--theme-game-minesweeper-danger': tokens.games.minesweeper.danger,

    '--theme-game-sudoku-error-background': tokens.games.sudoku.errorBackground,
    '--theme-game-sudoku-error-text': tokens.games.sudoku.errorText,

    '--theme-game-hanoi-pole': tokens.games.hanoi.pole,

    '--theme-game-reversi-black': tokens.games.reversi.black,
    '--theme-game-reversi-white': tokens.games.reversi.white,
    '--theme-game-reversi-white-border': tokens.games.reversi.whiteBorder,

    '--theme-game-go-board-9': tokens.games.go.board9,
    '--theme-game-go-board-19': tokens.games.go.board19,
    '--theme-game-go-line': tokens.games.go.line,
    '--theme-game-go-star-point': tokens.games.go.starPoint,
    '--theme-game-go-black-stone': tokens.games.go.blackStone,
    '--theme-game-go-white-stone': tokens.games.go.whiteStone,
    '--theme-game-go-white-stone-border': tokens.games.go.whiteStoneBorder,
    '--theme-game-go-hover': tokens.games.go.hover,

    '--theme-game-devil-shell-background': tokens.games.devilRoulette.shellBackground,
    '--theme-game-devil-section-background': tokens.games.devilRoulette.sectionBackground,
    '--theme-game-devil-section-border': tokens.games.devilRoulette.sectionBorder,
    '--theme-game-devil-dealer-accent': tokens.games.devilRoulette.dealerAccent,
    '--theme-game-devil-player-accent': tokens.games.devilRoulette.playerAccent,

    // Legacy aliases for progressive migration.
    '--legacy-color-primary': tokens.semantic.brand.primary,
    '--legacy-color-secondary': tokens.semantic.surface.subtle,
    '--legacy-color-text': tokens.semantic.text.primary,
    '--legacy-color-light-text': tokens.semantic.text.secondary,
    '--legacy-color-border': tokens.semantic.border.default,
    '--legacy-color-background': tokens.semantic.surface.base,
    '--legacy-color-error': tokens.semantic.status.error,
  };

  Object.entries(tokens.games.game2048.tiles).forEach(([level, value]) => {
    cssVars[`--theme-game-2048-tile-${level}`] = value;
  });

  Object.entries(tokens.games.tetris.pieces).forEach(([piece, value]) => {
    cssVars[`--theme-game-tetris-piece-${piece.toLowerCase()}`] = value;
  });

  Object.entries(tokens.games.minesweeper.numberColors).forEach(([level, value]) => {
    cssVars[`--theme-game-minesweeper-number-${level}`] = value;
  });

  tokens.games.hanoi.diskPalette.forEach((color, index) => {
    cssVars[`--theme-game-hanoi-disk-${index + 1}`] = color;
  });

  return cssVars;
};

export const applyCssVariables = (
  themeConfig: ThemeConfigCenter,
  resolvedMode: ResolvedThemeMode,
  rootElement: HTMLElement | null =
    typeof document !== 'undefined' ? document.documentElement : null,
): void => {
  if (!rootElement) {
    return;
  }

  const runtimeTokens = buildRuntimeTokens(themeConfig, resolvedMode);
  const cssVars = toCssVarRecord(runtimeTokens);

  Object.entries(cssVars).forEach(([name, value]) => {
    rootElement.style.setProperty(name, value);
  });

  rootElement.dataset.theme = resolvedMode;
  rootElement.style.colorScheme = resolvedMode;
};
