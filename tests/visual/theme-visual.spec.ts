import { expect, test } from '@playwright/test';
import { setupApiMocks } from './mocks';

const disableMotionCss = `
* {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  caret-color: transparent !important;
}
`;

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
      await page.addStyleTag({ content: disableMotionCss });

      await page.goto(item.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(`${item.name}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixels: 256,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
}
