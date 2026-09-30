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
  /** 分类映射用于页面分组；此字段保留 API 提供的原始分类值。 */
  sourceCategory?: string;
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
  /** 日报正文条目是适配后的只读视图；日期版面不使用滚动窗口游标。 */
  articles: NewsItem[];
}

export interface NewsDailyArchiveEntry {
  date: string;
  generatedAt: string;
  leadTitle: string | null;
  url: string;
  attribution: { name: string; url: string };
}

export interface NewsDailyArchive {
  total: number;
  items: NewsDailyArchiveEntry[];
}

export interface NewsSnapshot {
  page: NewsPage;
  daily: NewsDaily | null;
  fetchedAt: string | null;
  archive: NewsDailyArchiveEntry[];
  archiveTotal: number;
}

export interface NewsProvider {
  name: string;
  fetchItems(query?: NewsQuery): Promise<readonly NewsItem[]>;
}
