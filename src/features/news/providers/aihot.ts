import type {
  NewsDailyArchive,
  NewsDailyArchiveEntry,
  NewsCategory,
  NewsDaily,
  NewsItem,
  NewsPage,
  NewsProvider,
  NewsQuery,
} from '../types';

/** AIHOT OpenAPI v1；最近七天精选，不读取正文或维护全库镜像。 */
export const aihotOrigin = 'https://aihot.news';
export const newsRefreshInterval = 10 * 60 * 1000;
const categoryToApi: Partial<Record<NewsCategory, string>> = {
  news: 'industry',
  models: 'ai-models',
  products: 'ai-products',
  companies: 'industry',
  research: 'paper',
  tools: 'tip',
};
const categoryFromApi: Record<string, NewsCategory> = {
  'ai-models': 'models',
  'ai-products': 'products',
  industry: 'companies',
  paper: 'research',
  tip: 'tools',
};

function dailyCategory(label: string): NewsCategory {
  if (label.includes('模型')) return 'models';
  if (label.includes('产品')) return 'products';
  if (label.includes('论文')) return 'research';
  if (label.includes('教程') || label.includes('实践')) return 'tools';
  if (label.includes('开源')) return 'open-source';
  if (label.includes('商业') || label.includes('公司')) return 'companies';
  return 'news';
}

function dailyArticle(value: {
  title: string;
  summary?: string;
  source: Record<string, unknown>;
  links: Record<string, unknown>;
  attribution?: unknown;
  discoveredAt: string;
  publishedAt?: string;
  id: string;
  category: NewsCategory;
}): NewsItem {
  const url = httpUrl(value.links.original);
  const readingUrl =
    typeof value.links.aihot === 'string' && value.links.aihot.trim()
      ? httpUrl(value.links.aihot)
      : url;
  return {
    id: value.id,
    title: value.title,
    summary: value.summary?.trim() || undefined,
    category: value.category,
    publishedAt: value.publishedAt ?? null,
    discoveredAt: value.discoveredAt,
    source: { name: string(value.source.name), url },
    url,
    readingUrl,
    score: null,
    selected: false,
    attribution: attribution(value.attribution, readingUrl),
  };
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid AIHOT response');
  return value as Record<string, unknown>;
}

function string(value: unknown): string {
  if (typeof value !== 'string' || !value.trim())
    throw new Error('Invalid AIHOT text');
  return value;
}

function timestamp(value: unknown): string {
  const text = string(value);
  if (!Number.isFinite(Date.parse(text))) throw new Error('Invalid AIHOT date');
  return text;
}

function httpUrl(value: unknown): string {
  const url = new URL(string(value));
  if (!['https:', 'http:'].includes(url.protocol))
    throw new Error('Invalid AIHOT link');
  return url.href;
}

function attribution(value: unknown, fallback: string) {
  if (!value) return { name: 'AIHOT', url: fallback };
  const data = record(value);
  return { name: string(data.name), url: httpUrl(data.url) };
}

export function parseNewsPage(value: unknown): NewsPage {
  const data = record(value);
  const page = record(data.page);
  if (
    data.schemaVersion !== 1 ||
    !Array.isArray(data.items) ||
    typeof page.hasMore !== 'boolean' ||
    (page.nextCursor !== null && typeof page.nextCursor !== 'string') ||
    (page.hasMore && !page.nextCursor)
  )
    throw new Error('Unsupported AIHOT items response');
  const items = data.items.map((value): NewsItem => {
    const item = record(value);
    const links = record(item.links);
    const source = record(item.source);
    const readingUrl = httpUrl(links.aihot);
    const url = httpUrl(links.original);
    return {
      id: string(item.id),
      title: string(item.title),
      originalTitle:
        typeof item.originalTitle === 'string' && item.originalTitle.trim()
          ? item.originalTitle
          : undefined,
      summary:
        typeof item.summary === 'string' && item.summary.trim()
          ? item.summary
          : undefined,
      category:
        typeof item.category === 'string'
          ? (categoryFromApi[item.category] ?? 'news')
          : 'news',
      publishedAt:
        item.publishedAt === null ? null : timestamp(item.publishedAt),
      discoveredAt: timestamp(item.discoveredAt),
      source: { name: string(source.name), url },
      url,
      readingUrl,
      score:
        typeof item.score === 'number' && Number.isFinite(item.score)
          ? item.score
          : null,
      selected: item.selected === true,
      attribution: attribution(item.attribution, readingUrl),
    };
  });
  return { items, hasMore: page.hasMore, nextCursor: page.nextCursor };
}

export function parseNewsDaily(value: unknown): NewsDaily {
  const data = record(value);
  if (data.schemaVersion !== 1)
    throw new Error('Unsupported AIHOT daily response');
  const report = record(data.report);
  const date = string(report.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)))
    throw new Error('Invalid AIHOT edition date');
  const url = httpUrl(record(report.links).aihot);
  const lead = report.lead === null ? null : record(report.lead);
  const generatedAt = timestamp(report.generatedAt);
  const articles: NewsItem[] = [];
  if (lead) {
    articles.push(
      dailyArticle({
        title: string(lead.title),
        summary: string(lead.leadParagraph),
        source: { name: 'AIHOT' },
        links: { aihot: url, original: url },
        attribution: report.attribution,
        discoveredAt: generatedAt,
        id: `daily-${date}-lead`,
        category: 'news',
      }),
    );
  }
  if (!Array.isArray(report.sections)) throw new Error('Invalid AIHOT daily');
  report.sections.forEach((sectionValue, sectionIndex) => {
    const section = record(sectionValue);
    const category = dailyCategory(string(section.label));
    if (!Array.isArray(section.items)) throw new Error('Invalid AIHOT daily');
    section.items.forEach((itemValue, itemIndex) => {
      const item = record(itemValue);
      articles.push(
        dailyArticle({
          title: string(item.title),
          summary: string(item.summary),
          source: record(item.source),
          links: record(item.links),
          attribution: item.attribution,
          discoveredAt: timestamp(report.generatedAt),
          id: `daily-${date}-${sectionIndex}-${itemIndex}`,
          category,
        }),
      );
    });
  });
  if (!Array.isArray(report.flashes)) throw new Error('Invalid AIHOT daily');
  report.flashes.forEach((itemValue, itemIndex) => {
    const item = record(itemValue);
    articles.push(
      dailyArticle({
        title: string(item.title),
        source: record(item.source),
        links: record(item.links),
        attribution: item.attribution,
        discoveredAt: timestamp(item.publishedAt),
        publishedAt: timestamp(item.publishedAt),
        id: `daily-${date}-flash-${itemIndex}`,
        category: 'news',
      }),
    );
  });
  return {
    date,
    url,
    generatedAt,
    windowStart: timestamp(report.windowStart),
    windowEnd: timestamp(report.windowEnd),
    title: lead ? string(lead.title) : null,
    summary: lead ? string(lead.leadParagraph) : null,
    attribution: attribution(report.attribution, url),
    articles,
  };
}

export function parseNewsDailyArchive(value: unknown): NewsDailyArchive {
  const data = record(value);
  if (
    data.schemaVersion !== 1 ||
    typeof data.count !== 'number' ||
    !Array.isArray(data.items)
  )
    throw new Error('Unsupported AIHOT daily archive');
  const items = data.items.map((itemValue): NewsDailyArchiveEntry => {
    const item = record(itemValue);
    const date = string(item.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new Error('Invalid AIHOT archive date');
    const url = httpUrl(record(item.links).aihot);
    return {
      date,
      generatedAt: timestamp(item.generatedAt),
      leadTitle:
        typeof item.leadTitle === 'string' && item.leadTitle.trim()
          ? item.leadTitle
          : null,
      url,
      attribution: attribution(item.attribution, url),
    };
  });
  return { total: data.count, items };
}

export class NewsApiError extends Error {
  status: number;
  code: string;
  retryAt: number;
  requestId: string | null;
  constructor(
    status: number,
    code: string,
    retryAt: number,
    requestId: string | null,
  ) {
    super(`AIHOT ${status}: ${code}`);
    this.status = status;
    this.code = code;
    this.retryAt = retryAt;
    this.requestId = requestId;
  }
}

interface CachedResponse {
  etag: string | null;
  value: unknown;
}
const cache = new Map<string, CachedResponse>();
let retryAt = 0;

async function request(url: string, signal?: AbortSignal): Promise<unknown> {
  if (Date.now() < retryAt)
    throw new NewsApiError(429, 'retry_later', retryAt, null);
  const cached = cache.get(url);
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(cached?.etag ? { 'If-None-Match': cached.etag } : {}),
    },
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(12000)])
      : AbortSignal.timeout(12000),
  });
  if (response.status === 304 && cached) return cached.value;
  if (!response.ok) {
    const problem: unknown = await response.json().catch(() => null);
    const fields =
      problem && typeof problem === 'object' && !Array.isArray(problem)
        ? record(problem)
        : {};
    const retry = response.headers.get('Retry-After');
    const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : null;
    const nextRetry =
      seconds !== null
        ? Date.now() + seconds * 1000
        : retry && Number.isFinite(Date.parse(retry))
          ? Date.parse(retry)
          : Date.now() + (response.status >= 500 ? newsRefreshInterval : 60000);
    if (response.status === 429 || response.status >= 500)
      retryAt = Math.max(retryAt, nextRetry);
    throw new NewsApiError(
      response.status,
      typeof fields.code === 'string' ? fields.code : 'request_failed',
      nextRetry,
      typeof fields.requestId === 'string'
        ? fields.requestId
        : response.headers.get('X-Request-Id'),
    );
  }
  const value: unknown = await response.json();
  // 只有可识别的结构才替换成功缓存，避免损坏响应覆盖旧数据。
  const pathname = new URL(url).pathname;
  if (pathname.endsWith('/items')) parseNewsPage(value);
  else if (pathname === '/api/v1/dailies') parseNewsDailyArchive(value);
  else parseNewsDaily(value);
  if (cache.size >= 30) cache.clear();
  cache.set(url, { etag: response.headers.get('ETag'), value });
  return value;
}

export async function fetchNewsPage(query: NewsQuery = {}): Promise<NewsPage> {
  const url = new URL('/api/v1/items', aihotOrigin);
  url.search = new URLSearchParams({
    mode: 'selected',
    window: '7d',
    limit: '24',
  }).toString();
  if (query.category && query.category !== 'all') {
    const category = categoryToApi[query.category];
    if (category) url.searchParams.set('category', category);
    else if (query.category !== 'open-source')
      throw new Error('Unsupported AIHOT category filter');
  }
  // API 没有独立的开源分类，使用其支持的关键词查询，不改写来源分类。
  const search =
    query.category === 'open-source'
      ? ['开源', query.search].filter(Boolean).join(' ')
      : query.search;
  if (search) url.searchParams.set('q', search);
  if (query.cursor) url.searchParams.set('cursor', query.cursor);
  return parseNewsPage(await request(url.href, query.signal));
}

export async function fetchLatestDaily(
  signal?: AbortSignal,
): Promise<NewsDaily> {
  return parseNewsDaily(
    await request(`${aihotOrigin}/api/v1/dailies/latest`, signal),
  );
}

export async function fetchDailyByDate(
  date: string,
  signal?: AbortSignal,
): Promise<NewsDaily> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Invalid date');
  return parseNewsDaily(
    await request(`${aihotOrigin}/api/v1/dailies/${date}`, signal),
  );
}

export async function fetchDailyArchive(
  signal?: AbortSignal,
): Promise<NewsDailyArchive> {
  const url = new URL('/api/v1/dailies', aihotOrigin);
  url.searchParams.set('limit', '180');
  return parseNewsDailyArchive(await request(url.href, signal));
}

export const aihotProvider: NewsProvider = {
  name: 'AIHOT',
  async fetchItems(query) {
    return (await fetchNewsPage(query)).items;
  },
};
