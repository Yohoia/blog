import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

export function registerArticleToc(): void {
  if (customElements.get('article-toc')) return;

  class ArticleToc extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      const article = this.closest('.article-page')?.querySelector<HTMLElement>(
        '[data-article-content]',
      );
      const trigger =
        this.querySelector<HTMLButtonElement>('[data-toc-trigger]');
      const panel = this.querySelector<HTMLElement>('[data-toc-panel]');
      const nav = this.querySelector<HTMLElement>('[data-toc-nav]');
      const scroll = this.querySelector<HTMLElement>('[data-toc-scroll]');
      const links = [
        ...this.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'),
      ];
      if (!article || !trigger || !panel || !nav || !scroll || !links.length)
        return;

      const controller = new AbortController();
      const { signal } = controller;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const wide = window.matchMedia('(min-width: 64rem)');
      const headings = links.map((link) =>
        document.getElementById(decodeURIComponent(link.hash.slice(1))),
      );
      let animation: AnimationPlaybackControls | undefined;
      let frame = 0;
      let activeIndex = -1;
      let isOpen = false;

      this.dataset.ready = '';
      panel.inert = true;

      const updateScrollEdges = () => {
        const scrollable = scroll.scrollHeight - scroll.clientHeight > 1;
        nav.toggleAttribute(
          'data-can-scroll-up',
          scrollable && scroll.scrollTop > 1,
        );
        nav.toggleAttribute(
          'data-can-scroll-down',
          scrollable &&
            scroll.scrollTop + scroll.clientHeight < scroll.scrollHeight - 1,
        );
      };

      const updatePanelHeight = () => {
        if (!wide.matches) {
          panel.style.removeProperty('--toc-panel-height');
          const headerBottom =
            document.querySelector('.site-header')?.getBoundingClientRect()
              .bottom ?? 0;
          panel.style.setProperty(
            '--toc-mobile-top',
            `${Math.max(12, headerBottom + 8)}px`,
          );
          return;
        }

        panel.style.removeProperty('--toc-panel-height');
        updateScrollEdges();
      };

      const keepActiveVisible = () => {
        if (!isOpen) return;
        const link = links[activeIndex];
        if (!link) return;
        const scrollRect = scroll.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        if (linkRect.top < scrollRect.top) {
          scroll.scrollTop -= scrollRect.top - linkRect.top;
        } else if (linkRect.bottom > scrollRect.bottom) {
          scroll.scrollTop += linkRect.bottom - scrollRect.bottom;
        }
        updateScrollEdges();
      };

      const setOpen = (open: boolean) => {
        if (wide.matches) return;
        if (isOpen === open) return;
        isOpen = open;
        this.toggleAttribute('data-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        trigger.setAttribute(
          'aria-label',
          trigger.dataset[open ? 'openLabel' : 'closedLabel'] ?? '',
        );
        panel.inert = !open;
        panel.style.pointerEvents = open ? 'auto' : 'none';
        animation?.stop();

        if (open) {
          panel.style.visibility = 'visible';
          animation = animate(
            panel,
            { opacity: 1 },
            {
              duration: reduced.matches
                ? 0
                : motionTokens.article.tocRevealDuration,
              ease: motionTokens.easing,
            },
          );
          keepActiveVisible();
          updateScrollEdges();
        } else {
          animation = animate(
            panel,
            { opacity: 0 },
            {
              duration: reduced.matches
                ? 0
                : motionTokens.article.tocRevealDuration,
              ease: motionTokens.easing,
            },
          );
          void animation.finished
            .then(() => {
              if (!isOpen) panel.style.visibility = 'hidden';
            })
            .catch(() => {});
        }
      };

      const syncLayout = () => {
        animation?.stop();
        isOpen = wide.matches;
        this.toggleAttribute('data-open', false);
        trigger.setAttribute('aria-expanded', String(isOpen));
        panel.inert = !isOpen;
        panel.style.visibility = '';
        panel.style.opacity = '';
        panel.style.pointerEvents = '';
        updatePanelHeight();
        updateScrollEdges();
      };

      const updateActive = () => {
        frame = 0;
        const line = Math.min(120, window.innerHeight * 0.22);
        let nextIndex = 0;
        headings.forEach((heading, index) => {
          if (heading && heading.getBoundingClientRect().top <= line)
            nextIndex = index;
        });
        if (activeIndex === nextIndex) return;
        activeIndex = nextIndex;
        links.forEach((link, index) => {
          if (index === nextIndex)
            link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
        keepActiveVisible();
      };
      const scheduleUpdate = () => {
        if (!frame) frame = requestAnimationFrame(updateActive);
      };

      trigger.addEventListener(
        'click',
        () => {
          setOpen(!isOpen);
        },
        { signal },
      );
      nav.addEventListener(
        'click',
        (event) => {
          const link = (event.target as Element).closest<HTMLAnchorElement>(
            '[data-toc-link]',
          );
          if (!link) return;
          if (event.detail > 0) link.blur();
          if (!wide.matches) setOpen(false);
        },
        { signal },
      );
      document.addEventListener(
        'pointerdown',
        (event) => {
          if (
            wide.matches ||
            this.contains(event.target as Node) ||
            trigger.contains(event.target as Node)
          )
            return;
          setOpen(false);
        },
        { signal },
      );
      document.addEventListener(
        'keydown',
        (event) => {
          if (event.key !== 'Escape' || !isOpen) return;
          if (wide.matches) return;
          setOpen(false);
          if (panel.contains(document.activeElement)) {
            trigger.focus();
          }
        },
        { signal },
      );
      window.addEventListener(
        'scroll',
        () => {
          updatePanelHeight();
          scheduleUpdate();
        },
        { passive: true, signal },
      );
      wide.addEventListener('change', syncLayout, { signal });
      window.addEventListener(
        'resize',
        () => {
          updatePanelHeight();
          scheduleUpdate();
        },
        { passive: true, signal },
      );
      scroll.addEventListener('scroll', updateScrollEdges, {
        passive: true,
        signal,
      });
      const resizeObserver = new ResizeObserver(() => {
        updateScrollEdges();
      });
      resizeObserver.observe(scroll.firstElementChild ?? scroll);
      window.addEventListener('hashchange', scheduleUpdate, { signal });
      document.addEventListener('astro:after-swap', scheduleUpdate, { signal });
      document.addEventListener('astro:page-load', scheduleUpdate, { signal });
      reduced.addEventListener('change', scheduleUpdate, { signal });
      syncLayout();
      scheduleUpdate();
      updateScrollEdges();

      this.cleanup = () => {
        controller.abort();
        resizeObserver.disconnect();
        cancelAnimationFrame(frame);
        animation?.stop();
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }

  customElements.define('article-toc', ArticleToc);
}
