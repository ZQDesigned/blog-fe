import type {
  ResolvedThemeMode,
  ThemeConfigCenter,
  ThemeRuntimeTokens,
} from '../types';

export const buildRuntimeTokens = (
  themeConfig: ThemeConfigCenter,
  resolvedMode: ResolvedThemeMode,
): ThemeRuntimeTokens => ({
  ...themeConfig.tokens.common,
  semantic: themeConfig.tokens[resolvedMode].semantic,
  components: themeConfig.tokens[resolvedMode].components,
  games: themeConfig.tokens[resolvedMode].games,
});
