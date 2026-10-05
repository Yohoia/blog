/** 个人介绍、工具与教育经历来自用户；workflows 统计仍为暂留的参考内容。 */
export const terminalContent = {
  identity: {
    role: 'AI Application Engineer',
    experience: 'Independent Learner & Software Developer',
    location: 'Based in China',
  },
  philosophy: {
    zh: '不要想AI能为你做什么，而是想你能为AI做什么',
    en: ["Don't ask what AI can do for you —", 'ask what you can do for AI.'],
  },
  workflows: [
    {
      emphasis: '95%',
      text: 'of production code shipped through agentic coding workflows',
    },
    { emphasis: '24B+ tokens', text: 'burned across agentic coding sessions' },
    { text: 'Built custom eval tools, skill systems, and agent orchestration' },
    { text: 'Claude Code + Codex + Cursor — building tools for the tools' },
    { text: '1.5 years of daily agentic coding in production', muted: true },
  ],
  posts: {
    permissions: '-rw-r--r--',
    limit: 6,
    hint: '// latest 6 posts — view all in Blog',
  },
  tools: [
    {
      name: 'Codex',
      href: 'https://openai.com/codex/',
      description: '— AI coding assistant for building and refining software',
    },
    {
      name: 'Claude Code',
      href: 'https://claude.com/product/claude-code',
      description: '— Terminal-based AI assistant for coding and debugging',
    },
    {
      name: 'VS Code',
      href: 'https://code.visualstudio.com/',
      description: '— Code editor for development and debugging',
    },
    {
      name: 'CC Switch',
      href: 'https://ccswitch.io/',
      description: '— Manage and switch AI coding tool configurations',
    },
    {
      name: 'Clash Verge',
      href: 'https://www.clashverge.dev/',
      description: '— Desktop client for managing proxy connections',
    },
  ],
  education: [
    {
      hash: 'a1b2c3d',
      year: '2012',
      role: 'Junior High School Student @',
      institution: 'Jinxian No. 2 Middle School',
    },
    {
      hash: 'd4e5f6a',
      year: '2015',
      role: 'Senior High School Student @',
      institution: 'Jinxian No. 2 Middle School',
    },
    {
      hash: 'b7c8d9e',
      year: '2018',
      role: 'Undergraduate Student @',
      institution: 'East China Jiaotong University',
    },
    {
      hash: 'f0a1b2c',
      year: '2023',
      role: 'Graduate Student @',
      institution: 'Xiamen University of Technology',
    },
  ],
} as const;

export const terminalSequence = [
  { id: 'identity', command: 'whoami' },
  { id: 'philosophy', command: 'cat philosophy.md' },
  { id: 'workflows', command: 'claude-code --stats' },
  {
    id: 'posts',
    command: 'ls -ltr blog/ | tail -n 6',
  },
  { id: 'tools', command: 'ls tools/' },
  { id: 'education', command: 'git log --oneline --reverse education/' },
  { id: 'links', command: 'pr -2 -t links.md' },
] as const;

export const terminalLabels = {
  zh: {
    title: 'Yohoia 的个人介绍',
    output: '自动播放的个人介绍，随页面向下展开',
    dateFallback: '启用 JavaScript 后显示访问时间',
    avatar: 'Yohoia 的像素头像，点击重播聚合动画',
    copyWeChat: '复制微信号码',
    copiedWeChat: '微信号码已复制',
    copyFailed: '无法复制，请手动复制微信号码',
  },
  en: {
    title: 'Yohoia’s introduction',
    output: 'An automated introduction that unfolds down the page.',
    dateFallback: 'Visit time is available with JavaScript enabled',
    avatar: 'Yohoia’s pixel portrait. Activate to replay the animation.',
    copyWeChat: 'Copy WeChat number',
    copiedWeChat: 'WeChat number copied',
    copyFailed: 'Unable to copy. Please copy the WeChat number manually.',
  },
} as const;
