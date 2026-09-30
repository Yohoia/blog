import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import {
  fetchNewsPage,
  fetchLatestDaily,
  fetchDailyArchive,
  parseNewsPage,
  parseNewsDaily,
  parseNewsDailyArchive,
  NewsApiError,
} from '../src/features/news/providers/aihot.ts';

const item = {
  id: 'test-item',
  title: '<script>not executable</script>',
  originalTitle: null,
  summary: null,
  category: 'future-category',
  source: { name: 'Test source' },
  links: {
    original: 'https://source.example/article',
    aihot: 'https://aihot.news/items/test-item',
  },
  publishedAt: null,
  discoveredAt: '2026-09-29T00:00:00Z',
  score: null,
  selected: true,
  attribution: { name: 'AIHOT', url: 'https://aihot.news/items/test-item' },
};
const page = {
  schemaVersion: 1,
  items: [item],
  page: { count: 1, hasMore: true, nextCursor: 'opaque-cursor' },
};
const daily = {
  schemaVersion: 1,
  report: {
    date: '2026-09-29',
    generatedAt: '2026-09-29T00:00:00Z',
    windowStart: '2026-09-28T00:00:00Z',
    windowEnd: '2026-09-29T00:00:00Z',
    links: { aihot: 'https://aihot.news/daily/2026-09-29' },
    lead: null,
    sections: [
      {
        label: '模型发布/更新',
        items: [
          {
            title: 'Daily model update',
            summary: 'A validated daily summary.',
            source: { name: 'Test source' },
            links: {
              aihot: 'https://aihot.news/items/daily-model',
              original: 'https://source.example/model',
            },
          },
        ],
      },
    ],
    flashes: [],
  },
};
const archive = {
  schemaVersion: 1,
  count: 1,
  items: [
    {
      date: '2026-09-29',
      generatedAt: '2026-09-29T00:00:00Z',
      leadTitle: null,
      links: { aihot: 'https://aihot.news/daily/2026-09-29' },
    },
  ],
};

test('v1 normalization tolerates nullable fields and future categories; retains provenance', () => {
  const result = parseNewsPage(page);
  assert.equal(result.items[0].category, 'news');
  assert.equal(result.items[0].sourceCategory, 'future-category');
  assert.equal(result.items[0].publishedAt, null);
  assert.equal(result.items[0].summary, undefined);
  assert.equal(result.items[0].title, item.title);
  assert.equal(result.items[0].attribution.url, item.attribution.url);
  assert.equal(result.nextCursor, 'opaque-cursor');
  const industryItem = parseNewsPage({
    ...page,
    items: [{ ...item, category: 'industry' }],
  }).items[0];
  assert.equal(industryItem.category, 'companies');
  assert.equal(industryItem.sourceCategory, 'industry');
  const normalizedDaily = parseNewsDaily(daily);
  assert.equal(normalizedDaily.title, null);
  assert.equal(normalizedDaily.articles.length, 1);
  assert.equal(normalizedDaily.articles[0].category, 'models');
  assert.equal(
    normalizedDaily.articles[0].readingUrl,
    'https://aihot.news/items/daily-model',
  );
  assert.deepEqual(parseNewsDailyArchive(archive), {
    total: 1,
    items: [
      {
        date: '2026-09-29',
        generatedAt: '2026-09-29T00:00:00Z',
        leadTitle: null,
        url: 'https://aihot.news/daily/2026-09-29',
        attribution: {
          name: 'AIHOT',
          url: 'https://aihot.news/daily/2026-09-29',
        },
      },
    ],
  });
});

test('rejects executable URLs, incompatible schemas and missing pagination cursor', () => {
  assert.throws(() => parseNewsPage({ ...page, schemaVersion: 2 }));
  assert.throws(() =>
    parseNewsPage({ ...page, page: { hasMore: true, nextCursor: null } }),
  );
  assert.throws(() =>
    parseNewsPage({
      ...page,
      items: [
        { ...item, links: { ...item.links, original: 'javascript:alert(1)' } },
      ],
    }),
  );
});

test('maps filters, preserves opaque cursor, reuses ETag on 304 and fetches top-level report', async () => {
  const calls = [];
  const responses = [
    Response.json(page, { headers: { ETag: '"test-etag"' } }),
    new Response(null, { status: 304 }),
    Response.json(daily),
  ];
  const fetchMock = mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: String(url), options });
    return responses.shift();
  });
  try {
    const query = {
      category: 'models',
      search: 'AI test',
      cursor: 'opaque&cursor',
    };
    const first = await fetchNewsPage(query);
    const second = await fetchNewsPage(query);
    assert.deepEqual(first, second);
    const url = new URL(calls[0].url);
    assert.equal(url.pathname, '/api/v1/items');
    assert.equal(url.searchParams.get('category'), 'ai-models');
    assert.equal(url.searchParams.get('q'), 'AI test');
    assert.equal(url.searchParams.get('cursor'), 'opaque&cursor');
    assert.equal(calls[1].options.headers['If-None-Match'], '"test-etag"');
    assert.equal((await fetchLatestDaily()).date, '2026-09-29');
  } finally {
    fetchMock.mock.restore();
  }
});

test('routes daily archive requests to the date index', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () =>
    Response.json(archive),
  );
  try {
    const result = await fetchDailyArchive();
    assert.equal(result.total, 1);
    assert.equal(
      new URL(fetchMock.mock.calls[0].arguments[0]).pathname,
      '/api/v1/dailies',
    );
  } finally {
    fetchMock.mock.restore();
  }
});

test('routes industry and open-source tabs through supported API filters', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () =>
    Response.json(page),
  );
  try {
    await fetchNewsPage({ category: 'news' });
    await fetchNewsPage({ category: 'open-source' });
    const industryUrl = new URL(fetchMock.mock.calls[0].arguments[0]);
    const openSourceUrl = new URL(fetchMock.mock.calls[1].arguments[0]);
    assert.equal(industryUrl.searchParams.get('category'), 'industry');
    assert.equal(openSourceUrl.searchParams.get('category'), null);
    assert.equal(openSourceUrl.searchParams.get('q'), '开源');
  } finally {
    fetchMock.mock.restore();
  }
});

test('honors Retry-After globally without issuing another request', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () =>
    Response.json(
      { code: 'rate_limited', requestId: 'test-request' },
      { status: 429, headers: { 'Retry-After': '60' } },
    ),
  );
  try {
    await assert.rejects(
      fetchNewsPage(),
      (error) =>
        error instanceof NewsApiError &&
        error.retryAt >= Date.now() + 59000 &&
        error.requestId === 'test-request',
    );
    await assert.rejects(
      fetchNewsPage(),
      (error) => error instanceof NewsApiError && error.code === 'retry_later',
    );
    assert.equal(fetchMock.mock.callCount(), 1);
  } finally {
    fetchMock.mock.restore();
  }
});
