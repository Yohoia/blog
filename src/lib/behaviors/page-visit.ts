let navigatedWithinSite = false;

// BaseLayout 提前加载本模块，包含先访问其他页面、再通过 Next.js Router 回首页的情况。
document.addEventListener("site:before-swap", () => {
  navigatedWithinSite = true;
});

/** 只有当前文档的浏览器刷新允许自动播放，站内切换与历史返回都直接显示内容。 */
export function isRefreshVisit(): boolean {
  const visit = performance.getEntriesByType("navigation")[0];
  return (
    !navigatedWithinSite &&
    visit instanceof PerformanceNavigationTiming &&
    visit.type === "reload"
  );
}

/** 首页首次打开或刷新时播放；Next.js Router 切换和历史返回直接显示内容。 */
export function shouldAnimateTerminalVisit(): boolean {
  const visit = performance.getEntriesByType("navigation")[0];
  return (
    !navigatedWithinSite &&
    visit instanceof PerformanceNavigationTiming &&
    (visit.type === "navigate" || visit.type === "reload")
  );
}
