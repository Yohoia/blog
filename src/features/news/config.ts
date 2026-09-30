import type { Locale } from '@/config/i18n';
import type { NewsCategory } from './types';

export const newsFilters = [
  'all',
  'news',
  'models',
  'products',
  'companies',
  'research',
  'open-source',
  'tools',
] as const;
export const newsContent = {
  zh: {
    description: '来自 AIHOT 的 AI 行业精选、模型与产品动态，以及每日观察。',
    edition: 'AI 每日观察',
    editionEnglish: 'DAILY INTELLIGENCE',
    dailyTitle: '日报',
    issue: '第',
    issueUnit: '期',
    monthIssueUnit: '期',
    calendar: '日报日期',
    calendarRange: '热力图时间范围',
    dailyUpdated: '日报已更新。',
    window: '近七日 · 精选',
    stories: '篇报道',
    monthIssues(count: number) {
      return `本月 ${count} 期`;
    },
    showing: '已载入',
    updated: '更新于',
    timezone: '北京时间',
    filters: '资讯分类',
    refresh: '刷新资讯',
    more: '载入更多',
    loading: '正在更新…',
    fresh: '资讯已更新',
    failed: '暂时无法更新，请稍后重试。已有资讯仍可阅读。',
    rateLimited: '请求暂受限制，请按提示时间稍后重试。',
    retry: '可重试时间',
    empty: '没有找到匹配的资讯。',
    unavailable: '资讯暂未载入，请刷新重试，或前往 AIHOT 阅读。',
    stale: '正在显示上次成功载入的资讯。',
    lead: '头版头条',
    briefs: '本版短讯',
    other: '继续阅读',
    selected: '精选',
    original: '阅读原文',
    reading: 'AIHOT 导读',
    unknownDate: '发布时间未提供',
    discovered: '收录于',
    daily: '本期日报',
    dailyNote: '每日汇总，保留信源的统计时间范围。',
    dailyEmpty: '本期日报暂不可用。',
    dailyRead: '阅读完整日报',
    generated: '生成于',
    period: '统计窗口',
    home: '返回首页',
    categories: {
      all: '全部头条',
      news: '行业动态',
      models: '模型前沿',
      products: '产品发布',
      companies: '商业动态',
      research: '论文研究',
      tools: '教程实践',
      'open-source': '开源',
    },
  },
  en: {
    description:
      'Selected AI news, model and product updates, and daily intelligence from AIHOT.',
    edition: 'AI daily intelligence',
    editionEnglish: 'DAILY INTELLIGENCE',
    dailyTitle: 'Daily',
    issue: 'Issue',
    issueUnit: '',
    monthIssueUnit: 'issues',
    calendar: 'Daily archive dates',
    calendarRange: 'Heatmap time range',
    dailyUpdated: 'Daily report loaded.',
    window: 'Past 7 days · Selected',
    stories: 'stories',
    monthIssues(count: number) {
      return `${count} ${count === 1 ? 'issue' : 'issues'} this month`;
    },
    showing: 'Loaded',
    updated: 'Updated',
    timezone: 'Beijing time',
    filters: 'News categories',
    refresh: 'Refresh news',
    more: 'Load more',
    loading: 'Updating…',
    fresh: 'News updated',
    failed:
      'Unable to update. Try again later; previously loaded stories remain available.',
    rateLimited:
      'Requests are temporarily limited. Please wait before retrying.',
    retry: 'Retry after',
    empty: 'No stories in this category.',
    unavailable: 'News is unavailable. Try refreshing, or read on AIHOT.',
    stale: 'Showing the last successfully loaded stories.',
    lead: 'Top story',
    briefs: 'The brief',
    other: 'In other news',
    selected: 'Selected',
    original: 'Read original',
    reading: 'AIHOT digest',
    unknownDate: 'Publication time unavailable',
    discovered: 'Collected',
    daily: 'The daily edition',
    dailyNote: 'A daily digest with its original reporting window.',
    dailyEmpty: 'The latest daily report is unavailable.',
    dailyRead: 'Read full report',
    generated: 'Generated',
    period: 'Reporting window',
    home: 'Back to Index',
    categories: {
      all: 'Front page',
      news: 'Industry',
      models: 'Models',
      products: 'Products',
      companies: 'Business',
      research: 'Research',
      tools: 'Tutorials',
      'open-source': 'Open source',
    },
  },
} satisfies Record<
  Locale,
  { categories: Record<NewsCategory | 'all', string> } & Record<string, unknown>
>;

export function newsTitle(
  item: { title: string; originalTitle?: string },
  locale: Locale,
): string {
  return locale === 'en' ? (item.originalTitle ?? item.title) : item.title;
}
export function newsTextLanguage(text: string): string {
  return /\p{Script=Han}/u.test(text) ? 'zh-CN' : 'en';
}
export function formatNewsTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(value));
}
export function formatEditionDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(value));
}

export function formatCalendarMonth(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatCalendarYearMonth(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatCalendarDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatCalendarWeekday(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function calendarMonthCells(
  selectedDate: string,
  availableDates: readonly string[],
): Array<string | null> {
  const date = new Date(`${selectedDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return [];
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const available = new Set(availableDates);
  return Array.from({ length: offset + days }, (_, index) => {
    if (index < offset) return null;
    const value = `${year}-${String(month + 1).padStart(2, '0')}-${String(index - offset + 1).padStart(2, '0')}`;
    return available.has(value) ? value : null;
  });
}
