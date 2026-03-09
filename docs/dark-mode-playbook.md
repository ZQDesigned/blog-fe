# Dark Mode Playbook

## Goal
Enable dark rendering with minimal risk, based on the new centralized theme system.

## Preconditions
- `src/theme/config/defaultTheme.ts` has complete `tokens.dark` and `componentTokens.antd.dark`
- all active style consumers use `themeVars` / `useTheme().tokens`
- visual baseline and style lint gates are green

## Implementation Steps
1. Enable dark gate
   - set `settings.enableDark` to `true` in `defaultTheme.ts`
2. Expose mode controls in UI
   - use `useTheme()` in settings panel
   - wire `setMode('light' | 'dark' | 'system')`
3. Expand visual tests
   - add dark snapshots for key routes/viewport matrix
4. Validate AntD consistency
   - verify button/card/form/modal color/contrast parity
5. QA edge modules
   - standalone mode
   - all game pages
   - modal overlays and drawers

## Verification Checklist
- `npm run build`
- `npm run lint:style-tokens`
- `npm run test:visual:update` (first dark baseline)
- `npm run test:visual`

## Rollback
- switch `enableDark` back to `false`
- keep mode persistence untouched (state machine remains active)

## Notes
- avoid introducing new hardcoded literals during dark tuning
- prefer adding token fields over local one-off overrides
