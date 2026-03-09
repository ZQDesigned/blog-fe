import type {
  LegacyGlobalStyles,
  ResolvedThemeMode,
  ThemeConfigCenter,
} from '../types';
import { buildRuntimeTokens } from './tokens';

export const createLegacyGlobalStyles = (
  themeConfig: ThemeConfigCenter,
  resolvedMode: ResolvedThemeMode,
): LegacyGlobalStyles => {
  const tokens = buildRuntimeTokens(themeConfig, resolvedMode);

  return {
    colors: {
      primary: tokens.semantic.brand.primary,
      secondary: tokens.semantic.surface.subtle,
      text: tokens.semantic.text.primary,
      lightText: tokens.semantic.text.secondary,
      border: tokens.semantic.border.default,
      background: tokens.semantic.surface.base,
      error: tokens.semantic.status.error,
    },
    spacing: {
      ...tokens.spacing,
    },
    transitions: {
      default: tokens.transitions.normal,
      fast: tokens.transitions.fast,
      slow: tokens.transitions.slow,
    },
    shadows: {
      small: tokens.shadows.sm,
      medium: tokens.shadows.md,
      large: tokens.shadows.lg,
    },
    borderRadius: {
      small: tokens.radius.sm,
      medium: tokens.radius.md,
      large: tokens.radius.lg,
      circle: tokens.radius.circle,
    },
  };
};
