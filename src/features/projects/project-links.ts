import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

export function registerProjectLinks(): void {
  if (customElements.get('project-links')) return;
  class ProjectLinks extends HTMLElement {
    private cleanup?: () => void;
    connectedCallback() {
      this.cleanup?.();
      const controller = new AbortController();
      const { signal } = controller;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const fine = matchMedia('(hover: hover) and (pointer: fine)');
      const controls = new Map<Element, AnimationPlaybackControls>();
      this.querySelectorAll('a').forEach((link) => {
        const arrow = link.querySelector('svg');
        let hovered = false;
        let focused = false;
        const paint = () => {
          const active = hovered || focused;
          controls.get(link)?.stop();
          controls.set(
            link,
            animate(
              link,
              { '--project-link-progress': active ? 1 : 0 },
              {
                duration: reduced.matches
                  ? 0
                  : motionTokens.projects.hoverDuration,
                ease: motionTokens.easing,
              },
            ),
          );
          if (arrow) {
            controls.get(arrow)?.stop();
            controls.set(
              arrow,
              animate(
                arrow,
                {
                  x:
                    active && !reduced.matches
                      ? motionTokens.projects.linkDistance
                      : 0,
                },
                {
                  duration: reduced.matches
                    ? 0
                    : motionTokens.projects.hoverDuration,
                  ease: motionTokens.easing,
                },
              ),
            );
          }
        };
        link.addEventListener(
          'pointerenter',
          () => {
            hovered = fine.matches;
            paint();
          },
          { signal },
        );
        link.addEventListener(
          'pointerleave',
          () => {
            hovered = false;
            paint();
          },
          { signal },
        );
        link.addEventListener(
          'focus',
          () => {
            focused = true;
            paint();
          },
          { signal },
        );
        link.addEventListener(
          'blur',
          () => {
            focused = false;
            paint();
          },
          { signal },
        );
        reduced.addEventListener('change', paint, { signal });
      });
      this.cleanup = () => {
        controller.abort();
        controls.forEach((control) => control.stop());
      };
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  }
  customElements.define('project-links', ProjectLinks);
}
