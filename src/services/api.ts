import { http } from '../utils/request';
import {
  BlogData,
  FloatSidebarData,
  HomeData,
  FooterProfile,
  AboutMeData
} from '../types/types';

// 博客相关接口
export interface BlogQuery {
  page: string;
  pageSize: string;
  keyword: string;
  tag?: string | undefined;
  category?: string | undefined;
}

export interface BlogListResponse {
    content: BlogData[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    number: number;
    first: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    size: number;
    numberOfElements: number;
    empty: boolean;
}

// 分类和标签接口的响应类型
export interface CategoryData {
  id: number;
  name: string;
  description: string;
  articleCount: number;
  createTime: string;
  updateTime: string;
}

export interface TagData {
  id: number;
  name: string;
  description: string;
  articleCount: number;
  createTime: string;
  updateTime: string;
}

export const blogApi = {
  // 获取博客列表
  getList: async (params: BlogQuery) => {
    // @ts-ignore
    const response = await http.get<BlogListResponse>('/api/blog/list', params);
    console.log(response);
    return {
      content: response.content,
      total: response.totalElements,
      page: response.number + 1,
      pages: response.totalPages
    };
  },

  // 获取博客详情
  getDetail: (id: number) =>
    http.get<BlogData>(`/api/blog/${id}`),

  // 获取博客分类列表
  getCategories: () =>
    http.get<CategoryData[]>('/api/category/list'),

  // 获取博客标签列表
  getTags: () =>
    http.get<TagData[]>('/api/tag/list'),

  // 增加博客阅读量
  increaseViewCount: (id: number) =>
    http.post(`/api/blog/${id}/view`),
};

// 项目相关接口
interface ProjectLink {
  url: string;
  disabled: boolean;
  disabledReason: string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  github: ProjectLink;
  demo: ProjectLink;
  status: 'developing' | 'maintaining' | 'paused';
  features: string[];
  techStack: string[];
  createTime: string;
  updateTime: string;
}

export const projectApi = {
  // 获取项目列表
  getList: () =>
    http.get<Project[]>('/api/project/list'),

  // 获取项目详情
  getDetail: (id: number) =>
    http.get<Project>(`/api/project/${id}`),
};

// 首页相关接口
export const homeApi = {
  // 获取首页内容
  getContent: () =>
    http.get<HomeData>('/api/home/content'),

  // 获取首页统计数据
  getStats: () =>
    http.get<{
      totalArticles: number;
      totalProjects: number;
      totalViews: number;
      lastUpdateTime: string;
    }>('/api/home/stats'),

  // 获取浮动侧边栏数据
  getSidebarData: () =>
    http.get<FloatSidebarData>('/api/home/sidebar'),
};

// 获取页脚个人资料数据
export const getFooterProfile = () => {
  return http.get<FooterProfile>('/api/footer/profile');
};

// 关于我页面接口
export const aboutApi = {
  // 获取关于我页面内容
  getAboutMe: () =>
    http.get<AboutMeData>('/api/about/me'),
};
