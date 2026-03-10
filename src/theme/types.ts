import type { ThemeConfig } from 'antd/es/config-provider/context';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

export interface ThemeMeta {
  version: string;
  brandName: string;
}

export interface ThemeSettings {
  enableDark: boolean;
  defaultMode: ThemeMode;
  storageKey: string;
}

export interface ThemeSpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTransitionTokens {
  fast: string;
  normal: string;
  slow: string;
}

export interface ThemeShadowTokens {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeRadiusTokens {
  sm: string;
  md: string;
  lg: string;
  circle: string;
}

export interface ThemeTypographyTokens {
  fontFamilyBase: string;
  fontFamilyMono: string;
  fontSizeBase: string;
  lineHeightBase: string;
}

export interface ThemeCursorTokens {
  dotSize: string;
  ringSize: string;
  ringBorderWidth: string;
  hoverScale: number;
  activeScale: number;
  dotActiveScale: number;
  followEase: number;
  clickParticles: number;
  clickParticleMinDistance: number;
  clickParticleMaxDistance: number;
  clickParticleDurationMs: number;
  particleSize: string;
}

export interface ThemeZIndexTokens {
  dropdown: number;
  modal: number;
  toast: number;
  cursor: number;
}

export interface ThemeCommonTokens {
  spacing: ThemeSpacingTokens;
  transitions: ThemeTransitionTokens;
  shadows: ThemeShadowTokens;
  radius: ThemeRadiusTokens;
  typography: ThemeTypographyTokens;
  cursor: ThemeCursorTokens;
  zIndex: ThemeZIndexTokens;
}

export interface ThemeSemanticTokens {
  brand: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    onPrimary: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  surface: {
    app: string;
    base: string;
    raised: string;
    subtle: string;
  };
  border: {
    default: string;
    strong: string;
    inverse: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  overlay: {
    mask: string;
    glass: string;
    glassStrong: string;
  };
  scrollbar: {
    track: string;
    thumbStart: string;
    thumbEnd: string;
  };
}

export interface ThemeGame2048Tokens {
  boardBackground: string;
  emptyCell: string;
  textDark: string;
  textLight: string;
  tiles: Record<string, string>;
}

export interface ThemeGameSnakeTokens {
  snake: string;
  food: string;
  empty: string;
}

export interface ThemeGameTetrisTokens {
  pieces: Record<'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L', string>;
}

export interface ThemeGameMinesweeperTokens {
  mine: string;
  flag: string;
  danger: string;
  numberColors: Record<string, string>;
}

export interface ThemeGameSudokuTokens {
  errorBackground: string;
  errorText: string;
}

export interface ThemeGameHanoiTokens {
  diskPalette: string[];
  pole: string;
}

export interface ThemeGameReversiTokens {
  black: string;
  white: string;
  whiteBorder: string;
}

export interface ThemeGameGoTokens {
  board9: string;
  board19: string;
  line: string;
  starPoint: string;
  blackStone: string;
  whiteStone: string;
  whiteStoneBorder: string;
  hover: string;
}

export interface ThemeGameDevilRouletteTokens {
  shellBackground: string;
  sectionBackground: string;
  sectionBorder: string;
  dealerAccent: string;
  playerAccent: string;
}

export interface ThemeGamesTokens {
  game2048: ThemeGame2048Tokens;
  snake: ThemeGameSnakeTokens;
  tetris: ThemeGameTetrisTokens;
  minesweeper: ThemeGameMinesweeperTokens;
  sudoku: ThemeGameSudokuTokens;
  hanoi: ThemeGameHanoiTokens;
  reversi: ThemeGameReversiTokens;
  go: ThemeGameGoTokens;
  devilRoulette: ThemeGameDevilRouletteTokens;
}

export interface ThemeComponentSemanticTokens {
  menu: {
    pillBackground: string;
    pillBorder: string;
  };
  card: {
    backdrop: string;
  };
  cursor: {
    dotBackground: string;
    ringBorder: string;
    ringHoverBorder: string;
    ringActiveBorder: string;
  };
}

export interface ThemeModeTokens {
  semantic: ThemeSemanticTokens;
  components: ThemeComponentSemanticTokens;
  games: ThemeGamesTokens;
}

export interface ThemeAntdModeTokens {
  token: NonNullable<ThemeConfig['token']>;
  components?: ThemeConfig['components'];
}

export interface ThemeConfigCenter {
  meta: ThemeMeta;
  settings: ThemeSettings;
  tokens: {
    common: ThemeCommonTokens;
    light: ThemeModeTokens;
    dark: ThemeModeTokens;
  };
  componentTokens: {
    antd: {
      light: ThemeAntdModeTokens;
      dark: ThemeAntdModeTokens;
    };
  };
}

export interface ThemeRuntimeTokens extends ThemeCommonTokens {
  semantic: ThemeSemanticTokens;
  components: ThemeComponentSemanticTokens;
  games: ThemeGamesTokens;
}

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  setMode: (next: ThemeMode) => void;
  antdTheme: ThemeConfig;
  tokens: ThemeRuntimeTokens;
  themeConfig: ThemeConfigCenter;
}

export interface LegacyGlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    lightText: string;
    border: string;
    background: string;
    error: string;
  };
  spacing: ThemeSpacingTokens;
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    circle: string;
  };
}
