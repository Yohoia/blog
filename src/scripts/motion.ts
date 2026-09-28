import { animate } from 'motion';
import { motionTokens } from '@/config/motion';

/** 按需调用；减少动画模式仅保留短暂的透明度变化。 */
export function reveal(element: Element) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return animate(
    element,
    {
      opacity: [0, 1],
      y: reduced ? 0 : [motionTokens.distance.medium, 0],
    },
    {
      duration: reduced
        ? motionTokens.reduced.duration
        : motionTokens.duration.page,
      ease: motionTokens.easing,
    },
  );
}
