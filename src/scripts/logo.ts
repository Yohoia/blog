import {
  animate,
  type AnimationPlaybackControls,
  type AnimationSequence,
} from 'motion';
import { motionTokens } from '@/config/motion';

type StrokeTiming = (typeof motionTokens.logo.strokes)[number];
interface LogoStroke {
  element: SVGPathElement;
  timing: StrokeTiming;
}

/** Astro 自定义元素负责动画生命周期，不需要 React hydration。 */
export function registerLogo(): void {
  if (customElements.get('yohoia-logo')) return;

  class YohoiaLogo extends HTMLElement {
    private strokes: LogoStroke[] = [];
    private dot: SVGPathElement | null = null;
    private animation?: AnimationPlaybackControls;
    private cleanup?: () => void;
    private reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    connectedCallback() {
      this.cleanup?.();
      const strokes: LogoStroke[] = [];
      for (const timing of motionTokens.logo.strokes) {
        const element = this.querySelector<SVGPathElement>(
          `[data-logo-stroke="${timing.name}"]`,
        );
        if (!element) return;
        strokes.push({ element, timing });
      }
      const dot = this.querySelector<SVGPathElement>('[data-logo-dot]');
      if (!dot) return;
      this.strokes = strokes;
      this.dot = dot;

      const controller = new AbortController();
      const { signal } = controller;
      const trigger = this.closest('a') ?? this;
      trigger.addEventListener(
        'pointerenter',
        (event) => {
          if (event instanceof PointerEvent && event.pointerType === 'mouse')
            this.play();
        },
        { signal },
      );
      trigger.addEventListener('focus', () => this.play(), { signal });
      this.reducedMotion.addEventListener(
        'change',
        (event) => {
          if (event.matches) this.finish();
        },
        { signal },
      );

      this.cleanup = () => {
        controller.abort();
        this.finish();
      };
      if (this.dataset.logoSkipIntro === 'true') {
        delete this.dataset.logoSkipIntro;
        this.finish();
      } else {
        this.play();
      }
    }

    play(): void {
      const dot = this.dot;
      if (!dot || !this.isConnected || this.dataset.logoState === 'playing')
        return;
      if (this.reducedMotion.matches) {
        this.finish();
        return;
      }

      this.dataset.logoState = 'playing';
      const sequence: AnimationSequence = [];
      for (const { element, timing } of this.strokes) {
        element.style.strokeDashoffset = '1';
        sequence.push([
          element,
          { strokeDashoffset: [1, 0] },
          {
            at: timing.at,
            duration: timing.duration,
            ease: timing.ease,
          },
        ]);
      }
      dot.style.opacity = '0';
      dot.style.transform = `scale(${motionTokens.logo.dot.initialScale})`;
      sequence.push([
        dot,
        { opacity: [0, 1], scale: [motionTokens.logo.dot.initialScale, 1] },
        {
          at: motionTokens.logo.dot.at,
          duration: motionTokens.logo.dot.duration,
          ease: 'easeOut',
        },
      ]);

      const animation = animate(sequence);
      this.animation = animation;
      void animation.finished.then(() => {
        if (this.animation === animation) this.finish();
      });
    }

    private finish(): void {
      const animation = this.animation;
      this.animation = undefined;
      animation?.stop();
      this.strokes.forEach(({ element }) => {
        element.style.strokeDashoffset = '0';
      });
      if (this.dot) {
        this.dot.style.opacity = '1';
        this.dot.style.transform = 'none';
      }
      this.dataset.logoState = 'complete';
    }

    disconnectedCallback() {
      this.cleanup?.();
    }
  }

  customElements.define('yohoia-logo', YohoiaLogo);
}
