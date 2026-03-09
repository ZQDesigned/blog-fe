import type { Page, Route } from '@playwright/test';

const ok = (data: unknown) => ({
  code: 200,
  msg: 'success',
  data,
});

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
};

const homeContent = {
  sections: [
    {
      type: 'banner',
      title: 'LumiCMS',
      description: '配置中心化主题系统',
      banner: {
        subtitle: 'Theme Refactor Preview',
        backgroundImage: '',
        buttons: [
          { text: '查看博客', link: '/blog', type: 'primary', icon: 'ReadOutlined' },
        ],
      },
    },
    {
      type: 'features',
      title: '功能特性',
      description: '统一主题管理',
      items: [
        { icon: 'BgColorsOutlined', title: 'Design Tokens', description: '统一语义化 token' },
      ],
    },
    {
      type: 'skills',
      title: '技能',
      description: '示例数据',
      categories: [
        {
          name: 'Frontend',
          items: [{ name: 'React', level: 5, icon: 'Html5Outlined', description: 'React 18' }],
        },
      ],
    },
    {
      type: 'timeline',
      title: '时间线',
      description: '里程碑',
      timelineItems: [
        { date: '2026-03-09', title: 'Theme Refactor', description: '完成主题配置中心改造' },
      ],
    },
    {
      type: 'contact',
      title: '联系我',
      description: 'Contact',
      contactItems: [
        { type: 'Email', icon: 'MailOutlined', value: 'zqdesigned@mail.lnyynet.com', link: 'mailto:zqdesigned@mail.lnyynet.com' },
      ],
    },
  ],
  meta: {
    title: '首页',
    description: '首页描述',
    keywords: ['blog', 'theme'],
    updateTime: '2026-03-09T00:00:00Z',
  },
};

const sidebarData = {
  profile: {
    avatar: '/images/2048.png',
    name: 'ZQDesigned',
    bio: 'Theme refactor baseline',
    status: {
      online: true,
      text: '在线',
    },
  },
  announcements: [{ title: '公告', content: '视觉回归基线模式', type: 'text' }],
  contact: { email: 'zqdesigned@mail.lnyynet.com' },
  settings: { showWeather: true },
};

const footerProfile = {
  links: [
    { title: 'GitHub', url: 'https://github.com/ZQDesigned', isExternal: true, icon: 'GithubOutlined' },
  ],
};

const blogDetail = {
  id: 1,
  title: '主题系统改造说明',
  summary: '这是一篇用于视觉回归的示例文章。',
  content: '# 标题\n\n这是一段 **Markdown** 内容。',
  categoryId: 1,
  categoryName: '前端',
  tagIds: [1],
  tagNames: ['Theme'],
  viewCount: 123,
  createTime: '2026-03-01 10:00',
  updateTime: '2026-03-09 10:00',
};

const blogList = {
  content: [blogDetail],
  pageable: {
    pageNumber: 0,
    pageSize: 12,
    sort: { empty: true, sorted: false, unsorted: true },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalPages: 1,
  totalElements: 1,
  number: 0,
  first: true,
  sort: { empty: true, sorted: false, unsorted: true },
  size: 12,
  numberOfElements: 1,
  empty: false,
};

const projects = [
  {
    id: 1,
    title: 'LumiCMS Theme System',
    description: '统一主题配置中心示例项目',
    imageUrl: '/images/2048.png',
    github: { url: 'https://github.com/ZQDesigned/blog-fe', disabled: false, disabledReason: null },
    demo: { url: 'https://blog.zqdesigned.city', disabled: false, disabledReason: null },
    status: 'maintaining',
    features: ['语义化 token', '主题切换预备', '视觉回归基线'],
    techStack: ['React', 'TypeScript', 'Emotion'],
    createTime: '2026-03-01',
    updateTime: '2026-03-09',
  },
];

const aboutData = {
  sections: [
    {
      type: 'profile',
      title: '关于我',
      profile: {
        avatar: '/images/2048.png',
        bio: '主题系统重构中',
        education: [
          { school: 'Demo University', degree: 'Bachelor', major: 'Computer Science', time: '2016-2020' },
        ],
        location: 'Shanghai',
        highlights: ['React', 'TypeScript', 'Design Systems'],
      },
    },
    {
      type: 'skills',
      title: '技能',
      skills: {
        categories: [{ name: 'Frontend', items: ['React', 'TypeScript', 'Emotion'] }],
      },
    },
    {
      type: 'journey',
      title: '经历',
      journey: {
        description: ['持续迭代主题系统'],
        milestones: [{ year: '2026', title: 'Theme Center', description: '完成主题配置中心' }],
      },
    },
    {
      type: 'contact',
      title: '联系',
      contact: {
        items: [{ type: 'Email', icon: 'MailOutlined', value: 'zqdesigned@mail.lnyynet.com', link: 'mailto:zqdesigned@mail.lnyynet.com' }],
      },
    },
  ],
};

const weatherGeo = {
  code: '200',
  location: [{ name: 'Shanghai', id: '101020100', lat: '31.23', lon: '121.47' }],
};

const weatherNow = {
  code: '200',
  now: {
    temp: '22',
    humidity: '60',
    text: '晴',
    windDir: '东风',
    obsTime: '2026-03-09T12:00+08:00',
  },
};

const fulfillJson = (route: Route, payload: unknown) =>
  route.fulfill({
    status: 200,
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

const fulfillSvgPixel = (route: Route) =>
  route.fulfill({
    status: 200,
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#f0f0f0"/></svg>',
  });

export const setupApiMocks = async (page: Page) => {
  await page.route('https://ipapi.co/json/', (route) =>
    route.fulfill({
      status: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ city: 'Shanghai', region: 'Shanghai' }),
    }),
  );

  await page.route('https://geoapi.qweather.com/**', (route) =>
    route.fulfill({
      status: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(weatherGeo),
    }),
  );

  await page.route('https://devapi.qweather.com/**', (route) =>
    route.fulfill({
      status: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(weatherNow),
    }),
  );

  await page.route('https://www.loliapi.com/**', fulfillSvgPixel);
  await page.route('https://static.ipw.cn/**', fulfillSvgPixel);

  await page.route('**/api/**', (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path === '/api/home/content') return fulfillJson(route, ok(homeContent));
    if (path === '/api/home/sidebar') return fulfillJson(route, ok(sidebarData));
    if (path === '/api/footer/profile') return fulfillJson(route, ok(footerProfile));

    if (path === '/api/category/list') return fulfillJson(route, ok([{ id: 1, name: '前端', description: '', articleCount: 1, createTime: '', updateTime: '' }]));
    if (path === '/api/tag/list') return fulfillJson(route, ok([{ id: 1, name: 'Theme', description: '', articleCount: 1, createTime: '', updateTime: '' }]));

    if (path === '/api/blog/list') return fulfillJson(route, ok(blogList));
    if (/^\/api\/blog\/\d+$/.test(path) && request.method() === 'GET') {
      return fulfillJson(route, ok(blogDetail));
    }
    if (/^\/api\/blog\/\d+\/view$/.test(path) && request.method() === 'POST') {
      return fulfillJson(route, ok(124));
    }

    if (path === '/api/project/list') return fulfillJson(route, ok(projects));
    if (/^\/api\/project\/\d+$/.test(path)) return fulfillJson(route, ok(projects[0]));

    if (path === '/api/about/me') return fulfillJson(route, ok(aboutData));

    if (path === '/health' || path === '/actuator/health' || path === '/api/health' || path === '/api/status') {
      return fulfillJson(route, { status: 'UP' });
    }

    return route.fulfill({
      status: 404,
      headers: JSON_HEADERS,
      body: JSON.stringify({ code: 404, msg: 'not found', data: null }),
    });
  });
};
