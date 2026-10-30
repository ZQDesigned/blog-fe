import { expect, test } from '@playwright/test';
import { readingArticle, setupReadingMocks } from './reading-mocks';

const quietCss = `
  .dev-error-trigger { display: none !important; }
  [data-build-info] { visibility: hidden !important; }
  *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; caret-color: transparent !important; }
`;

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test.describe(viewport.name, () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewport);
    await setupReadingMocks(page);
    await page.addInitScript(() => localStorage.setItem('customCursorEnabled', 'false'));
  });

  test(`reading-search - ${viewport.name}`, async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });
    await page.getByRole('searchbox', { name: '搜索文章' }).fill('缓存');
    await page.getByRole('button', { name: '缓存的生命周期', exact: true }).waitFor();
    await page.addStyleTag({ content: quietCss });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`reading-search-${viewport.name}.png`, { fullPage: true });
  });

  test(`reading-outline - ${viewport.name}`, async ({ page }) => {
    await page.goto('/blog/42', { waitUntil: 'networkidle' });
    if (viewport.name === 'mobile') await page.getByText(/^本文目录 · /).click();
    await page.getByRole('navigation', { name: '文章目录' }).waitFor();
    await page.addStyleTag({ content: quietCss });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`reading-outline-${viewport.name}.png`);
  });

  test(`reading-code - ${viewport.name}`, async ({ page }) => {
    await page.goto('/blog/42', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '复制代码', exact: true }).scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.addStyleTag({ content: quietCss });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`reading-code-${viewport.name}.png`);
  });

  test(`reading-resume - ${viewport.name}`, async ({ page }) => {
    await page.addInitScript(article => {
      localStorage.setItem('blog-reading-progress:v1', JSON.stringify([{
        id: String(article.id), revision: article.updateTime, heading: 'section-缓存的生命周期',
        offset: 60, ratio: 0.35, at: Date.now(),
      }]));
    }, readingArticle);
    await page.goto('/blog/42', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '继续阅读', exact: true }).waitFor();
    await page.addStyleTag({ content: quietCss });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`reading-resume-${viewport.name}.png`);
  });

  test(`reading-resource-recovery - ${viewport.name}`, async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const event = new Event('vite:preloadError', { cancelable: true });
      Object.assign(event, { payload: new TypeError('Failed to fetch dynamically imported module') });
      window.dispatchEvent(event);
    });
    await page.getByRole('button', { name: '刷新并继续阅读', exact: true }).waitFor();
    await page.addStyleTag({ content: quietCss });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`reading-resource-recovery-${viewport.name}.png`);
  });
  });
}
