import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

/** 归档保持静态排版，Motion 只解释当前悬浮行。 */
export function registerBlogArchive(): void {
  if (customElements.get('blog-archive')) return;

  class BlogArchive extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      this.cleanup?.();
      const controller = new AbortController();
      const { signal } = controller;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const posts = [...this.querySelectorAll<HTMLElement>('[data-blog-post]')];
      const controls = new Map<HTMLElement, AnimationPlaybackControls>();
      let active: HTMLElement | undefined;

      const update = (
        element: HTMLElement,
        values: {
          opacity?: number;
          y?: number;
          x?: number;
          backgroundColor?: string;
          '--blog-highlight-progress'?: number;
          color?: string;
          scale?: number;
          scaleX?: number;
        },
        duration: number = motionTokens.duration.ui,
      ) => {
        controls.get(element)?.stop();
        controls.set(
          element,
          animate(element, values, {
            duration: reduced.matches ? 0 : duration,
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
          const title = post.querySelector<HTMLElement>('[data-blog-title]');
          const highlight = post.querySelector<HTMLElement>(
            '[data-blog-highlight]',
          );
          const arrow = post.querySelector<HTMLElement>('[data-blog-arrow]');
          const disc = post.querySelector<HTMLElement>(
            '[data-blog-arrow-disc]',
          );
          const icon = post.querySelector<HTMLElement>(
            '[data-blog-arrow-icon]',
          );
          if (title)
            update(title, {
              opacity:
                active && !selected
                  ? motionTokens.blog.inactiveTitleOpacity
                  : 1,
            });
          if (highlight)
            update(
              highlight,
              // 高度固定在 CSS 中，只插值横向进度，避免 px 与 em 混用。
              { '--blog-highlight-progress': selected ? 1 : 0 },
              motionTokens.blog.highlightDuration,
            );
          if (disc)
            update(disc, {
              opacity: selected ? 1 : 0,
              scale: selected ? 1 : motionTokens.blog.arrowRestingScale,
            });
          if (arrow)
            update(arrow, {
              x:
                !reduced.matches && selected
                  ? motionTokens.blog.arrowHoverDistance
                  : 0,
            });
          if (icon)
            update(icon, {
              color: selected ? contrast : muted,
            });
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
      const tags = [...this.querySelectorAll<HTMLElement>('[data-blog-tag]')];
      const selectedTags = new Set<HTMLElement>();
      const paintTag = (tag: HTMLElement, selected: boolean) => {
        const styles = getComputedStyle(document.documentElement);
        update(tag, {
          color: styles
            .getPropertyValue(selected ? '--heading' : '--muted-text')
            .trim(),
        });
        const underline = tag.querySelector<HTMLElement>(
          '[data-blog-tag-underline]',
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
          element.style.removeProperty('--blog-highlight-progress');
          element.style.removeProperty('color');
        });
        controls.clear();
        active = undefined;
        selectedTags.clear();
      };
      window.addEventListener('pagehide', reset, { signal });
      this.dataset.blogReady = 'true';
      this.cleanup = () => {
        controller.abort();
        reset();
        delete this.dataset.blogReady;
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }

  customElements.define('blog-archive', BlogArchive);
}
