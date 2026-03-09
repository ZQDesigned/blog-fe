import { defaultThemeConfig } from './defaultTheme';
import type { ThemeConfigCenter } from '../types';

const themeConfig: ThemeConfigCenter = defaultThemeConfig;

export const getThemeConfig = (): ThemeConfigCenter => themeConfig;

export { defaultThemeConfig };
