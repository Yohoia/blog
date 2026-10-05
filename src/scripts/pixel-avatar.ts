import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

export interface PixelAvatarController {
  readonly progress: number;
  restore(progress: number): void;
  play(duration: number): Promise<void>;
  finish(): void;
  destroy(): void;
}

/** SVG 提供完整的无脚本头像；播放时只用一个 Motion 时钟驱动 Canvas。 */
export function createPixelAvatar(
  element: HTMLElement | null,
  reducedMotion: MediaQueryList,
): PixelAvatarController | undefined {
  const canvas = element?.querySelector('canvas');
  const portrait = element?.querySelector('svg');
  const context = canvas?.getContext('2d');
  if (!element || !canvas || !portrait || !context) return;

  const size = portrait.viewBox.baseVal.width;
  const cell = size / 64;
  const tokens = motionTokens.avatar;
  const pixels = [...portrait.querySelectorAll('circle')].map((circle) => {
    const x = circle.cx.baseVal.value;
    const y = circle.cy.baseVal.value;
    const row = y / cell - 0.5;
    const column = x / cell - 0.5;
    const seed = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
    const random = seed - Math.floor(seed);
    const angle = random * Math.PI * 2;
    const distance =
      tokens.scatter.min + random * (tokens.scatter.max - tokens.scatter.min);
    return {
      x,
      y,
      radius: circle.r.baseVal.value,
      blue:
        circle
          .closest('[data-avatar-color]')
          ?.getAttribute('data-avatar-color') === 'blue',
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      delay: (row / 64) * tokens.rowDelay + random * tokens.randomDelay,
    };
  });
  if (!pixels.length) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * ratio;
  canvas.height = size * ratio;
  context.scale(ratio, ratio);
  const controller = new AbortController();
  let progress = 0;
  let animation: AnimationPlaybackControls | undefined;
  let settle: (() => void) | undefined;
  let blue = '';
  let yellow = '';

  const layout = element.closest<HTMLElement>('.identity-layout');
  const copy = layout?.querySelector<HTMLElement>(':scope > div');
  const desktop = window.matchMedia('(width > 35rem)');
  let sizeFrame: number | undefined;
  const measureSize = () => {
    if (!layout || !copy) return;
    if (!desktop.matches) {
      layout.style.removeProperty('--avatar-size');
      return;
    }
    const height = copy.getBoundingClientRect().height;
    const next = `${Math.ceil(height)}px`;
    if (height > 0 && layout.style.getPropertyValue('--avatar-size') !== next)
      layout.style.setProperty('--avatar-size', next);
  };
  // 在观察回调之外合并尺寸写入，避免修改网格后再次同步触发观察器。
  const syncSize = () => {
    if (sizeFrame !== undefined || controller.signal.aborted) return;
    sizeFrame = window.requestAnimationFrame(() => {
      sizeFrame = undefined;
      measureSize();
    });
  };
  const sizeObserver = new ResizeObserver(syncSize);
  if (copy) sizeObserver.observe(copy);
  desktop.addEventListener('change', syncSize, { signal: controller.signal });

  const syncPalette = () => {
    const styles = getComputedStyle(element);
    blue = styles.getPropertyValue('--avatar-blue').trim();
    yellow = styles.getPropertyValue('--avatar-yellow').trim();
  };
  const draw = () => {
    context.clearRect(0, 0, size, size);
    const elapsed = progress * tokens.duration;
    for (const pixel of pixels) {
      const part = Math.max(
        0,
        Math.min(1, (elapsed - pixel.delay) / tokens.pointDuration),
      );
      if (!part) continue;
      const eased = 1 - Math.pow(1 - part, 3);
      context.globalAlpha = Math.min(1, part * 2);
      context.fillStyle = pixel.blue ? blue : yellow;
      context.beginPath();
      context.arc(
        pixel.x + pixel.dx * (1 - eased),
        pixel.y + pixel.dy * (1 - eased),
        pixel.radius,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
    context.globalAlpha = 1;
  };
  const stop = () => {
    animation?.stop();
    animation = undefined;
    settle?.();
    settle = undefined;
  };
  const showComplete = (useSvg = reducedMotion.matches) => {
    element.hidden = false;
    element.toggleAttribute('data-avatar-rendering', !useSvg);
    element.dataset.avatarState = 'complete';
    canvas.hidden = useSvg;
    if (!useSvg) draw();
  };
  const finish = () => {
    stop();
    progress = 1;
    showComplete(true);
  };
  const restore = (value: number) => {
    stop();
    progress = Math.max(0, Math.min(1, value));
    element.hidden = progress === 0;
    if (progress === 1) {
      showComplete();
      return;
    }
    element.setAttribute('data-avatar-rendering', '');
    element.dataset.avatarState = progress ? 'paused' : 'pending';
    canvas.hidden = false;
    draw();
  };
  const play = (duration: number): Promise<void> => {
    if (controller.signal.aborted) return Promise.resolve();
    stop();
    // 首行开始前测量已占位的完整文字；动画完成时不再改变尺寸或切换绘制方式。
    measureSize();
    if (reducedMotion.matches || progress >= 1) {
      finish();
      return Promise.resolve();
    }
    element.hidden = false;
    element.setAttribute('data-avatar-rendering', '');
    element.dataset.avatarState = 'revealing';
    canvas.hidden = false;
    draw();
    return new Promise((resolve) => {
      settle = resolve;
      animation = animate(progress, 1, {
        duration: duration * (1 - progress),
        ease: 'linear',
        onUpdate: (value) => {
          progress = value;
          draw();
        },
        onComplete: () => {
          animation = undefined;
          settle = undefined;
          progress = 1;
          showComplete();
          resolve();
        },
      });
    });
  };
  const replay = () => {
    // whoami 的首轮由终端统一播放，交互不能抢在信息输出前显示头像。
    if (progress !== 1 || animation || reducedMotion.matches) return;
    restore(0);
    void play(tokens.duration);
  };

  syncPalette();
  element.addEventListener('pointerenter', replay, {
    signal: controller.signal,
  });
  element.addEventListener('focus', replay, { signal: controller.signal });
  element.addEventListener('click', replay, { signal: controller.signal });
  window.addEventListener(
    'theme:change',
    () => {
      syncPalette();
      draw();
    },
    { signal: controller.signal },
  );

  return {
    get progress() {
      return progress;
    },
    restore,
    play,
    finish,
    destroy() {
      controller.abort();
      sizeObserver.disconnect();
      if (sizeFrame !== undefined) window.cancelAnimationFrame(sizeFrame);
      stop();
    },
  };
}
