import type { newsCategories } from '../../config/categories';

export type NewsCategory = (typeof newsCategories)[number];

/** 外部数据源适配后统一成此格式；不将外部信息混入个人内容集合。 */
export interface NewsItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  originalTitle?: string;
  category: NewsCategory;
  publishedAt: string | null;
  discoveredAt: string;
  source: { name: string; url: string };
  readingUrl: string;
  score: number | null;
  selected: boolean;
  attribution: { name: string; url: string };
}

export interface NewsQuery {
  category?: NewsCategory | 'all';
  search?: string;
  cursor?: string;
  signal?: AbortSignal;
}

export interface NewsPage {
  items: NewsItem[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface NewsDaily {
  date: string;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  url: string;
  title: string | null;
  summary: string | null;
  attribution: { name: string; url: string };
}

export interface NewsSnapshot {
  page: NewsPage;
  daily: NewsDaily | null;
  fetchedAt: string | null;
}

export interface NewsProvider {
  name: string;
  fetchItems(query?: NewsQuery): Promise<readonly NewsItem[]>;
}
