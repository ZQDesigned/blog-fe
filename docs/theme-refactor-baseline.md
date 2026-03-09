# Theme Refactor Baseline

## Scope
This baseline freezes the visual and style-literal status before and during the theme configuration center migration.

## Current baseline artifacts
- Visual snapshots location: `tests/visual/theme-visual.spec.ts-snapshots/`
- Visual test config: `playwright.config.ts`
- API mocks for deterministic screenshots: `tests/visual/mocks.ts`
- Style literal baseline file: `scripts/style-token-baseline.json`

## Latest snapshot
- Last refresh date: `2026-03-09`
- Snapshot status: 14 routes/viewport cases captured
- Style literal baseline count: 43 entries (reduced from 193)

## Snapshot coverage
- Routes: `/`, `/blog`, `/blog/1`, `/projects`, `/about`, `/games`, `/blog/1?mode=standalone`
- Viewports: desktop `1440x900`, mobile `390x844`

## How to generate/update
1. Install dependencies: `npm install`
2. Install browser runtime: `npx playwright install chromium`
3. Update visual baseline:
   - `npm run test:visual:update`
4. Update style-literal baseline:
   - `npm run lint:style-tokens:update-baseline`

## Hardcoded style tracking policy
- `npm run lint:style-tokens` blocks newly introduced color literals compared to baseline.
- Existing literals are frozen in baseline and can be incrementally removed.
- Intentional exceptions are maintained via whitelist inside `scripts/lintStyleTokens.cjs`.
