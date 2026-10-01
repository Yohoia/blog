import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

const LIKE_STORAGE_KEY = 'yohoia:article-likes';

interface ArticleLikeStore {
  [pathname: string]: boolean;
}

function readLikeStore(): ArticleLikeStore {
  try {
    const value = localStorage.getItem(LIKE_STORAGE_KEY);
    return value ? (JSON.parse(value) as ArticleLikeStore) : {};
  } catch {
    return {};
  }
}

function writeLikeStore(store: ArticleLikeStore): void {
  try {
    localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // 存储不可用时，喜欢状态只保留到当前页面会话。
  }
}

export function registerArticleRail(): void {
  if (customElements.get('article-rail')) return;

  class ArticleRail extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      const article = document.querySelector<HTMLElement>(
        '[data-article-content]',
      );
      const progressbar = this.querySelector<HTMLElement>(
        '[data-rail-progressbar]',
      );
      const percentText = this.querySelector<HTMLElement>(
        '[data-rail-percent]',
      );
      const topButton =
        this.querySelector<HTMLButtonElement>('[data-rail-top]');
      const likeButton =
        this.querySelector<HTMLButtonElement>('[data-rail-like]');
      const likeCount = this.querySelector<HTMLElement>(
        '[data-rail-like-count]',
      );
      const likeTipLabel = this.querySelector<HTMLElement>(
        '[data-rail-like-tip-label]',
      );
      const shareButton =
        this.querySelector<HTMLButtonElement>('[data-rail-share]');
      const status = this.querySelector<HTMLElement>('[data-rail-status]');
      if (
        !article ||
        !progressbar ||
        !percentText ||
        !topButton ||
        !likeButton ||
        !likeCount ||
        !likeTipLabel ||
        !shareButton ||
        !status
      )
        return;

      const controller = new AbortController();
      const { signal } = controller;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const pathname = window.location.pathname;
      const title = this.dataset.articleRailTitle ?? document.title;
      const store = readLikeStore();
      let frame = 0;
      let feedbackTimer = 0;
      let liked = Boolean(store[pathname]);
      const animations = new Set<AnimationPlaybackControls>();
      const animationOwners = new Map<Element, AnimationPlaybackControls>();
      const openTips = new Set<HTMLElement>();

      const play = (controls: AnimationPlaybackControls, owner?: Element) => {
        if (owner) {
          animationOwners.get(owner)?.stop();
          animationOwners.set(owner, controls);
        }
        animations.add(controls);
        void controls.finished
          .then(() => {
            animations.delete(controls);
            if (owner && animationOwners.get(owner) === controls)
              animationOwners.delete(owner);
          })
          .catch(() => {
            animations.delete(controls);
            if (owner && animationOwners.get(owner) === controls)
              animationOwners.delete(owner);
          });
      };

      const tipWidth = (tip: HTMLElement) => Math.ceil(tip.scrollWidth);

      const animateTip = (tip: HTMLElement, open: boolean) => {
        if (open) openTips.add(tip);
        else openTips.delete(tip);
        play(
          animate(
            tip,
            {
              width: open ? tipWidth(tip) : 0,
              opacity: open ? 1 : 0,
              x: open ? 0 : -motionTokens.article.railTipDistance,
            },
            {
              duration: reduced.matches
                ? 0
                : open
                  ? motionTokens.article.railEnterDuration
                  : motionTokens.article.railExitDuration,
              ease: motionTokens.easing,
            },
          ),
          tip,
        );
      };

      const animateAction = (action: HTMLElement, open: boolean) => {
        const styles = getComputedStyle(this);
        const hoverSurface =
          styles.getPropertyValue('--hover-surface').trim() || 'transparent';
        play(
          animate(
            action,
            { backgroundColor: open ? hoverSurface : 'transparent' },
            {
              duration: reduced.matches
                ? 0
                : open
                  ? motionTokens.article.railEnterDuration
                  : motionTokens.article.railExitDuration,
              ease: motionTokens.easing,
            },
          ),
          action,
        );
      };

      const animateIcon = (
        action: HTMLElement,
        open: boolean,
        mode: 'hover' | 'activate' | 'like' | 'unlike' = 'hover',
      ) => {
        const icon = action.querySelector<SVGElement>(':scope > svg');
        if (!icon) return;
        const kind = action.dataset.railIcon ?? 'default';
        const hoverScale = motionTokens.article.railHoverScale;
        const duration = reduced.matches
          ? 0
          : mode === 'hover'
            ? motionTokens.article.railIconDuration
            : motionTokens.article.railIconDuration + 0.06;

        if (!open || reduced.matches) {
          play(
            animate(
              icon,
              {
                scale: open ? hoverScale : 1,
                rotate: 0,
                x: 0,
                y: 0,
              },
              {
                duration: reduced.matches
                  ? 0
                  : motionTokens.article.railExitDuration,
                ease: motionTokens.easing,
              },
            ),
            icon,
          );
          return;
        }

        if (kind === 'bell') {
          const angles =
            mode === 'hover'
              ? [0, ...motionTokens.article.railBellAngles]
              : [0, -16, 14, -10, 7, 0];
          play(
            animate(
              icon,
              {
                rotate: angles,
                scale:
                  mode === 'hover'
                    ? [1, 1.08, 1.04, 1.08, 1.05, hoverScale]
                    : [hoverScale, 1.2, 0.94, 1.14, 1, hoverScale],
              },
              {
                duration: reduced.matches
                  ? 0
                  : mode === 'hover'
                    ? motionTokens.article.railBellDuration
                    : motionTokens.article.railIconDuration,
                ease: motionTokens.easing,
              },
            ),
            icon,
          );
          return;
        }

        if (kind === 'like' && (mode === 'like' || mode === 'unlike')) {
          const liked = mode === 'like';
          play(
            animate(
              icon,
              {
                scale: liked
                  ? [
                      hoverScale,
                      motionTokens.article.railIconPopScale,
                      0.88,
                      1.12,
                      hoverScale,
                    ]
                  : [hoverScale, 0.86, 1.04, 0.96, hoverScale],
                y: liked
                  ? [0, -motionTokens.article.railIconTravel, 1, -2, 0]
                  : [0, 2, -1, 0, 0],
                rotate: liked ? [0, -14, 6, -3, 0] : [0, 7, -3, 1, 0],
              },
              { duration, ease: motionTokens.easing },
            ),
            icon,
          );
          return;
        }

        const activate = mode !== 'hover';
        switch (kind) {
          case 'share':
            play(
              animate(
                icon,
                {
                  scale: activate
                    ? [
                        hoverScale,
                        motionTokens.article.railIconPopScale,
                        hoverScale,
                      ]
                    : [1, 1.12, hoverScale],
                  x: activate
                    ? [0, motionTokens.article.railIconTravel, 1]
                    : [0, 3, 1.5],
                  y: activate ? [0, -3, 0] : [0, -2, -1],
                },
                { duration, ease: motionTokens.easing },
              ),
              icon,
            );
            break;
          case 'gift':
            play(
              animate(
                icon,
                {
                  scale: activate
                    ? [hoverScale, 1.18, hoverScale]
                    : [1, 1.12, hoverScale],
                  y: activate
                    ? [0, -motionTokens.article.railIconTravel, 1, 0]
                    : [0, -3, 0],
                  rotate: activate ? [0, -5, 5, 0] : 0,
                },
                { duration, ease: motionTokens.easing },
              ),
              icon,
            );
            break;
          case 'comment':
            play(
              animate(
                icon,
                {
                  scale: activate
                    ? [hoverScale, 1.18, hoverScale]
                    : [1, 1.1, hoverScale],
                  rotate:
                    mode === 'activate'
                      ? [0, ...motionTokens.article.railWiggleAngles]
                      : [0, -4, 3, 0],
                },
                { duration, ease: motionTokens.easing },
              ),
              icon,
            );
            break;
          case 'top':
            play(
              animate(
                icon,
                {
                  scale: activate
                    ? [hoverScale, 1.2, hoverScale]
                    : [1, 1.1, hoverScale],
                  y: activate
                    ? [0, -motionTokens.article.railIconTravel * 1.2, 0]
                    : [0, -3, -1],
                },
                { duration, ease: motionTokens.easing },
              ),
              icon,
            );
            break;
          default:
            play(
              animate(
                icon,
                {
                  scale: activate
                    ? [hoverScale, 1.18, hoverScale]
                    : [1, 1.1, hoverScale],
                },
                { duration, ease: motionTokens.easing },
              ),
              icon,
            );
        }
      };

      const bindActionMotion = (action: HTMLElement) => {
        const tip = action.querySelector<HTMLElement>(':scope > .rail-tip');
        const hoverable = window.matchMedia(
          '(hover: hover) and (pointer: fine)',
        );
        let hovered = false;
        let focused = false;
        const sync = () => {
          const open = hovered || focused;
          animateAction(action, open);
          animateIcon(action, open);
          if (tip) animateTip(tip, open);
        };

        action.addEventListener(
          'pointerenter',
          () => {
            if (!hoverable.matches) return;
            hovered = true;
            sync();
          },
          { signal },
        );
        action.addEventListener(
          'pointerleave',
          () => {
            if (!hoverable.matches) return;
            hovered = false;
            sync();
          },
          { signal },
        );
        action.addEventListener(
          'focusin',
          () => {
            focused = true;
            sync();
          },
          { signal },
        );
        action.addEventListener(
          'focusout',
          () => {
            focused = false;
            sync();
          },
          { signal },
        );
        action.addEventListener(
          'click',
          () => animateIcon(action, true, 'activate'),
          { signal },
        );
      };

      this.querySelectorAll<HTMLElement>('.rail-action').forEach(
        bindActionMotion,
      );

      const syncLike = () => {
        likeButton.setAttribute('aria-pressed', String(liked));
        likeButton.setAttribute(
          'aria-label',
          this.dataset[liked ? 'likedLabel' : 'likeLabel'] ?? '',
        );
        this.toggleAttribute('data-liked', liked);
        likeCount.textContent = liked ? '1' : '0';
        likeTipLabel.textContent =
          this.dataset[liked ? 'likedLabel' : 'likeLabel'] ?? '';
        if (openTips.has(likeTipLabel)) animateTip(likeTipLabel, true);
      };

      const notify = (message: string) => {
        status.textContent = message;
        window.clearTimeout(feedbackTimer);
        feedbackTimer = window.setTimeout(() => {
          status.textContent = '';
        }, 2500);
      };

      const updateProgress = () => {
        frame = 0;
        const articleRect = article.getBoundingClientRect();
        const viewport = window.innerHeight;
        const distance = articleRect.height - viewport;
        const progress =
          distance > 0
            ? Math.max(0, Math.min(1, -articleRect.top / distance))
            : articleRect.bottom <= viewport
              ? 1
              : 0;
        const nextPercent = Math.round(progress * 100);

        this.style.setProperty('--article-rail-progress', progress.toFixed(4));
        this.toggleAttribute('data-can-top', nextPercent > 2);
        percentText.textContent = `${nextPercent}%`;
        progressbar.setAttribute('aria-valuenow', String(nextPercent));
      };

      const scheduleProgress = () => {
        if (!frame) frame = window.requestAnimationFrame(updateProgress);
      };

      topButton.addEventListener(
        'click',
        () => {
          window.scrollTo({
            top: 0,
            behavior: reduced.matches ? 'instant' : 'smooth',
          });
        },
        { signal },
      );

      likeButton.addEventListener(
        'click',
        () => {
          liked = !liked;
          const nextStore = readLikeStore();
          if (liked) nextStore[pathname] = true;
          else delete nextStore[pathname];
          writeLikeStore(nextStore);
          syncLike();
          animateIcon(likeButton, true, liked ? 'like' : 'unlike');
        },
        { signal },
      );

      shareButton.addEventListener(
        'click',
        () => {
          void (async () => {
            const url = window.location.href;
            const shareData = { title, url };
            if (navigator.share) {
              try {
                await navigator.share(shareData);
                return;
              } catch (error) {
                // 用户取消系统分享时保持页面安静；其他错误回退到剪贴板。
                if (
                  error instanceof DOMException &&
                  error.name === 'AbortError'
                )
                  return;
              }
            }

            try {
              await navigator.clipboard.writeText(url);
              notify(this.dataset.copiedLabel ?? '');
            } catch {
              notify(this.dataset.failedLabel ?? '');
            }
          })();
        },
        { signal },
      );

      window.addEventListener('scroll', scheduleProgress, {
        passive: true,
        signal,
      });
      window.addEventListener('resize', scheduleProgress, {
        passive: true,
        signal,
      });
      window.addEventListener('hashchange', scheduleProgress, { signal });
      document.addEventListener('astro:after-swap', scheduleProgress, {
        signal,
      });
      document.addEventListener('astro:page-load', scheduleProgress, {
        signal,
      });
      reduced.addEventListener('change', scheduleProgress, { signal });
      syncLike();
      updateProgress();

      this.cleanup = () => {
        controller.abort();
        for (const animation of animations) animation.stop();
        animations.clear();
        animationOwners.clear();
        window.clearTimeout(feedbackTimer);
        cancelAnimationFrame(frame);
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }

  customElements.define('article-rail', ArticleRail);
}
