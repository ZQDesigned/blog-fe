import type { ThemeConfigCenter } from '../types';

export const defaultThemeConfig: ThemeConfigCenter = {
  meta: {
    version: '1.0.0',
    brandName: 'LumiCMS',
  },
  settings: {
    enableDark: false,
    defaultMode: 'system',
    storageKey: 'themeMode',
  },
  tokens: {
    common: {
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      transitions: {
        fast: '0.15s ease',
        normal: '0.3s ease',
        slow: '0.5s ease',
      },
      shadows: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
        md: '0 4px 12px rgba(0, 0, 0, 0.15)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      radius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        circle: '50%',
      },
      typography: {
        fontFamilyBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontFamilyMono: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
        fontSizeBase: '16px',
        lineHeightBase: '1.5',
      },
      cursor: {
        dotSize: '8px',
        ringSize: '30px',
        ringBorderWidth: '2px',
        hoverScale: 1.35,
        activeScale: 0.85,
        dotActiveScale: 1.25,
        followEase: 0.2,
        clickParticles: 8,
        clickParticleMinDistance: 80,
        clickParticleMaxDistance: 150,
        clickParticleDurationMs: 900,
        particleSize: '24px',
      },
      zIndex: {
        dropdown: 1000,
        modal: 1000,
        toast: 1001,
        cursor: 9999,
      },
    },
    light: {
      semantic: {
        brand: {
          primary: '#1890ff',
          primaryHover: '#1677ff',
          primaryActive: '#0958d9',
          onPrimary: '#ffffff',
        },
        text: {
          primary: '#333333',
          secondary: '#666666',
          muted: '#8c8c8c',
          inverse: '#ffffff',
        },
        surface: {
          app: '#f0f7ff',
          base: '#ffffff',
          raised: '#ffffff',
          subtle: '#f0f7ff',
        },
        border: {
          default: '#e8e8e8',
          strong: '#d9d9d9',
          inverse: 'rgba(255, 255, 255, 0.2)',
        },
        status: {
          success: '#52c41a',
          warning: '#faad14',
          error: '#ff4d4f',
          info: '#1677ff',
        },
        overlay: {
          mask: 'rgba(0, 0, 0, 0.45)',
          glass: 'rgba(255, 255, 255, 0.9)',
          glassStrong: 'rgba(255, 255, 255, 0.3)',
        },
        scrollbar: {
          track: '#f0f7ff',
          thumbStart: 'rgba(24, 144, 255, 0.25)',
          thumbEnd: 'rgba(24, 144, 255, 0.5)',
        },
      },
      components: {
        menu: {
          pillBackground: 'rgba(0, 0, 0, 0.05)',
          pillBorder: 'rgba(0, 0, 0, 0.1)',
        },
        card: {
          backdrop: 'rgba(255, 255, 255, 0.9)',
        },
        cursor: {
          dotBackground: 'rgba(24, 144, 255, 0.9)',
          ringBorder: 'rgba(24, 144, 255, 0.45)',
          ringHoverBorder: 'rgba(24, 144, 255, 0.75)',
          ringActiveBorder: 'rgba(24, 144, 255, 0.95)',
        },
      },
      games: {
        game2048: {
          boardBackground: '#bbada0',
          emptyCell: '#ccc0b3',
          textDark: '#776e65',
          textLight: '#f9f6f2',
          tiles: {
            '0': '#ccc0b3',
            '2': '#eee4da',
            '4': '#ede0c8',
            '8': '#f2b179',
            '16': '#f59563',
            '32': '#f67c5f',
            '64': '#f65e3b',
            '128': '#edcf72',
            '256': '#edcc61',
            '512': '#edc850',
            '1024': '#edc53f',
            '2048': '#edc22e',
          },
        },
        snake: {
          snake: '#1890ff',
          food: '#f44336',
          empty: '#f0f7ff',
        },
        tetris: {
          pieces: {
            I: '#00f0f0',
            O: '#f0f000',
            T: '#a000f0',
            S: '#00f000',
            Z: '#f00000',
            J: '#0000f0',
            L: '#f0a000',
          },
        },
        minesweeper: {
          mine: '#000000',
          flag: '#f5222d',
          danger: '#ff4d4f',
          numberColors: {
            '1': '#1890ff',
            '2': '#52c41a',
            '3': '#f5222d',
            '4': '#722ed1',
            '5': '#fa8c16',
            '6': '#13c2c2',
            '7': '#eb2f96',
            '8': '#faad14',
          },
        },
        sudoku: {
          errorBackground: 'rgba(255, 77, 79, 0.12)',
          errorText: '#ff4d4f',
        },
        hanoi: {
          diskPalette: ['#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#eb2f96', '#fa541c', '#13c2c2'],
          pole: '#8c8c8c',
        },
        reversi: {
          black: '#000000',
          white: '#ffffff',
          whiteBorder: '#cccccc',
        },
        go: {
          board9: '#e8c285',
          board19: '#deb887',
          line: '#000000',
          starPoint: '#000000',
          blackStone: '#000000',
          whiteStone: '#ffffff',
          whiteStoneBorder: '#cccccc',
          hover: 'rgba(0, 0, 0, 0.1)',
        },
        devilRoulette: {
          shellBackground: '#0b0c10',
          sectionBackground: '#0f1016',
          sectionBorder: 'rgba(255, 255, 255, 0.05)',
          dealerAccent: '#ef4444',
          playerAccent: '#22c55e',
        },
      },
    },
    dark: {
      semantic: {
        brand: {
          primary: '#4aa8ff',
          primaryHover: '#74b9ff',
          primaryActive: '#2f8ee6',
          onPrimary: '#001529',
        },
        text: {
          primary: '#f5f5f5',
          secondary: '#bfbfbf',
          muted: '#8c8c8c',
          inverse: '#111111',
        },
        surface: {
          app: '#0f172a',
          base: '#141414',
          raised: '#1f1f1f',
          subtle: '#111827',
        },
        border: {
          default: '#303030',
          strong: '#434343',
          inverse: 'rgba(255, 255, 255, 0.25)',
        },
        status: {
          success: '#73d13d',
          warning: '#ffc53d',
          error: '#ff7875',
          info: '#69b1ff',
        },
        overlay: {
          mask: 'rgba(0, 0, 0, 0.65)',
          glass: 'rgba(26, 26, 26, 0.92)',
          glassStrong: 'rgba(26, 26, 26, 0.7)',
        },
        scrollbar: {
          track: '#111827',
          thumbStart: 'rgba(74, 168, 255, 0.4)',
          thumbEnd: 'rgba(74, 168, 255, 0.8)',
        },
      },
      components: {
        menu: {
          pillBackground: 'rgba(255, 255, 255, 0.08)',
          pillBorder: 'rgba(255, 255, 255, 0.16)',
        },
        card: {
          backdrop: 'rgba(20, 20, 20, 0.85)',
        },
        cursor: {
          dotBackground: 'rgba(74, 168, 255, 0.9)',
          ringBorder: 'rgba(74, 168, 255, 0.5)',
          ringHoverBorder: 'rgba(116, 185, 255, 0.8)',
          ringActiveBorder: 'rgba(116, 185, 255, 0.95)',
        },
      },
      games: {
        game2048: {
          boardBackground: '#3b3b3b',
          emptyCell: '#4a4a4a',
          textDark: '#f5f5f5',
          textLight: '#ffffff',
          tiles: {
            '0': '#4a4a4a',
            '2': '#5a5a5a',
            '4': '#6a6a6a',
            '8': '#a56c2a',
            '16': '#b85f2e',
            '32': '#c94d2a',
            '64': '#d4380d',
            '128': '#d4b106',
            '256': '#d89614',
            '512': '#d48806',
            '1024': '#ad8b00',
            '2048': '#7f6600',
          },
        },
        snake: {
          snake: '#69b1ff',
          food: '#ff7875',
          empty: '#1f1f1f',
        },
        tetris: {
          pieces: {
            I: '#36cfc9',
            O: '#fadb14',
            T: '#9254de',
            S: '#73d13d',
            Z: '#ff4d4f',
            J: '#1677ff',
            L: '#fa8c16',
          },
        },
        minesweeper: {
          mine: '#000000',
          flag: '#ff7875',
          danger: '#ff4d4f',
          numberColors: {
            '1': '#69b1ff',
            '2': '#95de64',
            '3': '#ff7875',
            '4': '#b37feb',
            '5': '#ff9c6e',
            '6': '#5cdbd3',
            '7': '#ff85c0',
            '8': '#ffd666',
          },
        },
        sudoku: {
          errorBackground: 'rgba(255, 77, 79, 0.18)',
          errorText: '#ff7875',
        },
        hanoi: {
          diskPalette: ['#ff7875', '#ff9c6e', '#ffd666', '#95de64', '#69b1ff', '#b37feb', '#ff85c0', '#ffbb96', '#5cdbd3'],
          pole: '#595959',
        },
        reversi: {
          black: '#111111',
          white: '#f5f5f5',
          whiteBorder: '#8c8c8c',
        },
        go: {
          board9: '#8b6a2f',
          board19: '#7b5c2a',
          line: '#111111',
          starPoint: '#111111',
          blackStone: '#111111',
          whiteStone: '#f5f5f5',
          whiteStoneBorder: '#8c8c8c',
          hover: 'rgba(255, 255, 255, 0.1)',
        },
        devilRoulette: {
          shellBackground: '#050505',
          sectionBackground: '#101010',
          sectionBorder: 'rgba(255, 255, 255, 0.1)',
          dealerAccent: '#ff7875',
          playerAccent: '#95de64',
        },
      },
    },
  },
  componentTokens: {
    antd: {
      light: {
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#ffffff',
          colorTextBase: '#333333',
          borderRadius: 4,
          colorBorder: '#e8e8e8',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 4,
            controlHeight: 36,
          },
          Card: {
            borderRadius: 8,
          },
        },
      },
      dark: {
        token: {
          colorPrimary: '#4aa8ff',
          colorBgContainer: '#141414',
          colorTextBase: '#f5f5f5',
          borderRadius: 4,
          colorBorder: '#303030',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 4,
            controlHeight: 36,
          },
          Card: {
            borderRadius: 8,
          },
        },
      },
    },
  },
};
