import type { ResolvedThemeMode, ThemeMode } from '../types';

export const getSystemThemePreference = (): ResolvedThemeMode => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const resolveThemeMode = (
  mode: ThemeMode,
  systemPreference: ResolvedThemeMode,
  enableDark: boolean,
): ResolvedThemeMode => {
  if (!enableDark) {
    return 'light';
  }

  if (mode === 'system') {
    return systemPreference;
  }

  return mode;
};
