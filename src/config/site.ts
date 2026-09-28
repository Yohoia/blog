const email = 'imyohoia@gmail.com';
const github = 'https://github.com/Yohoia';

/** 站点资料和用户确认的联系方式在这里集中维护。 */
export const siteConfig = {
  name: 'Yohoia',
  description: '文章、碎片笔记、作品与发现组成的个人数字空间。',
  timeZone: 'Asia/Shanghai',
  contact: {
    email,
    github,
  },
  contactLinks: [
    {
      icon: 'gmail',
      label: `Email: ${email}`,
      href: `mailto:${email}`,
    },
    {
      icon: 'qq',
      label: 'QQ: 1109951287',
      href: 'https://wpa.qq.com/msgrd?v=3&uin=1109951287&site=qq&menu=yes',
    },
    {
      icon: 'x',
      label: 'X: @imYohoia',
      href: 'https://x.com/imYohoia',
    },
    {
      icon: 'xiaohongshu',
      label: '小红书: Yohoia',
      href: 'https://xhslink.cn/o/2uKZjCQ4rPa',
    },
    {
      icon: 'bilibili',
      label: 'Bilibili: @Yohoia',
      href: 'https://b23.tv/cPvuHiv',
    },
    {
      icon: 'github',
      label: 'GitHub: @Yohoia',
      href: github,
    },
  ],
} as const;
