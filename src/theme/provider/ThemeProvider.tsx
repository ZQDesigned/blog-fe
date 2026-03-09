import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ResolvedThemeMode,
  ThemeContextValue,
  ThemeMode,
} from '../types';
import { getThemeConfig } from '../config';
import { ThemeContext } from './ThemeContext';
import {
  applyCssVariables,
  buildRuntimeTokens,
  createAntdTheme,
  getSystemThemePreference,
  resolveThemeMode,
} from '../runtime';

const readStoredMode = (storageKey: string, fallback: ThemeMode): ThemeMode => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const stored = window.localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }

  return fallback;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeConfig = useMemo(() => getThemeConfig(), []);

  const [mode, setModeState] = useState<ThemeMode>(() =>
    readStoredMode(themeConfig.settings.storageKey, themeConfig.settings.defaultMode),
  );
  const [systemPreference, setSystemPreference] = useState<ResolvedThemeMode>(() =>
    getSystemThemePreference(),
  );

  const resolvedMode = useMemo(
    () =>
      resolveThemeMode(mode, systemPreference, themeConfig.settings.enableDark),
    [mode, systemPreference, themeConfig.settings.enableDark],
  );

  const tokens = useMemo(
    () => buildRuntimeTokens(themeConfig, resolvedMode),
    [themeConfig, resolvedMode],
  );

  const antdTheme = useMemo(
    () => createAntdTheme(themeConfig, resolvedMode),
    [themeConfig, resolvedMode],
  );

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(themeConfig.settings.storageKey, mode);
  }, [mode, themeConfig.settings.storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPreference(event.matches ? 'dark' : 'light');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    applyCssVariables(themeConfig, resolvedMode);
  }, [themeConfig, resolvedMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedMode,
      setMode,
      antdTheme,
      tokens,
      themeConfig,
    }),
    [antdTheme, mode, resolvedMode, setMode, themeConfig, tokens],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
