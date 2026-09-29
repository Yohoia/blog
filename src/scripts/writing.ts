import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

/** 归档保持静态排版，Motion 只解释当前悬浮行与返回入口。 */
export function registerWritingArchive(): void {
  if (customElements.get('writing-archive')) return;

  class WritingArchive extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      this.cleanup?.();
      const controller = new AbortController();
      const { signal } = controller;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const posts = [
        ...this.querySelectorAll<HTMLElement>('[data-writing-post]'),
      ];
      const controls = new Map<HTMLElement, AnimationPlaybackControls>();
      let active: HTMLElement | undefined;
      const back = this.querySelector<HTMLAnchorElement>('[data-writing-back]');
      const backIcon = this.querySelector<HTMLElement>(
        '[data-writing-back-icon]',
      );
      let backHovered = false;
      let backFocused = false;

      const update = (
        element: HTMLElement,
        values: {
          opacity?: number;
          y?: number;
          x?: number;
          backgroundColor?: string;
          color?: string;
          scale?: number;
          scaleX?: number;
        },
      ) => {
        controls.get(element)?.stop();
        controls.set(
          element,
          animate(element, values, {
            duration: reduced.matches ? 0 : motionTokens.duration.ui,
            ease: motionTokens.easing,
          }),
        );
      };
      const paint = () => {
        const styles = getComputedStyle(document.documentElement);
        const hover = styles.getPropertyValue('--hover-surface').trim();
        const muted = styles.getPropertyValue('--muted-text').trim();
        const contrast = styles.getPropertyValue('--signal-contrast').trim();
        posts.forEach((post) => {
          const selected = post === active;
          update(post, { backgroundColor: selected ? hover : 'transparent' });
          const title = post.querySelector<HTMLElement>('[data-writing-title]');
          const disc = post.querySelector<HTMLElement>(
            '[data-writing-arrow-disc]',
          );
          const icon = post.querySelector<HTMLElement>(
            '[data-writing-arrow-icon]',
          );
          if (title)
            update(title, {
              opacity:
                active && !selected
                  ? motionTokens.writing.inactiveTitleOpacity
                  : 1,
            });
          if (disc)
            update(disc, {
              opacity: selected ? 1 : 0,
              scale: selected ? 1 : motionTokens.writing.arrowRestingScale,
            });
          if (icon)
            update(icon, {
              color: selected ? contrast : muted,
              x:
                !reduced.matches && selected
                  ? motionTokens.writing.arrowHoverDistance
                  : 0,
              y:
                !reduced.matches && selected
                  ? -motionTokens.writing.arrowHoverDistance
                  : 0,
            });
        });
        if (backIcon)
          update(backIcon, {
            x:
              !reduced.matches && (backHovered || backFocused)
                ? -motionTokens.distance.small
                : 0,
          });
      };
      posts.forEach((post) => {
        post.addEventListener(
          'pointerenter',
          (event) => {
            if (event.pointerType === 'touch') return;
            active = post;
            paint();
          },
          { signal },
        );
        post.addEventListener(
          'pointerleave',
          () => {
            if (active !== post) return;
            active = undefined;
            paint();
          },
          { signal },
        );
      });
      const tags = [
        ...this.querySelectorAll<HTMLElement>('[data-writing-tag]'),
      ];
      const selectedTags = new Set<HTMLElement>();
      const paintTag = (tag: HTMLElement, selected: boolean) => {
        const styles = getComputedStyle(document.documentElement);
        update(tag, {
          color: styles
            .getPropertyValue(selected ? '--heading' : '--muted-text')
            .trim(),
        });
        const underline = tag.querySelector<HTMLElement>(
          '[data-writing-tag-underline]',
        );
        if (underline) update(underline, { scaleX: selected ? 1 : 0 });
      };
      tags.forEach((tag) => {
        tag.addEventListener(
          'pointerenter',
          (event) => {
            if (event.pointerType === 'touch') return;
            selectedTags.add(tag);
            paintTag(tag, true);
          },
          { signal },
        );
        tag.addEventListener(
          'pointerleave',
          () => {
            selectedTags.delete(tag);
            paintTag(tag, false);
          },
          { signal },
        );
      });
      back?.addEventListener(
        'pointerenter',
        () => {
          backHovered = true;
          paint();
        },
        { signal },
      );
      back?.addEventListener(
        'pointerleave',
        () => {
          backHovered = false;
          paint();
        },
        { signal },
      );
      back?.addEventListener(
        'focus',
        () => {
          backFocused = true;
          paint();
        },
        { signal },
      );
      back?.addEventListener(
        'blur',
        () => {
          backFocused = false;
          paint();
        },
        { signal },
      );
      const syncPreferences = () => {
        paint();
        tags.forEach((tag) => paintTag(tag, selectedTags.has(tag)));
      };
      reduced.addEventListener('change', syncPreferences, { signal });
      window.addEventListener('theme:change', syncPreferences, { signal });

      const reset = () => {
        controls.forEach((animation, element) => {
          animation.stop();
          element.style.removeProperty('opacity');
          element.style.removeProperty('transform');
          element.style.removeProperty('background-color');
          element.style.removeProperty('color');
        });
        controls.clear();
        active = undefined;
        backHovered = false;
        backFocused = false;
        selectedTags.clear();
      };
      window.addEventListener('pagehide', reset, { signal });
      this.dataset.writingReady = 'true';
      this.cleanup = () => {
        controller.abort();
        reset();
        delete this.dataset.writingReady;
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }

  customElements.define('writing-archive', WritingArchive);
}
