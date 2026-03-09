import type { ThemeConfig } from 'antd/es/config-provider/context';
import {
  createAntdTheme,
  createLegacyGlobalStyles,
  getThemeConfig,
} from '../theme';

const themeConfig = getThemeConfig();

/**
 * @deprecated Use ThemeProvider + useTheme().antdTheme instead.
 */
export const customTheme: ThemeConfig = createAntdTheme(themeConfig, 'light');

/**
 * @deprecated Use ThemeProvider + useTheme().tokens instead.
 */
export const globalStyles = createLegacyGlobalStyles(themeConfig, 'light');

/**
 * @deprecated Use `themeVars` from `src/theme` instead.
 */
export const themeVars = globalStyles;
