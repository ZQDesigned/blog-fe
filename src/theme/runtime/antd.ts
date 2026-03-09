import type { ThemeConfig } from 'antd/es/config-provider/context';
import type { ResolvedThemeMode, ThemeConfigCenter } from '../types';

export const createAntdTheme = (
  themeConfig: ThemeConfigCenter,
  resolvedMode: ResolvedThemeMode,
): ThemeConfig => {
  const antdTokens = themeConfig.componentTokens.antd[resolvedMode];

  return {
    token: {
      ...antdTokens.token,
    },
    components: antdTokens.components
      ? {
          ...antdTokens.components,
        }
      : undefined,
  };
};
