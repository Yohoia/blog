/** 关于此站的双语文案；个人履历、联系方式由站点主人后续提供。 */
export const aboutContent = {
  zh: {
    eyebrow: '关于 · Yohoia',
    heading: '为想法留一个空间。',
    introduction:
      'Yohoia 是一处个人数字空间，用来写作、记录、创作，也用来收藏值得再次回看的事物。',
    approachTitle: '从记录开始',
    approach:
      '有些想法适合写成完整的文章，有些只需要留下一小段笔记。这里让不同阶段的思考都有自己的位置，在持续记录中慢慢成形。',
    sectionsTitle: '这里记录什么',
    sections: [
      { section: 'writing', description: '整理后的文章、经验和长期思考。' },
      {
        section: 'fragments',
        description: '知识点、阅读笔记与正在形成的想法。',
      },
      { section: 'projects', description: '亲手做过的项目、作品和小型实验。' },
      { section: 'finder', description: '值得留下的网站、工具与互联网发现。' },
    ],
    colophonTitle: '关于这个网站',
    colophon:
      '基于 Astro 构建，采用静态页面、轻量交互和安静的排版。支持中英切换与深浅主题，让内容在不同设备上都能舒适地阅读。',
    back: '返回首页',
  },
  en: {
    eyebrow: 'About · Yohoia',
    heading: 'A space for ideas to take shape.',
    introduction:
      'Yohoia is a personal digital space for writing, taking notes, making things, and keeping discoveries worth returning to.',
    approachTitle: 'Start with a note',
    approach:
      'Some ideas become complete articles. Others only need a short note. This space gives thoughts at different stages a place to grow through an ongoing practice of recording and revisiting.',
    sectionsTitle: 'What lives here',
    sections: [
      {
        section: 'writing',
        description:
          'Considered articles, experiences, and long-term thinking.',
      },
      {
        section: 'fragments',
        description: 'Small notes, reading records, and ideas in progress.',
      },
      {
        section: 'projects',
        description: 'Projects, creative work, and small experiments.',
      },
      {
        section: 'finder',
        description: 'Websites, tools, and discoveries worth keeping.',
      },
    ],
    colophonTitle: 'About this website',
    colophon:
      'Built with Astro, using static pages, lightweight interactions, and quiet typography. Available in Chinese and English, with light and dark themes for comfortable reading across devices.',
    back: 'Back to home',
  },
} as const;
