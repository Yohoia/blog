/** 首页文案独立配置；个人资料确定后替换介绍，避免把参考稿身份当作事实。 */
export const indexContent = {
  recentLimit: 6,
  translations: {
    zh: {
      heading: '安静地记录，认真地探索。',
      introduction:
        '记录技术、细致的界面，以及值得留下的事物。这里是一个用于写作、实验与发现的个人空间。',
    },
    en: {
      heading: 'Record quietly. Explore thoughtfully.',
      introduction:
        'Notes on technology, thoughtful interfaces, and things worth keeping. A personal space for writing, experiments, and discoveries.',
    },
  },
} as const;
