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
      const copyButton =
        this.querySelector<HTMLButtonElement>('[data-toc-copy]');
      const copyLabel = this.querySelector<HTMLElement>(
        '[data-toc-copy-label]',
      );
      const status = this.querySelector<HTMLElement>('[data-toc-status]');
      const chatTrigger = this.querySelector<HTMLButtonElement>(
        '[data-toc-chat-trigger]',
      );
      const chatMenu = this.querySelector<HTMLElement>('[data-toc-chat-menu]');
      const chatCopy = this.querySelector<HTMLButtonElement>(
        '[data-toc-chat-copy]',
      );
      const links = [
        ...this.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'),
      ];
      if (
        !article ||
        !trigger ||
        !panel ||
        !nav ||
        !scroll ||
        !copyButton ||
        !copyLabel ||
        !status ||
        !chatTrigger ||
        !chatMenu ||
        !chatCopy ||
        !links.length
      )
        return;

      const controller = new AbortController();
      const { signal } = controller;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const wide = window.matchMedia('(min-width: 84rem)');
      const headings = links.map((link) =>
        document.getElementById(decodeURIComponent(link.hash.slice(1))),
      );
      let animation: AnimationPlaybackControls | undefined;
      let feedbackTimer = 0;
      let frame = 0;
      let activeIndex = -1;
      let isOpen = false;

      this.dataset.ready = '';
      panel.inert = true;

      const copyPage = async (forChat: boolean) => {
        const title = article.querySelector('h1')?.textContent?.trim();
        const content = article
          .querySelector<HTMLElement>('.article-prose')
          ?.innerText.trim();
        const page = [title, content, window.location.href]
          .filter(Boolean)
          .join('\n\n');
        try {
          await navigator.clipboard.writeText(page);
          if (!this.isConnected) return;
          status.textContent =
            copyButton.dataset[forChat ? 'chatStatus' : 'copiedStatus'] ?? '';
          if (!forChat)
            copyLabel.textContent = copyButton.dataset.copiedLabel ?? '';
        } catch {
          if (!this.isConnected) return;
          status.textContent = copyButton.dataset.failedStatus ?? '';
          if (!forChat)
            copyLabel.textContent = copyButton.dataset.failedLabel ?? '';
        }
        window.clearTimeout(feedbackTimer);
        feedbackTimer = window.setTimeout(() => {
          status.textContent = '';
          copyLabel.textContent = copyButton.dataset.copyLabel ?? '';
        }, 2500);
      };

      const positionChatMenu = () => {
        if (!chatMenu.matches(':popover-open')) return;
        const triggerRect = chatTrigger.getBoundingClientRect();
        const menuRect = chatMenu.getBoundingClientRect();
        const rootRect = document.documentElement.getBoundingClientRect();
        const gap = 8;
        const left = Math.max(
          rootRect.left + gap,
          Math.min(triggerRect.left, rootRect.right - menuRect.width - gap),
        );
        const above = triggerRect.top - gap;
        const below = window.innerHeight - triggerRect.bottom - gap;
        const top =
          above >= menuRect.height || above >= below
            ? Math.max(gap, triggerRect.top - menuRect.height - gap)
            : Math.min(
                window.innerHeight - menuRect.height - gap,
                triggerRect.bottom + gap,
              );
        chatMenu.style.left = `${left - rootRect.left}px`;
        chatMenu.style.top = `${top}px`;
      };

      const closeChatMenu = () => {
        if (chatMenu.matches(':popover-open')) chatMenu.hidePopover();
      };

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
          positionChatMenu();
          return;
        }
        const top = panel.getBoundingClientRect().top;
        const height = `${Math.max(0, Math.round(window.innerHeight - Math.max(0, top) - 20))}px`;
        if (panel.style.getPropertyValue('--toc-panel-height') !== height)
          panel.style.setProperty('--toc-panel-height', height);
        updateScrollEdges();
        positionChatMenu();
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
          closeChatMenu();
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
        closeChatMenu();
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
      copyButton.addEventListener('click', () => void copyPage(false), {
        signal,
      });
      chatTrigger.addEventListener(
        'click',
        () => {
          if (chatMenu.matches(':popover-open')) closeChatMenu();
          else {
            chatMenu.showPopover();
            positionChatMenu();
          }
        },
        { signal },
      );
      chatMenu.addEventListener(
        'toggle',
        () => {
          chatTrigger.setAttribute(
            'aria-expanded',
            String(chatMenu.matches(':popover-open')),
          );
        },
        { signal },
      );
      chatCopy.addEventListener(
        'click',
        () => {
          void copyPage(false);
          closeChatMenu();
          chatTrigger.focus();
        },
        { signal },
      );
      this.querySelectorAll<HTMLAnchorElement>('[data-toc-chat-link]').forEach(
        (link) =>
          link.addEventListener(
            'click',
            () => {
              void copyPage(true);
              closeChatMenu();
            },
            { signal },
          ),
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
          if (chatMenu.matches(':popover-open')) {
            event.preventDefault();
            closeChatMenu();
            chatTrigger.focus();
            return;
          }
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
      panel.addEventListener('scroll', positionChatMenu, {
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
        window.clearTimeout(feedbackTimer);
        cancelAnimationFrame(frame);
        animation?.stop();
        closeChatMenu();
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }

  customElements.define('article-toc', ArticleToc);
}
