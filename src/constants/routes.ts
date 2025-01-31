export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:id',
  ABOUT: '/about',
  PROJECTS: '/projects',
} as const;

export type RouteKey = keyof typeof ROUTES;

export const NAV_ITEMS = [
  {
    key: 'HOME',
    label: '首页',
    path: ROUTES.HOME,
  },
  {
    key: 'BLOG',
    label: '博客',
    path: ROUTES.BLOG,
  },
  {
    key: 'PROJECTS',
    label: '项目',
    path: ROUTES.PROJECTS,
  },
  {
    key: 'ABOUT',
    label: '关于我',
    path: ROUTES.ABOUT,
  },
] as const; 