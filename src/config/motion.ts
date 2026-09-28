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
  /** 首页匀速打字与逐行输出；打字、输出和光标均由 Motion 驱动。 */
  terminal: {
    initialDelay: 1,
    characterDelay: 0.09,
    enterDelay: 0.3,
    outputDelay: 0.6,
    lineReveal: { duration: 0.22, interval: 0.12, distance: 4 },
    cursorDuration: 1,
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
