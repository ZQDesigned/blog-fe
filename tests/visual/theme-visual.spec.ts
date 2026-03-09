import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { setupApiMocks } from './mocks';

interface ThemeRuntimeProbe {
  domContentLoaded: string;
  firstRootMutation: string;
}

const disableMotionCss = `
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

test('theme css vars are ready before first paint', async ({ page }) => {
  await setupApiMocks(page);

  await page.addInitScript(() => {
    const rootVarName = '--theme-font-family-base';
    const probe: ThemeRuntimeProbe = {
      domContentLoaded: '',
      firstRootMutation: '',
    };

    const readRootVar = () =>
      document.documentElement.style.getPropertyValue(rootVarName).trim();

    document.addEventListener(
      'DOMContentLoaded',
      () => {
        probe.domContentLoaded = readRootVar();

        const rootElement = document.getElementById('root');
        if (!rootElement) {
          return;
        }

        const observer = new MutationObserver(() => {
          probe.firstRootMutation = readRootVar();
          observer.disconnect();
        });

        observer.observe(rootElement, {
          childList: true,
          subtree: true,
        });
      },
      { once: true },
    );

    (
      window as Window & {
        __themeRuntimeProbe?: ThemeRuntimeProbe;
      }
    ).__themeRuntimeProbe = probe;
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const probe = await page.evaluate(() => {
    return (
      (
        window as Window & {
          __themeRuntimeProbe?: ThemeRuntimeProbe;
        }
      ).__themeRuntimeProbe ?? {
        domContentLoaded: '',
        firstRootMutation: '',
      }
    );
  });

  expect(probe.domContentLoaded).not.toBe('');
  expect(probe.firstRootMutation).not.toBe('');
});

for (const viewport of viewports) {
  for (const item of cases) {
    test(`${item.name} - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await setupApiMocks(page);
      await installDisableMotionCss(page);

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
