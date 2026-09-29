interface ReadingPosition {
  block?: string;
  offset?: number;
  x: number;
  y: number;
}

let initialized = false;

/** 语言切换替换静态 HTML，保留阅读位置；无 JavaScript 时仍是普通链接。 */
export function initializeLanguageNavigation(): void {
  if (initialized) return;
  initialized = true;
  let position: ReadingPosition | undefined;
  const route = (pathname: string) =>
    pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '') || '/';

  const preserveLocation = () => {
    document
      .querySelectorAll<HTMLAnchorElement>('[data-language-toggle]')
      .forEach((link) => {
        link.search = window.location.search;
        link.hash = window.location.hash;
      });
  };

  document.addEventListener('astro:before-swap', (event) => {
    position = undefined;
    if (
      // 历史前进 / 后退由 ClientRouter 恢复目标记录的滚动位置。
      event.navigationType === 'traverse' ||
      event.from.pathname === event.to.pathname ||
      route(event.from.pathname) !== route(event.to.pathname)
    )
      return;

    // 跟随正在阅读的语义区块，而不是只保存绝对像素；文本可自然增高。
    const block = [
      ...document.querySelectorAll<HTMLElement>('[data-language-block]'),
    ].find((element) => element.getBoundingClientRect().bottom > 80);
    position = {
      block: block?.dataset.languageBlock,
      offset: block?.getBoundingClientRect().top,
      x: window.scrollX,
      y: window.scrollY,
    };
    event.newDocument
      .querySelectorAll<HTMLElement>('yohoia-logo')
      .forEach((logo) => {
        logo.dataset.logoSkipIntro = 'true';
      });
  });

  const restoreReadingPosition = () => {
    const saved = position;
    if (!saved) return;
    const block = saved.block
      ? document.querySelector<HTMLElement>(
          `[data-language-block="${saved.block}"]`,
        )
      : null;
    const top =
      block && saved.offset !== undefined
        ? window.scrollY + block.getBoundingClientRect().top - saved.offset
        : saved.y;
    window.scrollTo({ left: saved.x, top, behavior: 'instant' });
    document
      .querySelector<HTMLAnchorElement>('[data-language-toggle]')
      ?.focus({ preventScroll: true });
  };

  document.addEventListener('astro:after-swap', restoreReadingPosition);

  window.addEventListener('hashchange', preserveLocation);
  document.addEventListener('astro:page-load', () => {
    preserveLocation();
    // 样式与脚本完成初始化后，再确认一次阅读位置。
    restoreReadingPosition();
    position = undefined;
  });
  preserveLocation();
}
