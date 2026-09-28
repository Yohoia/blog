let navigatedWithinSite = false;

// BaseLayout 提前加载本模块，包含先访问其他页面、再通过 ClientRouter 回首页的情况。
document.addEventListener('astro:before-swap', () => {
  navigatedWithinSite = true;
});

/** 只有当前文档的浏览器刷新允许自动播放，站内切换与历史返回都直接显示内容。 */
export function isRefreshVisit(): boolean {
  const visit = performance.getEntriesByType('navigation')[0];
  return (
    !navigatedWithinSite &&
    visit instanceof PerformanceNavigationTiming &&
    visit.type === 'reload'
  );
}
