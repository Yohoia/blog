/** 参考稿文案经用户确认暂时保留；公司、履历与统计是待替换的展示内容。 */
export const terminalContent = {
  identity: {
    role: 'CTO & Co-Founder @',
    company: 'Compute Labs',
    experience: 'Ex-Airbnb, Apple, AWS — AI/ML veteran',
    location: 'Redmond, WA',
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
    hint: '// latest 6 posts — view all in Writing',
  },
  agents: [
    {
      name: 'deal-evaluator/',
      description: '— 11 parallel AI sub-agents, multi-model orchestration',
    },
    {
      name: 'market-intel/',
      description: '— LLM-powered scraping, 45+ providers, 3200+ prices',
    },
    {
      name: 'workflow-engine/',
      description: '— state machine orchestrating $1.3B+ in GPU deals',
    },
    {
      name: 'prompt-lab/',
      description: '— A/B testing across Claude, Gemini, OpenAI',
    },
  ],
  career: [
    {
      hash: 'a1b2c3d',
      year: '2019',
      role: 'ML Engineer @',
      company: 'Airbnb',
      description: '— fraud detection, real-time ML inference',
    },
    {
      hash: 'd4e5f6a',
      year: '2020',
      role: 'ML Engineer @',
      company: 'Apple',
      description: '— Siri AI, on-device ML, BERT',
    },
    {
      hash: 'b7c8d9e',
      year: '2022',
      role: 'Sr SWE @',
      company: 'AWS Athena',
      description: '— petabyte-scale data infra',
    },
    {
      hash: 'f0a1b2c',
      year: '2024',
      role: 'CTO @',
      company: 'Compute Labs',
      description: '— multi-agent AI systems',
    },
  ],
} as const;

export const terminalSequence = [
  { id: 'identity', command: 'whoami' },
  { id: 'philosophy', command: 'cat philosophy.md' },
  { id: 'workflows', command: 'claude-code --stats' },
  {
    id: 'posts',
    command: 'ls -ltr writing/ | tail -n 6',
  },
  { id: 'agents', command: 'ls compute-labs/agents/' },
  { id: 'career', command: 'git log --oneline --reverse career/' },
  { id: 'links', command: 'cat links.md' },
] as const;

export const terminalLabels = {
  zh: {
    title: 'Yohoia 的个人介绍',
    output: '自动播放的个人介绍，随页面向下展开',
    dateFallback: '启用 JavaScript 后显示访问时间',
  },
  en: {
    title: 'Yohoia’s introduction',
    output: 'An automated introduction that unfolds down the page.',
    dateFallback: 'Visit time is available with JavaScript enabled',
  },
} as const;
