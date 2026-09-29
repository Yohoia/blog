/** 当前参考条目；日期读取各条 publishedAt，标签按标题分类，正文待补充。
 * 按日期由旧到新排列，同日沿用提供顺序；date 保留首页的终端短日期显示。
 */
export const referenceWritingEntries = [
  {
    date: 'Sep 15',
    filename: 'the-companion-vision.md',
    title: 'Building AI That Truly Understands You',
    publishedAt: '2024-09-15',
    tags: ['AI', 'Companions', 'Vision'],
  },
  {
    date: 'Oct 08',
    filename: 'the-agent-economy.md',
    title: 'Agent Marketplaces and Proxy Social Networks',
    publishedAt: '2024-10-08',
    tags: ['AI', 'Agents', 'Marketplaces'],
  },
  {
    date: 'Nov 22',
    filename: 'wearables-and-companions.md',
    title: 'Wearables as the Nervous System of AI Companions',
    publishedAt: '2024-11-22',
    tags: ['AI', 'Wearables', 'Companions'],
  },
  {
    date: 'Jan 10',
    filename: 'when-software-becomes-disposable.md',
    title: 'When Software Becomes Disposable',
    publishedAt: '2025-01-10',
    tags: ['Software', 'AI', 'Engineering'],
  },
  {
    date: 'Mar 05',
    filename: 'the-last-mile-of-ai.md',
    title: 'The Last Mile of AI',
    publishedAt: '2025-03-05',
    tags: ['AI', 'Engineering', 'Product'],
  },
  {
    date: 'Mar 18',
    filename: 'you-are-the-manager.md',
    title: 'You Are the Manager',
    publishedAt: '2025-03-18',
    tags: ['AI', 'Agents', 'Workflow'],
  },
  {
    date: 'Jul 12',
    filename: 'why-claude-code.md',
    title: 'Why Claude Code',
    publishedAt: '2025-07-12',
    tags: ['ClaudeCode', 'AI', 'Coding'],
  },
  {
    date: 'Feb 19',
    filename: 'the-printing-press-moment.md',
    title: 'The Printing Press Moment',
    publishedAt: '2026-02-19',
    tags: ['AI', 'Technology', 'Software'],
  },
  {
    date: 'Feb 22',
    filename: 'the-agent-comes-home.md',
    title: 'The Agent Comes Home',
    publishedAt: '2026-02-22',
    tags: ['AI', 'Agents', 'Companions'],
  },
] as const;

export const writingContent = {
  zh: {
    introduction: '文章、经验与长期思考。',
    count: '篇文章',
    note: '当前保留参考文章列表，正文待补充。',
    back: '返回上一级：首页',
  },
  en: {
    introduction: 'Articles, experiences, and long-term thinking.',
    count: 'posts',
    note: 'Reference entries for now; full articles will be added later.',
    back: 'Up one level: home',
  },
} as const;
