import { getThemeConfig } from '../config';
import type { ResolvedThemeMode, ThemeMode } from '../types';
import { applyCssVariables } from './cssVars';
import {
  getSystemThemePreference,
  readStoredThemeMode,
  resolveThemeMode,
} from './mode';

interface ThemeBootstrapResult {
  mode: ThemeMode;
  systemPreference: ResolvedThemeMode;
  resolvedMode: ResolvedThemeMode;
}

export const initializeThemeRuntime = (
  rootElement: HTMLElement | null =
    typeof document !== 'undefined' ? document.documentElement : null,
): ThemeBootstrapResult | null => {
  if (!rootElement) {
    return null;
  }

  const themeConfig = getThemeConfig();
  const mode = readStoredThemeMode(
    themeConfig.settings.storageKey,
    themeConfig.settings.defaultMode,
  );
  const systemPreference = getSystemThemePreference();
  const resolvedMode = resolveThemeMode(
    mode,
    systemPreference,
    themeConfig.settings.enableDark,
  );

  applyCssVariables(themeConfig, resolvedMode, rootElement);

  return {
    mode,
    systemPreference,
    resolvedMode,
  };
};
