import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { setupApiMocks } from './mocks';

const disableMotionCss = `
.dev-error-trigger { display: none !important; }
[data-build-info] { visibility: hidden !important; }
* {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  caret-color: transparent !important;
}
`;

const installDisableMotionCss = async (page: Page) => {
  await page.addInitScript((cssText: string) => {
    const styleId = '__theme-visual-disable-motion__';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = cssText;
    (document.head ?? document.documentElement).appendChild(style);
  }, disableMotionCss);
};

const disableCustomCursorForVisualTests = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('customCursorEnabled', 'false');
  });
};

const cases = [
  { name: 'home', path: '/' },
  { name: 'blog-list', path: '/blog' },
  { name: 'blog-detail', path: '/blog/1' },
  { name: 'projects', path: '/projects' },
  { name: 'about', path: '/about' },
  { name: 'games', path: '/games' },
  { name: 'blog-detail-standalone', path: '/blog/1?mode=standalone' },
] as const;

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  for (const item of cases) {
    test(`${item.name} - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setupApiMocks(page);
      await disableCustomCursorForVisualTests(page);
      await installDisableMotionCss(page);

      await page.goto(item.path, { waitUntil: 'networkidle' });
      // The parser can replace styles injected before <head> exists.
      await page.addStyleTag({ content: disableMotionCss });
      await page.evaluate(() => document.fonts.ready);
      // Existing game/about sections stagger JS-driven opacity animations.
      await page.waitForTimeout(1600);

      await expect(page).toHaveScreenshot(`${item.name}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixels: 0,
        maxDiffPixelRatio: 0,
        threshold: 0.2,
      });
    });
  }
}

const interactionCases: { name: string; path: string; open: (page: Page) => Promise<unknown> }[] = [
  { name: 'settings-drawer', path: '/', open: page => page.getByRole('button', { name: '打开个性化设置' }).click() },
  { name: 'blog-preview', path: '/blog', open: page => page.getByRole('button', { name: '主题系统改造说明', exact: true }).click() },
  { name: 'blog-grid', path: '/blog', open: page => page.getByText('网格视图', { exact: true }).click() },
  { name: 'category-dropdown', path: '/blog', open: page => page.getByRole('combobox', { name: '按分类筛选' }).click() },
  { name: 'tag-dropdown', path: '/blog', open: page => page.getByRole('combobox', { name: '按标签筛选' }).click() },
  { name: 'project-preview', path: '/projects', open: page => page.getByRole('heading', { name: 'LumiCMS Theme System' }).click() },
  { name: 'external-warning', path: '/', open: page => page.getByRole('link', { name: '开源代码', exact: true }).click() },
];

for (const viewport of viewports) {
  for (const item of interactionCases) {
    test(`${item.name} - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setupApiMocks(page);
      await disableCustomCursorForVisualTests(page);
      await installDisableMotionCss(page);
      await page.goto(item.path, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: disableMotionCss });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1600);
      await item.open(page);
      await page.mouse.move(0, 0);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1600);
      await expect(page).toHaveScreenshot(`${item.name}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixels: 0,
        maxDiffPixelRatio: 0,
        threshold: 0.2,
      });
    });
  }
}
