import type { newsCategories } from '../../config/categories';

export type NewsCategory = (typeof newsCategories)[number];

/** 外部数据源适配后统一成此格式；不将外部信息混入个人内容集合。 */
export interface NewsItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  category: NewsCategory;
  publishedAt: string;
  source: { name: string; url: string };
}

export interface NewsQuery {
  /** 按 Asia/Shanghai 日期查询，格式 YYYY-MM-DD。 */
  date?: string;
  signal?: AbortSignal;
}

export interface NewsProvider {
  name: string;
  fetchItems(query?: NewsQuery): Promise<readonly NewsItem[]>;
}
