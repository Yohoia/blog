import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

export function registerNavigation(): void {
  if (customElements.get('site-navigation')) return;

  class SiteNavigation extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      const navigation = this.querySelector<HTMLElement>(
        '[data-desktop-navigation]',
      );
      const highlight = this.querySelector<HTMLElement>(
        '[data-navigation-highlight]',
      );
      const menu = this.querySelector<HTMLDetailsElement>(
        '[data-mobile-navigation]',
      );
      if (!navigation || !highlight || !menu) return;

      const controller = new AbortController();
      const { signal } = controller;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );
      const mobile = window.matchMedia('(max-width: 55.999rem)');
      const active = navigation.querySelector<HTMLAnchorElement>(
        '[aria-current="page"]',
      );
      let hovered: HTMLAnchorElement | null = null;
      let visible = false;
      let highlightAnimation: AnimationPlaybackControls | undefined;
      let headerAnimation: AnimationPlaybackControls | undefined;

      const focused = () =>
        document.activeElement instanceof HTMLAnchorElement &&
        navigation.contains(document.activeElement)
          ? document.activeElement
          : null;

      function moveHighlight(
        target: HTMLAnchorElement | null,
        immediate = false,
      ) {
        highlightAnimation?.stop();
        if (!target || mobile.matches) {
          visible = false;
          highlightAnimation = animate(
            highlight!,
            { opacity: 0 },
            {
              duration:
                reducedMotion.matches || immediate
                  ? 0
                  : motionTokens.duration.micro,
            },
          );
          return;
        }
        const itemRect = target.getBoundingClientRect();
        const navRect = navigation!.getBoundingClientRect();
        const x = itemRect.left - navRect.left;
        if (!visible || immediate || reducedMotion.matches) {
          highlight!.style.transform = `translateX(${x}px)`;
          highlight!.style.width = `${itemRect.width}px`;
          highlightAnimation = animate(
            highlight!,
            { opacity: 1 },
            {
              duration:
                reducedMotion.matches || immediate
                  ? 0
                  : motionTokens.duration.micro,
            },
          );
        } else {
          highlightAnimation = animate(
            highlight!,
            { x, width: itemRect.width, opacity: 1 },
            { duration: motionTokens.duration.page, ease: motionTokens.easing },
          );
        }
        visible = true;
      }

      const syncHighlight = () =>
        moveHighlight(hovered ?? focused() ?? active, true);
      const syncScroll = (immediate = false) => {
        const scrolled = window.scrollY > 20;
        if (!immediate && this.hasAttribute('data-scrolled') === scrolled)
          return;
        this.toggleAttribute('data-scrolled', scrolled);
        headerAnimation?.stop();
        headerAnimation = animate(
          this,
          { '--header-expansion': scrolled ? 0 : 1 },
          {
            duration:
              reducedMotion.matches || immediate ? 0 : motionTokens.duration.ui,
            ease: motionTokens.easing,
          },
        );
      };

      navigation.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
        link.addEventListener(
          'pointerenter',
          () => {
            hovered = link;
            moveHighlight(link);
          },
          { signal },
        );
        link.addEventListener('focus', () => moveHighlight(link), { signal });
      });
      navigation.addEventListener(
        'pointerleave',
        () => {
          hovered = null;
          moveHighlight(focused() ?? active);
        },
        { signal },
      );
      navigation.addEventListener(
        'focusout',
        () =>
          queueMicrotask(() => {
            if (this.isConnected) moveHighlight(hovered ?? focused() ?? active);
          }),
        { signal },
      );
      window.addEventListener('scroll', () => syncScroll(), {
        passive: true,
        signal,
      });
      const syncAfterNavigation = () => {
        // 页面替换时内容可能短暂收起；等同一轮事件中的阅读位置恢复后再同步。
        // scrollTo 恢复到原位置时，浏览器不一定会再派发 scroll 事件。
        queueMicrotask(() => {
          if (signal.aborted || !this.isConnected) return;
          syncScroll(true);
          syncHighlight();
        });
      };
      document.addEventListener('astro:after-swap', syncAfterNavigation, {
        signal,
      });
      document.addEventListener('astro:page-load', syncAfterNavigation, {
        signal,
      });
      reducedMotion.addEventListener(
        'change',
        () => {
          syncScroll(true);
          syncHighlight();
        },
        { signal },
      );
      mobile.addEventListener(
        'change',
        () => {
          menu.open = false;
          hovered = null;
          syncHighlight();
        },
        { signal },
      );

      menu.addEventListener(
        'keydown',
        (event) => {
          if (event.key !== 'Escape') return;
          menu.open = false;
          menu.querySelector('summary')?.focus();
        },
        { signal },
      );
      document.addEventListener(
        'pointerdown',
        (event) => {
          if (event.target instanceof Node && !menu.contains(event.target))
            menu.open = false;
        },
        { signal },
      );
      menu.querySelectorAll('a').forEach((link) =>
        link.addEventListener(
          'click',
          () => {
            menu.open = false;
          },
          { signal },
        ),
      );

      const observer = new ResizeObserver(syncHighlight);
      observer.observe(navigation);
      navigation.dataset.highlightReady = '';
      syncScroll(true);
      syncHighlight();
      void document.fonts.ready.then(() => {
        if (this.isConnected) syncHighlight();
      });
      this.cleanup = () => {
        controller.abort();
        observer.disconnect();
        highlightAnimation?.stop();
        headerAnimation?.stop();
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
    }
  }

  customElements.define('site-navigation', SiteNavigation);
}
