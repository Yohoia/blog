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
      const nav = this.querySelector<HTMLElement>('[data-toc-nav]');
      const scroll = this.querySelector<HTMLElement>('[data-toc-scroll]');
      const links = [
        ...this.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'),
      ];
      if (!article || !trigger || !nav || !scroll || !links.length) return;

      const controller = new AbortController();
      const { signal } = controller;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const finePointer = window.matchMedia(
        '(hover: hover) and (pointer: fine)',
      );
      const headings = links.map((link) =>
        document.getElementById(decodeURIComponent(link.hash.slice(1))),
      );
      let animation: AnimationPlaybackControls | undefined;
      let closeTimer = 0;
      let frame = 0;
      let activeIndex = -1;
      let isOpen = false;
      let pinned = false;
      let suppressFocusOpen = false;

      this.dataset.ready = '';
      nav.inert = true;

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
        window.clearTimeout(closeTimer);
        if (isOpen === open) return;
        isOpen = open;
        trigger.setAttribute('aria-expanded', String(open));
        trigger.setAttribute(
          'aria-label',
          trigger.dataset[open ? 'openLabel' : 'closedLabel'] ?? '',
        );
        nav.inert = !open;
        nav.style.pointerEvents = open ? 'auto' : 'none';
        animation?.stop();

        if (open) {
          nav.style.visibility = 'visible';
          animation = animate(
            nav,
            { opacity: 1, y: 0 },
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
            nav,
            { opacity: 0, y: -4 },
            {
              duration: reduced.matches
                ? 0
                : motionTokens.article.tocRevealDuration,
              ease: motionTokens.easing,
            },
          );
          void animation.finished
            .then(() => {
              if (!isOpen) nav.style.visibility = 'hidden';
            })
            .catch(() => {});
        }
      };

      const openOnHover = () => {
        if (finePointer.matches) setOpen(true);
      };
      const scheduleClose = () => {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => {
          if (
            pinned ||
            this.matches(':hover') ||
            article.matches(':hover') ||
            this.matches(':focus-within')
          )
            return;
          setOpen(false);
        }, motionTokens.article.tocCloseDelay);
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

      this.addEventListener('pointerenter', openOnHover, { signal });
      this.addEventListener('pointerleave', scheduleClose, { signal });
      article.addEventListener('pointerenter', openOnHover, { signal });
      article.addEventListener('pointerleave', scheduleClose, { signal });
      this.addEventListener(
        'focusin',
        () => {
          if (suppressFocusOpen) {
            suppressFocusOpen = false;
            return;
          }
          setOpen(true);
        },
        { signal },
      );
      this.addEventListener('focusout', scheduleClose, { signal });
      trigger.addEventListener(
        'click',
        () => {
          pinned = !pinned;
          setOpen(pinned);
          if (!pinned) trigger.blur();
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
          if (!finePointer.matches) {
            pinned = false;
            setOpen(false);
          }
        },
        { signal },
      );
      document.addEventListener(
        'pointerdown',
        (event) => {
          if (
            this.contains(event.target as Node) ||
            article.contains(event.target as Node)
          )
            return;
          pinned = false;
          setOpen(false);
        },
        { signal },
      );
      document.addEventListener(
        'keydown',
        (event) => {
          if (event.key !== 'Escape' || !isOpen) return;
          pinned = false;
          setOpen(false);
          if (nav.contains(document.activeElement)) {
            suppressFocusOpen = true;
            trigger.focus();
          }
        },
        { signal },
      );
      window.addEventListener('scroll', scheduleUpdate, {
        passive: true,
        signal,
      });
      window.addEventListener('resize', scheduleUpdate, {
        passive: true,
        signal,
      });
      scroll.addEventListener('scroll', updateScrollEdges, {
        passive: true,
        signal,
      });
      const resizeObserver = new ResizeObserver(updateScrollEdges);
      resizeObserver.observe(scroll);
      resizeObserver.observe(scroll.firstElementChild ?? scroll);
      window.addEventListener('hashchange', scheduleUpdate, { signal });
      document.addEventListener('astro:after-swap', scheduleUpdate, { signal });
      document.addEventListener('astro:page-load', scheduleUpdate, { signal });
      reduced.addEventListener('change', scheduleUpdate, { signal });
      if (article.matches(':hover')) openOnHover();
      scheduleUpdate();
      updateScrollEdges();

      this.cleanup = () => {
        controller.abort();
        resizeObserver.disconnect();
        window.clearTimeout(closeTimer);
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
