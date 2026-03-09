import type { ResolvedThemeMode, ThemeMode } from '../types';

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

export const readStoredThemeMode = (
  storageKey: string,
  fallback: ThemeMode,
): ThemeMode => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const storedMode = window.localStorage.getItem(storageKey);
  return isThemeMode(storedMode) ? storedMode : fallback;
};

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
