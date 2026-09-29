import { navigate } from 'astro:transitions/client';
import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';

const glyphs =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+-=[]{}<>/?~';
const tokens = motionTokens.navigationTransition;

interface Cell {
  x: number;
  y: number;
  appear: number;
  disappear: number;
  character: string;
  seed: number;
}

interface Transition {
  link: HTMLAnchorElement;
  url: URL;
  layer: HTMLElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  controller: AbortController;
  seed: number;
  origin: { x: number; y: number };
  cells: Cell[];
  cellSize: number;
  width: number;
  height: number;
  progress: number;
  lastFrame: number;
  lastShuffle: number;
  background: string;
  foreground: string;
  skipAnimation: boolean;
}

let initialized = false;
let active: Transition | undefined;
let clock: AnimationPlaybackControls | undefined;
let settleClock: (() => void) | undefined;

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** 相邻格共享平滑噪声，形成成片的填充与退场，而非整屏透明度渐变。 */
function noise(x: number, y: number): number {
  const column = Math.floor(x);
  const row = Math.floor(y);
  const ease = (value: number) => value * value * (3 - 2 * value);
  const dx = ease(x - column);
  const dy = ease(y - row);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  return mix(
    mix(hash(column, row), hash(column + 1, row), dx),
    mix(hash(column, row + 1), hash(column + 1, row + 1), dx),
    dy,
  );
}

function palette(run: Transition): void {
  const styles = getComputedStyle(document.documentElement);
  run.background = styles.getPropertyValue('--canvas').trim();
  run.foreground = styles.getPropertyValue('--heading').trim();
  run.context.font = `${run.cellSize}px ${styles.getPropertyValue('--font-mono').trim()}`;
  run.context.textAlign = 'center';
  run.context.textBaseline = 'middle';
}

function resize(run: Transition): void {
  const ratio = Math.min(window.devicePixelRatio || 1, tokens.maxPixelRatio);
  // stable both-edges 会缩小 CSS 100vw；使用实际视口尺寸覆盖两侧占位。
  run.layer.style.inlineSize = `${window.innerWidth}px`;
  run.layer.style.blockSize = `${window.innerHeight}px`;
  run.layer.style.left = `${-document.documentElement.getBoundingClientRect().left}px`;
  if (
    run.cells.length &&
    run.width === window.innerWidth &&
    run.height === window.innerHeight &&
    run.canvas.width === Math.ceil(run.width * ratio) &&
    run.canvas.height === Math.ceil(run.height * ratio)
  ) {
    palette(run);
    draw(run, true);
    return;
  }
  run.width = window.innerWidth;
  run.height = window.innerHeight;
  let size: number = tokens.cellSize;
  while (
    Math.ceil(run.width / size) * Math.ceil(run.height / size) >
    tokens.maxCells
  )
    size += 1;
  run.cellSize = size;
  run.canvas.width = Math.ceil(run.width * ratio);
  run.canvas.height = Math.ceil(run.height * ratio);
  run.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  // 与菜单一致，仅补偿原生顶层元素的滚动条占位，不改变页面几何尺寸。
  run.cells = [];
  for (let y = 0; y < run.height; y += size) {
    for (let x = 0; x < run.width; x += size) {
      const column = x / size;
      const row = y / size;
      const seed = hash(column + run.seed, row + run.seed);
      const wave = Math.pow(
        noise(
          (column - (run.origin.x * run.width) / size) * tokens.noiseScale +
            run.seed,
          (row - (run.origin.y * run.height) / size) * tokens.noiseScale +
            run.seed,
        ),
        1.45,
      );
      const jitter = (seed - 0.5) * 0.04;
      run.cells.push({
        x,
        y,
        appear: Math.min(0.48, Math.max(0, wave * 0.46 + jitter)),
        disappear: Math.min(
          1,
          Math.max(0.52, 0.52 + (1 - wave) * 0.46 + jitter),
        ),
        character: glyphs.charAt(Math.floor(seed * glyphs.length)),
        seed,
      });
    }
  }
  palette(run);
  draw(run, true);
}

function draw(run: Transition, force = false): void {
  const time = performance.now();
  if (!force && time - run.lastFrame < 1000 / tokens.framesPerSecond) return;
  run.lastFrame = time;
  const tick = Math.floor(time / tokens.shuffleInterval);
  const shuffle = tick !== run.lastShuffle;
  run.lastShuffle = tick;
  const { context, cellSize: size, progress } = run;
  context.clearRect(0, 0, run.width, run.height);
  for (const cell of run.cells) {
    if (progress < cell.appear || progress >= cell.disappear) continue;
    if (shuffle && hash(cell.seed * 100, tick) < 0.35)
      cell.character = glyphs.charAt(
        Math.floor(hash(tick, cell.seed * 100) * glyphs.length),
      );
    context.globalAlpha = 1;
    context.fillStyle = run.background;
    context.fillRect(cell.x, cell.y, size + 1, size + 1);
    context.globalAlpha =
      progress - cell.appear < tokens.edgeWidth ||
      cell.disappear - progress < tokens.edgeWidth
        ? tokens.dimOpacity
        : 1;
    context.fillStyle = run.foreground;
    context.fillText(cell.character, cell.x + size / 2, cell.y + size / 2);
  }
  context.globalAlpha = 1;
  run.layer.dataset.transitionProgress = progress.toFixed(3);
}

function stopClock(): void {
  clock?.stop();
  clock = undefined;
  settleClock?.();
  settleClock = undefined;
}

function play(
  run: Transition,
  from: number,
  to: number,
  duration: number,
): Promise<void> {
  stopClock();
  run.progress = from;
  draw(run, true);
  return new Promise((resolve) => {
    settleClock = resolve;
    clock = animate(from, to, {
      duration,
      ease: 'linear',
      onUpdate: (value) => {
        run.progress = value;
        draw(run);
      },
      onComplete: () => {
        clock = undefined;
        settleClock = undefined;
        run.progress = to;
        draw(run, true);
        resolve();
      },
    });
  });
}

function show(run: Transition): void {
  if (!run.layer.matches(':popover-open')) run.layer.showPopover();
  document.documentElement.setAttribute('aria-busy', 'true');
}

function cleanup(run: Transition): void {
  if (active !== run) return;
  active = undefined;
  run.controller.abort();
  stopClock();
  if (run.layer.matches(':popover-open')) run.layer.hidePopover();
  run.layer.removeAttribute('data-transition-progress');
  run.layer.removeAttribute('data-transition-stage');
  run.canvas.width = run.canvas.height = 1;
  run.cells = [];
  document.documentElement.removeAttribute('aria-busy');
}

async function transition(run: Transition, covered: () => void): Promise<void> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    show(run);
    resize(run);
    run.layer.dataset.transitionStage = 'fill';
    await play(run, 0, 0.5, tokens.fillDuration);
    if (active !== run) return;
    run.progress = 0.5;
    draw(run, true);
    covered();
    run.layer.dataset.transitionStage = 'hold';
    // 网络等待期间保持完全覆盖，字符继续切换；不用重复生成网格。
    if (!run.skipAnimation)
      clock = animate(0, 1, {
        duration: 1,
        repeat: Infinity,
        onUpdate: () => draw(run),
      });
    else if (run.layer.matches(':popover-open')) run.layer.hidePopover();

    const loaded = new Promise<void>((resolve) => {
      document.addEventListener('astro:page-load', () => resolve(), {
        once: true,
        signal: run.controller.signal,
      });
      run.controller.signal.addEventListener('abort', () => resolve(), {
        once: true,
      });
    });
    const deadline = new Promise<never>((_, reject) => {
      timeout = setTimeout(
        () => reject(new Error('Navigation timed out')),
        tokens.timeout,
      );
    });
    await Promise.race([
      Promise.all([
        navigate(run.url.href, { sourceElement: run.link }),
        loaded,
      ]),
      deadline,
    ]);
    if (timeout) clearTimeout(timeout);
    if (active !== run) return;
    stopClock();
    if (!run.skipAnimation) {
      run.layer.dataset.transitionStage = 'clear';
      await play(run, 0.5, 1, tokens.clearDuration);
    }
    if (active !== run) return;
    cleanup(run);
    const main = document.getElementById('main-content');
    if (main) {
      const tabindex = main.getAttribute('tabindex');
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
      main.addEventListener(
        'blur',
        () => {
          if (tabindex === null) main.removeAttribute('tabindex');
          else main.setAttribute('tabindex', tabindex);
        },
        { once: true },
      );
    }
  } catch {
    if (active !== run) return;
    cleanup(run);
    window.location.assign(run.url.href);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

/** 导航栏目与 Header Logo 共用此流程；普通链接与语言按钮不进入。 */
export function startNavigationTransition(
  link: HTMLAnchorElement,
  covered: () => void = () => {},
): boolean {
  if (active) return true;
  if (!link.hasAttribute('data-navigation-transition')) return false;
  const url = new URL(link.href);
  if (
    url.origin !== location.origin ||
    link.target === '_blank' ||
    link.hasAttribute('download')
  )
    return false;
  if (
    url.pathname.replace(/\/+$/, '') ===
      location.pathname.replace(/\/+$/, '') &&
    url.search === location.search
  ) {
    covered();
    return true;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return false;
  const layer = document.querySelector<HTMLElement>(
    '[data-navigation-transition-layer]',
  );
  const canvas = layer?.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!layer || !canvas || !context || typeof layer.showPopover !== 'function')
    return false;
  initializeNavigationTransition();
  const rect = link.getBoundingClientRect();
  const run: Transition = {
    link,
    url,
    layer,
    canvas,
    context,
    controller: new AbortController(),
    seed: Math.random() * 1000,
    origin: {
      x: (rect.x + rect.width / 2) / window.innerWidth,
      y: (rect.y + rect.height / 2) / window.innerHeight,
    },
    cells: [],
    cellSize: tokens.cellSize,
    width: 0,
    height: 0,
    progress: 0,
    lastFrame: 0,
    lastShuffle: -1,
    background: '',
    foreground: '',
    skipAnimation: false,
  };
  active = run;
  void transition(run, covered);
  return true;
}

export function initializeNavigationTransition(): void {
  if (initialized) return;
  initialized = true;
  document.addEventListener('astro:before-preparation', (event) => {
    if (active && event.sourceElement !== active.link) cleanup(active);
  });
  document.addEventListener('astro:before-swap', (event) => {
    if (!active) return;
    // 避免浏览器 View Transition 快照把正在变换的 Canvas 定格或再次淡入。
    void event.viewTransition.ready.catch(() => {
      // 主动跳过快照动画会按规范拒绝 ready；Canvas 已负责可见的过渡。
    });
    event.viewTransition.skipTransition();
  });
  document.addEventListener('astro:after-swap', () => {
    if (!active) return;
    if (!active.skipAnimation) show(active);
    resize(active);
  });
  window.addEventListener('resize', () => {
    if (active) resize(active);
  });
  window.addEventListener('theme:change', () => {
    if (!active) return;
    palette(active);
    draw(active, true);
  });
  window.addEventListener('pagehide', () => {
    if (active) cleanup(active);
  });
  const skip = () => {
    if (!active) return;
    active.skipAnimation = true;
    stopClock();
    if (active.layer.matches(':popover-open')) active.layer.hidePopover();
  };
  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', (event) => {
      if (event.matches) skip();
    });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) skip();
  });
  // 过渡中拦截重复点击与页面滚动；浏览器快捷键、历史导航仍由浏览器处理。
  const block = (event: Event) => {
    if (!active) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  document.addEventListener(
    'click',
    (event) => {
      if (active) {
        block(event);
        return;
      }
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;
      const link = event.target.closest<HTMLAnchorElement>(
        'a[data-navigation-transition]',
      );
      // 菜单仍由自身控制器衔接关闭时机，Header Logo 直接复用同一过渡。
      if (
        link &&
        !link.hasAttribute('data-overlay-link') &&
        startNavigationTransition(link)
      )
        event.preventDefault();
    },
    true,
  );
  document.addEventListener('wheel', block, { capture: true, passive: false });
  document.addEventListener('touchmove', block, {
    capture: true,
    passive: false,
  });
  document.addEventListener(
    'keydown',
    (event) => {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) block(event);
    },
    true,
  );
}
