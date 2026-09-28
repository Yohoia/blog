/** 用户提供的参考条目；按日期由旧到新排列，同日沿用提供顺序，正文待补充。 */
export const referenceWritingEntries = [
  {
    date: 'Feb 19',
    filename: 'the-companion-vision.md',
    title: 'Building AI That Truly Understands You',
  },
  {
    date: 'Feb 19',
    filename: 'the-agent-economy.md',
    title: 'Agent Marketplaces and Proxy Social Networks',
  },
  {
    date: 'Feb 19',
    filename: 'wearables-and-companions.md',
    title: 'Wearables as the Nervous System of AI Companions',
  },
  {
    date: 'Feb 21',
    filename: 'when-software-becomes-disposable.md',
    title: 'When Software Becomes Disposable',
  },
  {
    date: 'Feb 22',
    filename: 'the-last-mile-of-ai.md',
    title: 'The Last Mile of AI',
  },
  {
    date: 'Feb 22',
    filename: 'you-are-the-manager.md',
    title: 'You Are the Manager',
  },
  {
    date: 'Feb 22',
    filename: 'why-claude-code.md',
    title: 'Why Claude Code',
  },
  {
    date: 'Feb 22',
    filename: 'the-printing-press-moment.md',
    title: 'The Printing Press Moment',
  },
  {
    date: 'Feb 22',
    filename: 'the-agent-comes-home.md',
    title: 'The Agent Comes Home',
  },
] as const;

export const writingContent = {
  zh: {
    introduction: '文章、经验与长期思考。',
    count: '篇文章',
    note: '当前保留参考文章列表，正文待补充。',
    back: '返回首页',
  },
  en: {
    introduction: 'Articles, experiences, and long-term thinking.',
    count: 'posts',
    note: 'Reference entries for now; full articles will be added later.',
    back: 'Back to home',
  },
} as const;
