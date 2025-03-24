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