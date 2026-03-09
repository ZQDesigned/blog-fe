# Theme System

## Overview
The styling system is centralized under `src/theme/` and now uses a single source of truth for:
- runtime mode state (`light | dark | system`)
- semantic design tokens
- CSS variables injection
- Ant Design token mapping
- game-specific visual tokens

## Directory Layout
- `src/theme/config/defaultTheme.ts`: strongly typed local config center
- `src/theme/types.ts`: all token and API types
- `src/theme/runtime/*.ts`: mode resolution, token build, css variable injection, antd adaptation, legacy mapper
- `src/theme/provider/ThemeProvider.tsx`: runtime provider with `localStorage` persistence
- `src/theme/provider/ThemeContext.ts`: theme context
- `src/theme/hooks/useTheme.ts`: consumer hook
- `src/theme/vars.ts`: static token reference API for styled/inline style usage (`themeVars`, `withThemeAlpha`)

## Token Layers
- Core tokens (`tokens.common`): spacing, radius, shadows, typography, transitions, z-index
- Semantic tokens (`tokens.light|dark.semantic`): brand, text, surface, border, status, overlay, scrollbar
- Component tokens (`tokens.light|dark.components`): custom component-level semantic slots
- Game tokens (`tokens.light|dark.games`): per-game palettes and gameplay color maps
- AntD token bridge (`componentTokens.antd`): shared theme source for `ConfigProvider`

## Runtime APIs
- `getThemeConfig()`
- `resolveThemeMode(mode, systemPref, enableDark?)`
- `createAntdTheme(themeConfig, resolvedMode)`
- `applyCssVariables(themeConfig, resolvedMode, rootElement?)`
- `buildRuntimeTokens(themeConfig, resolvedMode)`

## React APIs
- `ThemeProvider`
- `useTheme()`

`useTheme()` returns:
- `mode`, `resolvedMode`, `setMode`
- `tokens` (runtime token object)
- `antdTheme`
- `themeConfig`

## Consumption Rules
- Use `themeVars` in styled components and inline style declarations.
- Use `withThemeAlpha(color, alpha)` for transparent variants instead of hex suffix concatenation.
- Use `useTheme().tokens` for logic-bound runtime access.
- Avoid direct `#hex/rgb/rgba/hsl` in UI code.

## Compatibility Layer
`src/styles/theme.ts`
- keeps deprecated exports for rollback safety
- `globalStyles` is still exported but no longer consumed by active modules

## Ant Design Integration
`src/App.tsx`
- `ThemeProvider` wraps app root
- `ConfigProvider` consumes `useTheme().antdTheme`
- custom components and AntD components now share one config source

## Current Mode Strategy
- persisted mode key: `themeMode`
- default mode: `system`
- `enableDark` currently `false` (dark structure ready, rendering locked to light)

## Governance
- `npm run lint:style-tokens`: blocks newly added style color literals
- baseline file: `scripts/style-token-baseline.json`
- visual gate: `npm run test:visual`
