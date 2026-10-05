import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

/** 原始插图保持整体，Motion 只负责轻微视差、入场和外链反馈。 */
export function registerSkillsGrid(): void {
  if (customElements.get('skills-grid')) return;

  class SkillsGrid extends HTMLElement {
    private cleanup?: () => void;

    connectedCallback() {
      this.cleanup?.();
      const controller = new AbortController();
      const { signal } = controller;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const fine = matchMedia('(hover: hover) and (pointer: fine)');
      const tokens = motionTokens.skills;
      const controls = new Map<Element, AnimationPlaybackControls>();
      const cards = [
        ...this.querySelectorAll<HTMLElement>('[data-skill-card]'),
      ];
      const move = (
        element: HTMLElement,
        values: Parameters<typeof animate>[1],
        duration: number,
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
      const repaint: (() => void)[] = [];
      cards.forEach((card) => {
        const art = card.querySelector<HTMLElement>('[data-skill-art]');
        const arrow = card.querySelector<HTMLElement>('[data-skill-arrow]');
        let hovered = false;
        let focused = false;
        const paint = () => {
          hovered = hovered && fine.matches;
          const active = hovered || focused;
          const styles = getComputedStyle(card);
          move(
            card,
            {
              '--skill-glow': active ? 1 : 0,
              ...(!hovered || reduced.matches
                ? { '--skill-rotate-x': 0, '--skill-rotate-y': 0 }
                : {}),
            },
            active ? tokens.hoverDuration : tokens.resetDuration,
          );
          if (art)
            move(
              art,
              {
                x: 0,
                y: 0,
                scale: active && !reduced.matches ? tokens.artScale : 1,
              },
              tokens.hoverDuration,
            );
          if (arrow)
            move(
              arrow,
              {
                x: active && !reduced.matches ? tokens.arrowDistance : 0,
                y: active && !reduced.matches ? -tokens.arrowDistance : 0,
                backgroundColor: active
                  ? styles.getPropertyValue('--signal-text').trim()
                  : 'transparent',
                borderColor: styles
                  .getPropertyValue(active ? '--signal-text' : '--border')
                  .trim(),
                color: styles
                  .getPropertyValue(
                    active ? '--signal-contrast' : '--muted-text',
                  )
                  .trim(),
              },
              tokens.hoverDuration,
            );
        };
        repaint.push(paint);
        card.addEventListener(
          'pointerenter',
          () => {
            hovered = fine.matches;
            paint();
          },
          { signal },
        );
        card.addEventListener(
          'pointermove',
          (event) => {
            if (
              !hovered ||
              !fine.matches ||
              reduced.matches ||
              event.pointerType === 'touch'
            )
              return;
            const rect = card.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const px = Math.max(
              0,
              Math.min(1, (event.clientX - rect.left) / rect.width),
            );
            const py = Math.max(
              0,
              Math.min(1, (event.clientY - rect.top) / rect.height),
            );
            card.style.setProperty('--skill-pointer-x', `${px * 100}%`);
            card.style.setProperty('--skill-pointer-y', `${py * 100}%`);
            move(
              card,
              {
                '--skill-glow': 1,
                '--skill-rotate-x': (0.5 - py) * tokens.rotateX,
                '--skill-rotate-y': (px - 0.5) * tokens.rotateY,
              },
              tokens.hoverDuration,
            );
            if (art)
              move(
                art,
                {
                  x: (px - 0.5) * -tokens.artX,
                  y: (py - 0.5) * -tokens.artY,
                  scale: tokens.artScale,
                },
                tokens.hoverDuration,
              );
          },
          { signal },
        );
        card.addEventListener(
          'pointerleave',
          () => {
            hovered = false;
            paint();
          },
          { signal },
        );
        card.addEventListener(
          'focus',
          () => {
            focused = true;
            paint();
          },
          { signal },
        );
        card.addEventListener(
          'blur',
          () => {
            focused = false;
            paint();
          },
          { signal },
        );
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          if (reduced.matches || !(entry.target instanceof HTMLElement)) return;
          const item = entry.target;
          const index = cards.findIndex((card) => card.parentElement === item);
          controls.set(
            item,
            animate(
              item,
              {
                opacity: [0, 1],
                y: [tokens.enterDistance, 0],
              },
              {
                duration: tokens.enterDuration,
                delay: Math.min(Math.max(index, 0), 3) * tokens.stagger,
                ease: motionTokens.easing,
              },
            ),
          );
        });
      });
      cards.forEach((card) => {
        if (card.parentElement) observer.observe(card.parentElement);
      });
      const sync = () => {
        if (reduced.matches) {
          cards.forEach((card) => {
            const item = card.parentElement;
            if (!item) return;
            controls.get(item)?.stop();
            item.style.removeProperty('opacity');
            item.style.removeProperty('transform');
          });
        }
        repaint.forEach((paint) => paint());
      };
      reduced.addEventListener('change', sync, { signal });
      fine.addEventListener('change', sync, { signal });
      window.addEventListener('theme:change', sync, { signal });
      window.addEventListener(
        'pagehide',
        () => {
          controls.forEach((control) => control.stop());
          cards.forEach((card) => {
            card.style.setProperty('--skill-rotate-x', '0');
            card.style.setProperty('--skill-rotate-y', '0');
            card.parentElement?.style.removeProperty('opacity');
            card.parentElement?.style.removeProperty('transform');
            card
              .querySelector<HTMLElement>('[data-skill-art]')
              ?.style.removeProperty('transform');
          });
        },
        { signal },
      );
      window.addEventListener('pageshow', sync, { signal });
      this.cleanup = () => {
        controller.abort();
        observer.disconnect();
        controls.forEach((control) => control.stop());
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = undefined;
    }
  }

  customElements.define('skills-grid', SkillsGrid);
}
