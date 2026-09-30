/** design.md §10。Motion 的时长单位为秒；只在解释状态变化时使用。 */
export const motionTokens = {
  duration: {
    micro: 0.15,
    ui: 0.22,
    page: 0.28,
    fast: 0.15,
    normal: 0.22,
    slow: 0.3,
  },
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: {
    soft: { type: 'spring', stiffness: 180, damping: 24 },
    snappy: { type: 'spring', stiffness: 320, damping: 30 },
  },
  distance: { small: 4, medium: 8, large: 12 },
  scale: { pressed: 0.98, resting: 1 },
  reduced: { duration: 0.12 },
  /** Writing 期刊式归档：只弱化其余标题，元信息始终保持可读。 */
  writing: {
    inactiveTitleOpacity: 0.72,
    arrowRestingScale: 0.6,
    arrowHoverDistance: 2,
    highlightDuration: 0.38,
  },
  article: {
    tocRevealDuration: 0.15,
    tocCloseDelay: 130,
  },
  /** News 分类指示线与内容切换；减少动画时即时切换。 */
  news: {
    tabHoverDistance: 4,
    heatHoverScale: 1.08,
    heatHoverDuration: 0.15,
    tabDuration: 0.22,
    contentExitDuration: 0.1,
    contentEnterDuration: 0.22,
  },
  /** navigation-lab Type Overlay：圆形展开与 Typography 逐项进入。 */
  menu: {
    revealDuration: 0.65,
    closeDuration: 0.5,
    revealEase: [0.75, 0, 0.2, 1] as [number, number, number, number],
    itemDuration: 0.4,
    itemDelay: 0.2,
    stagger: 0.04,
    itemDistance: 22,
    exitDuration: 0.18,
    hoverDuration: 0.18,
    hoverDistance: 16,
  },
  /** 导航栏目专用：噪声网格铺满 → 页面交换 → 同一网格退场。 */
  navigationTransition: {
    fillDuration: 0.5,
    clearDuration: 0.5,
    cellSize: 14,
    maxCells: 8000,
    maxPixelRatio: 2,
    framesPerSecond: 30,
    shuffleInterval: 50,
    dimOpacity: 0.35,
    edgeWidth: 0.06,
    noiseScale: 0.18,
    timeout: 15000,
  },
  /** 首页匀速打字与逐行输出；打字、输出和光标均由 Motion 驱动。 */
  terminal: {
    initialDelay: 1,
    characterDelay: 0.09,
    enterDelay: 0.3,
    outputDelay: 0.6,
    lineReveal: { duration: 0.22, interval: 0.12, distance: 4 },
    cursorDuration: 1,
  },
  /** whoami 头像：与信息输出同步聚合；悬浮重播保留 HTML 预览的节奏。 */
  avatar: {
    duration: 1.05,
    pointDuration: 0.75,
    rowDelay: 0.18,
    randomDelay: 0.1,
    scatter: { min: 16, max: 48 },
  },
  /** 品牌书写时序保留 yohoia-logo-v3 的连续笔迹，区别于通用 UI 过渡。 */
  logo: {
    strokes: [
      {
        name: 'opening',
        at: 0.04,
        duration: 0.32,
        ease: [0.42, 0, 0.22, 1] as [number, number, number, number],
      },
      {
        name: 'junction',
        at: 0.33,
        duration: 0.42,
        ease: [0.42, 0, 0.24, 1] as [number, number, number, number],
      },
      {
        name: 'body',
        at: 0.69,
        duration: 1.14,
        ease: [0.58, 0, 0.25, 1] as [number, number, number, number],
      },
      {
        name: 'terminal',
        at: 1.62,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    ],
    dot: { at: 1.94, duration: 0.15, initialScale: 0.55 },
  },
} as const;
