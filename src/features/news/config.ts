import type { Locale } from '@/config/i18n';
import type { NewsCategory } from './types';

export const newsFilters = [
  'all',
  'models',
  'products',
  'companies',
  'research',
  'tools',
] as const;
export const newsContent = {
  zh: {
    description: '来自 AIHOT 的 AI 行业精选、模型与产品动态，以及每日观察。',
    edition: 'AI 每日观察',
    editionEnglish: 'DAILY INTELLIGENCE',
    window: '近七日 · 精选',
    stories: '篇报道',
    showing: '已载入',
    updated: '更新于',
    timezone: '北京时间',
    filters: '资讯分类',
    search: '搜索资讯',
    closeSearch: '收起搜索',
    clearSearch: '清空搜索',
    searchPlaceholder: '搜索关键词…',
    searchHint: '请输入 2–200 个字符。',
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
    languageNote: '标题与摘要保留数据源提供的文字。',
    footer: '数据来源：AIHOT。摘要由 AI 辅助生成，新闻事实以原文为准。',
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
    window: 'Past 7 days · Selected',
    stories: 'stories',
    showing: 'Loaded',
    updated: 'Updated',
    timezone: 'Beijing time',
    filters: 'News categories',
    search: 'Search news',
    closeSearch: 'Collapse search',
    clearSearch: 'Clear search',
    searchPlaceholder: 'Search keywords…',
    searchHint: 'Enter 2–200 characters.',
    refresh: 'Refresh news',
    more: 'Load more',
    loading: 'Updating…',
    fresh: 'News updated',
    failed:
      'Unable to update. Try again later; previously loaded stories remain available.',
    rateLimited:
      'Requests are temporarily limited. Please wait before retrying.',
    retry: 'Retry after',
    empty: 'No stories match your search.',
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
    languageNote:
      'Original headlines where available; summaries remain in the source language.',
    footer:
      'Source: AIHOT. Summaries are AI-assisted; check the original reporting for facts.',
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
