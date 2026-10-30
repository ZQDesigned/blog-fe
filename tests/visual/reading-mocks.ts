import type { Page } from '@playwright/test';
import { setupApiMocks } from './mocks';

const paragraph = '让内容保持清晰，比增加更多装饰更重要。记录一次真实的探索，也保留思考发生的过程。阅读工具应当安静地提供帮助，而不是争夺注意力。';
export const readingArticle = {
  id: 42,
  title: '让阅读自然发生',
  summary: '关于搜索、缓存与阅读体验的一些笔记。',
  content: [
    '# 从一篇笔记开始',
    ...Array(4).fill(paragraph),
    '## 缓存的生命周期',
    ...Array(4).fill(paragraph),
    '```typescript\nconst garden = { reading: true };\nconsole.log(garden);\n```',
    '## 在章节之间漫步',
    ...Array(4).fill(paragraph),
    '### 相同的标题', paragraph,
    '### 相同的标题', paragraph,
    '## 留一点空白',
    ...Array(4).fill(paragraph),
  ].join('\n\n'),
  categoryId: 1, categoryName: '前端', tagIds: [1], tagNames: ['Theme'],
  viewCount: 128, createTime: '2026-10-01 10:00', updateTime: '2026-10-30 10:00',
};

export const setupReadingMocks = async (page: Page) => {
  await setupApiMocks(page);
  await page.route('**/api/blog/42', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ code: 200, data: readingArticle }),
  }));
  await page.route('**/api/blog/list?*', route => {
    const url = new URL(route.request().url());
    const keyword = url.searchParams.get('keyword') || '';
    const items = keyword === '缓存' ? [{ ...readingArticle, title: '缓存的生命周期' }] : [readingArticle];
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ code: 200, data: {
      content: items, totalElements: items.length, totalPages: 1, number: 0,
    } }) });
  });
};
