# Theme Migration Map

## Summary
Migration target is completed for the main style entry points, core pages/components, and all game modules.
All active `globalStyles` usages were replaced.

## Phase Status
- Phase 0: completed
  - baseline docs and visual baseline directory created
- Phase 1: completed
  - config center, runtime APIs, provider, hook, app integration
- Phase 2: completed
  - global style entry switched to CSS vars
  - `index.css`/`App.css` cleaned
  - legacy compatibility retained in `src/styles/theme.ts`
- Phase 3: completed
  - core layout/pages/components switched to `themeVars`
- Phase 4: completed
  - game modules migrated to `themeVars.games.*`
- Phase 5: completed
  - static style token lint gate added and baseline frozen
- Phase 6: completed
  - docs delivered (this file + `theme-system.md` + dark mode playbook)

## Files Migrated (Representative)
- Layout and infra
  - `src/App.tsx`
  - `src/styles/GlobalStyles.tsx`
  - `src/index.css`
  - `src/App.css`
- Core components/pages
  - `src/components/Layout/MainLayout.tsx`
  - `src/components/MarkdownRenderer/index.tsx`
  - `src/components/FloatSidebar/index.tsx`
  - `src/components/ContextMenu/index.tsx`
  - `src/components/Toast/index.tsx`
  - `src/pages/Home/**/*`
  - `src/pages/Blog/**/*`
  - `src/pages/Projects/index.tsx`
  - `src/pages/About/**/*`
- Game modules
  - `src/components/Game2048/index.tsx`
  - `src/components/GameSnake/index.tsx`
  - `src/components/GameMinesweeper/index.tsx`
  - `src/components/GameSudoku/index.tsx`
  - `src/components/GameHanoi/index.tsx`
  - `src/components/GameTetris/index.tsx`
  - `src/components/GameReversi/index.tsx`
  - `src/components/GameGo/index.tsx`
  - `src/components/GameGo/GameGo.9.tsx`
  - `src/components/GameGo/GameGo.19.tsx`
  - `src/components/GameDevilRoulette/index.tsx`
  - `src/pages/Games/index.tsx`

## Remaining Literal Whitelist
Current baseline keeps 43 legacy literals (down from 193).
Main residual areas:
- `src/components/Layout/MainLayout.tsx`
- `src/components/Toast/index.tsx`
- `src/components/ContextMenu/index.tsx`
- `src/components/GlobalErrorBoundary/index.tsx`
- `src/components/DataErrorFallback/index.tsx`
- several Home/About visual accent files

These are tracked and protected by `lint:style-tokens` to prevent regressions.

## Rollback Safety
- Deprecated exports retained in `src/styles/theme.ts`
- dark rendering gate remains off via `enableDark=false`
