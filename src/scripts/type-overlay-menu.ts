import {
  animate,
  type AnimationPlaybackControls,
  type AnimationSequence,
} from 'motion';
import { motionTokens } from '@/config/motion';
import { startNavigationTransition } from '@/scripts/navigation-transition';

/** 原生 dialog 管理模态焦点与背景 inert，Motion 管理可中断的圆形展开。 */
export function registerTypeOverlayMenu(): void {
  if (customElements.get('type-overlay-menu')) return;

  class TypeOverlayMenu extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      this.cleanup?.();
      const disclosure = this.querySelector<HTMLDetailsElement>(
        '[data-menu-disclosure]',
      );
      const trigger = this.querySelector<HTMLElement>('[data-menu-trigger]');
      const dialog =
        this.querySelector<HTMLDialogElement>('[data-menu-dialog]');
      const closeButton =
        this.querySelector<HTMLButtonElement>('[data-menu-close]');
      if (!disclosure || !trigger || !dialog || !closeButton) return;

      const controller = new AbortController();
      const { signal } = controller;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );
      const tokens = motionTokens.menu;
      const links = [
        ...dialog.querySelectorAll<HTMLAnchorElement>('[data-overlay-link]'),
      ];
      const hoverAnimations = new Map<HTMLElement, AnimationPlaybackControls>();
      let animation: AnimationPlaybackControls | undefined;
      let revision = 0;
      let desiredOpen = false;
      let origin = { x: 0, y: 0 };
      let scrollLock:
        | {
            rootOverflow: string;
            x: number;
            y: number;
          }
        | undefined;

      const circle = (radius: number) =>
        `circle(${radius}px at ${origin.x}px ${origin.y}px)`;
      const radius = () =>
        Math.ceil(
          Math.hypot(
            Math.max(origin.x, window.innerWidth - origin.x),
            Math.max(origin.y, window.innerHeight - origin.y),
          ),
        ) + 1;
      const stop = () => {
        revision += 1;
        animation?.stop();
        animation = undefined;
      };
      const alignDialog = () => {
        // 根节点预留滚动条时，100vw 可能缩小；显式覆盖实际视口并补偿起点。
        // 页面宽度、body 边距与 sticky 导航的滚动参照保持不变。
        dialog.style.inlineSize = `${window.innerWidth}px`;
        dialog.style.blockSize = `${window.innerHeight}px`;
        dialog.style.left = `${-document.documentElement.getBoundingClientRect().left}px`;
      };
      const lockScroll = () => {
        if (scrollLock) return;
        scrollLock = {
          rootOverflow: document.documentElement.style.overflow,
          x: window.scrollX,
          y: window.scrollY,
        };
        document.documentElement.style.overflow = 'hidden';
        alignDialog();
      };
      const unlockScroll = () => {
        if (!scrollLock) return;
        const saved = scrollLock;
        scrollLock = undefined;
        document.documentElement.style.overflow = saved.rootOverflow;
        window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
      };
      const showLinks = () => {
        links.forEach((link) => {
          link.style.opacity = '1';
          link.style.transform = 'none';
        });
      };
      const closeImmediately = (restoreFocus = false) => {
        stop();
        desiredOpen = false;
        this.dataset.menuState = 'closed';
        disclosure.open = false;
        trigger.setAttribute('aria-expanded', 'false');
        if (dialog.open) dialog.close();
        unlockScroll();
        hoverAnimations.forEach((controls) => controls.stop());
        hoverAnimations.clear();
        dialog
          .querySelectorAll<HTMLElement>('[data-overlay-label]')
          .forEach((label) => label.style.removeProperty('transform'));
        if (restoreFocus && this.isConnected)
          trigger.focus({ preventScroll: true });
      };
      const showOpen = () => {
        dialog.style.clipPath = circle(radius());
        showLinks();
        this.dataset.menuState = 'open';
      };
      const play = (sequence: AnimationSequence, done: () => void) => {
        const current = revision;
        const controls = animate(sequence);
        animation = controls;
        void controls.finished.then(() => {
          if (signal.aborted || current !== revision) return;
          animation = undefined;
          done();
        });
      };
      const openMenu = () => {
        if (desiredOpen) return;
        stop();
        desiredOpen = true;
        this.dataset.menuState = 'opening';
        disclosure.open = true;
        trigger.setAttribute('aria-expanded', 'true');
        const rect = trigger.getBoundingClientRect();
        origin = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        dialog.style.clipPath = circle(0);
        links.forEach((link) => {
          link.style.opacity = '0';
          link.style.transform = `translateY(${tokens.itemDistance}px)`;
        });
        lockScroll();
        dialog.showModal();
        if (reducedMotion.matches) {
          showOpen();
          return;
        }
        const sequence: AnimationSequence = [
          [
            dialog,
            { clipPath: [circle(0), circle(radius())] },
            { duration: tokens.revealDuration, ease: tokens.revealEase, at: 0 },
          ],
        ];
        links.forEach((link, index) =>
          sequence.push([
            link,
            { opacity: [0, 1], y: [tokens.itemDistance, 0] },
            {
              duration: tokens.itemDuration,
              ease: 'easeOut',
              at: tokens.itemDelay + index * tokens.stagger,
            },
          ]),
        );
        play(sequence, showOpen);
      };
      const closeMenu = () => {
        if (!desiredOpen) return;
        stop();
        desiredOpen = false;
        this.dataset.menuState = 'closing';
        trigger.setAttribute('aria-expanded', 'false');
        if (reducedMotion.matches) {
          closeImmediately(true);
          return;
        }
        const sequence: AnimationSequence = [
          [
            dialog,
            { clipPath: circle(0) },
            { duration: tokens.closeDuration, ease: tokens.revealEase, at: 0 },
          ],
        ];
        links.forEach((link) =>
          sequence.push([
            link,
            { opacity: 0, y: tokens.itemDistance / 2 },
            { duration: tokens.exitDuration, ease: 'easeIn', at: 0 },
          ]),
        );
        play(sequence, () => closeImmediately(true));
      };

      trigger.addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          if (desiredOpen) closeMenu();
          else openMenu();
        },
        { signal },
      );
      closeButton.addEventListener('click', closeMenu, { signal });
      dialog.addEventListener(
        'cancel',
        (event) => {
          event.preventDefault();
          closeMenu();
        },
        { signal },
      );
      dialog.addEventListener(
        'close',
        () => {
          if (!dialog.open) closeImmediately();
        },
        { signal },
      );
      links.forEach((link) => {
        const label = link.querySelector<HTMLElement>('[data-overlay-label]');
        if (!label) return;
        const move = (active: boolean) => {
          hoverAnimations.get(label)?.stop();
          hoverAnimations.set(
            label,
            animate(
              label,
              {
                x: active && !reducedMotion.matches ? tokens.hoverDistance : 0,
              },
              {
                duration: reducedMotion.matches ? 0 : tokens.hoverDuration,
                ease: motionTokens.easing,
              },
            ),
          );
        };
        link.addEventListener('pointerenter', () => move(true), { signal });
        link.addEventListener(
          'pointerleave',
          () => move(document.activeElement === link),
          { signal },
        );
        link.addEventListener('focus', () => move(true), { signal });
        link.addEventListener('blur', () => move(false), { signal });
        link.addEventListener(
          'click',
          (event) => {
            // 修饰键保留原生链接行为；普通栏目切换在字符完全覆盖后关闭菜单。
            if (
              event.button === 0 &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey
            ) {
              if (startNavigationTransition(link, closeImmediately))
                event.preventDefault();
              else closeImmediately();
            }
          },
          { signal },
        );
      });
      reducedMotion.addEventListener(
        'change',
        () => {
          if (!reducedMotion.matches || !dialog.open) return;
          stop();
          if (desiredOpen) showOpen();
          else closeImmediately(true);
          hoverAnimations.forEach((controls) => controls.stop());
          hoverAnimations.clear();
          dialog
            .querySelectorAll<HTMLElement>('[data-overlay-label]')
            .forEach((label) => (label.style.transform = 'none'));
        },
        { signal },
      );
      window.addEventListener(
        'resize',
        () => {
          if (!dialog.open) return;
          stop();
          alignDialog();
          if (desiredOpen) showOpen();
          else closeImmediately(true);
        },
        { signal },
      );
      document.addEventListener('astro:before-swap', () => closeImmediately(), {
        signal,
      });
      window.addEventListener('pagehide', () => closeImmediately(), { signal });

      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-controls', dialog.id);
      trigger.setAttribute('aria-expanded', 'false');
      disclosure.open = false;
      this.dataset.menuReady = '';
      this.cleanup = () => {
        controller.abort();
        closeImmediately();
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
    }
  }

  customElements.define('type-overlay-menu', TypeOverlayMenu);
}
