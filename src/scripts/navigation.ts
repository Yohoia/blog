import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

/** Header 只管理滚动收紧；全屏导航由 type-overlay-menu 独立管理。 */
export function registerNavigation(): void {
  if (customElements.get('site-navigation')) return;

  class SiteNavigation extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      this.cleanup?.();
      const controller = new AbortController();
      const { signal } = controller;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );
      let animation: AnimationPlaybackControls | undefined;

      const syncScroll = (immediate = false) => {
        const scrolled = window.scrollY > 20;
        if (!immediate && this.hasAttribute('data-scrolled') === scrolled)
          return;
        this.toggleAttribute('data-scrolled', scrolled);
        animation?.stop();
        animation = animate(
          this,
          { '--header-expansion': scrolled ? 0 : 1 },
          {
            duration:
              reducedMotion.matches || immediate ? 0 : motionTokens.duration.ui,
            ease: motionTokens.easing,
          },
        );
      };
      const syncAfterNavigation = () => {
        // 等同一轮事件中的阅读位置恢复后，再同步背景与收紧状态。
        queueMicrotask(() => {
          if (!signal.aborted && this.isConnected) syncScroll(true);
        });
      };
      window.addEventListener('scroll', () => syncScroll(), {
        passive: true,
        signal,
      });
      document.addEventListener('astro:after-swap', syncAfterNavigation, {
        signal,
      });
      document.addEventListener('astro:page-load', syncAfterNavigation, {
        signal,
      });
      reducedMotion.addEventListener('change', () => syncScroll(true), {
        signal,
      });
      syncScroll(true);

      this.cleanup = () => {
        controller.abort();
        animation?.stop();
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
    }
  }

  customElements.define('site-navigation', SiteNavigation);
}
