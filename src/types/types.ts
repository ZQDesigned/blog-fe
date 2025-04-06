export interface BlogData {
  id: number;
  title: string;
  content: string;
  summary: string;
  categoryId: number;
  categoryName: string;
  tagIds: number[];
  tagNames: string[];
  viewCount: number;
  createTime: string;
  updateTime: string;
}

// 首页内容类型定义
export type HomeContentType = 'banner' | 'features' | 'skills' | 'timeline' | 'contact';

// Banner 类型
export interface HomeBanner {
  type: 'banner';
  title: string;
  description: string;
  banner: {
    subtitle: string;
    backgroundImage: string;
    buttons: {
      text: string;
      link: string;
      type?: 'primary' | 'default';
      icon?: string;
    }[];
  };
}

// 特性展示类型
export interface HomeFeature {
  type: 'features';
  title: string;
  description: string;
  items: {
    icon: string;
    title: string;
    description: string;
    link?: string;
  }[];
}

// 技能展示类型
export interface HomeSkills {
  type: 'skills';
  title: string;
  description: string;
  categories: {
    name: string;
    items: {
      name: string;
      icon?: string;
      level: number; // 1-5
      description?: string;
    }[];
  }[];
}

// 时间线类型
export interface HomeTimeline {
  type: 'timeline';
  title: string;
  description: string;
  timelineItems: {
    date: string;
    title: string;
    description: string;
    icon?: string;
    color?: string;
  }[];
}

// 联系方式类型
export interface HomeContact {
  type: 'contact';
  title: string;
  description: string;
  contactItems: {
    type: string;
    icon: string;
    value: string;
    link?: string;
  }[];
}

// 首页内容项类型
export type HomeContentItem = 
  | HomeBanner 
  | HomeFeature 
  | HomeSkills 
  | HomeTimeline 
  | HomeContact;

// 首页完整数据结构
export interface HomeData {
  sections: HomeContentItem[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
    updateTime: string;
  };
}

// 浮动侧边栏数据类型
export interface FloatSidebarData {
  profile: {
    avatar: string;
    name: string;
    bio: string;
    status: {
      online: boolean;
      text: string;
    };
  };
  announcements: {
    title: string;
    content: string;
    type?: 'text' | 'link';
    link?: string;
  }[];
  contact: {
    email: string;
  };
  settings: {
    showWeather: boolean;
  };
}

// 页脚个人资料数据类型
export interface FooterProfile {
  links: {
    title: string;
    url: string;
    icon?: string;
    isExternal?: boolean;
  }[];
} 