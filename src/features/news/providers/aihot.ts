import type {
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
  return {
    date,
    url,
    generatedAt: timestamp(report.generatedAt),
    windowStart: timestamp(report.windowStart),
    windowEnd: timestamp(report.windowEnd),
    title: lead ? string(lead.title) : null,
    summary: lead ? string(lead.leadParagraph) : null,
    attribution: attribution(report.attribution, url),
  };
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
  if (new URL(url).pathname.endsWith('/items')) parseNewsPage(value);
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
    if (!category) throw new Error('Unsupported AIHOT category filter');
    url.searchParams.set('category', category);
  }
  if (query.search) url.searchParams.set('q', query.search);
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

export const aihotProvider: NewsProvider = {
  name: 'AIHOT',
  async fetchItems(query) {
    return (await fetchNewsPage(query)).items;
  },
};
