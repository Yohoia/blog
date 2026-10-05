import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { cubicBezier } from 'motion';
import { motionTokens } from '../src/config/motion.ts';

const source = ts.transpileModule(
  readFileSync(new URL('../src/scripts/terminal.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};

function harness({
  refresh = true,
  reduced = false,
  fontsReady = Promise.resolve(),
} = {}) {
  const animations = [];
  const timers = new Map();
  let timerId = 0;
  let Terminal;
  class Element extends EventTarget {
    constructor() {
      super();
      this.dataset = {};
      this.attrs = new Set();
      this.style = {
        removeProperty(name) {
          delete this[name];
        },
      };
      this.hidden = false;
      this.isConnected = true;
      this.textContent = '';
    }
    setAttribute(name) {
      this.attrs.add(name);
    }
    toggleAttribute(name, on) {
      on ? this.attrs.add(name) : this.attrs.delete(name);
    }
  }
  class Avatar extends Element {
    progress = 0;
    durations = [];
    restore(value) {
      this.progress = value;
    }
    play(duration) {
      this.durations.push(duration);
      return new Promise((resolve) => {
        this.resolve = resolve;
      });
    }
    finish() {
      this.progress = 1;
      this.resolve?.();
    }
    destroy() {
      this.destroyed = true;
      this.resolve?.();
    }
  }
  class Step extends Element {
    constructor(command, avatar) {
      super();
      this.dataset.command = command;
      this.blocks = [new Element()];
      this.divider = new Element();
      this.avatar = avatar;
    }
    querySelector(selector) {
      if (selector === '[data-terminal-divider]') return this.divider;
      if (selector === '[data-terminal-avatar]') return this.avatar;
      return null;
    }
    querySelectorAll(selector) {
      return selector === '[data-terminal-output]' ? this.blocks : [];
    }
  }
  class Root extends Element {
    constructor() {
      super();
      this.fixturePrompt = new Element();
      this.fixtureTyping = new Element();
      this.fixtureCursor = new Element();
      this.fixtureAvatar = new Avatar();
      this.fixtureSteps = [
        new Step('whoami', this.fixtureAvatar),
        new Step('ls tools/'),
      ];
    }
    querySelector(selector) {
      return (
        {
          '[data-terminal-prompt]': this.fixturePrompt,
          '[data-terminal-typing]': this.fixtureTyping,
          '[data-terminal-cursor]': this.fixtureCursor,
          '[data-terminal-avatar]': this.fixtureAvatar,
        }[selector] ?? null
      );
    }
    querySelectorAll(selector) {
      return selector === '[data-terminal-step]' ? this.fixtureSteps : [];
    }
  }
  const media = Object.assign(new EventTarget(), { matches: reduced });
  const document = Object.assign(new EventTarget(), {
    fonts: { ready: fontsReady },
    visibilityState: 'visible',
    querySelector: () => document.current,
  });
  const window = Object.assign(new EventTarget(), {
    matchMedia: () => media,
    setTimeout: (callback, delay) => {
      const id = ++timerId;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  });
  function animate(from, to, options) {
    const control = {
      from,
      to,
      options,
      stopped: false,
      finished: false,
      stop() {
        this.stopped = true;
      },
      cancel() {
        this.stopped = true;
      },
      update(value) {
        if (!this.stopped && !this.finished) options.onUpdate?.(value);
      },
      complete() {
        if (this.stopped || this.finished) return;
        options.onUpdate?.(to);
        this.finished = true;
        options.onComplete?.();
      },
    };
    animations.push(control);
    return control;
  }
  const modules = {
    motion: { animate, cubicBezier },
    'motion/mini': { animate },
    '@/config/motion': { motionTokens },
    '@/scripts/page-visit': { isRefreshVisit: () => refresh },
    '@/scripts/pixel-avatar': { createPixelAvatar: (element) => element },
  };
  const exports = {};
  runInNewContext(source, {
    exports,
    require: (name) => modules[name],
    HTMLElement: Root,
    document,
    window,
    AbortController,
    IntersectionObserver: class {
      observe() {}
      disconnect() {
        this.disconnected = true;
      }
    },
    customElements: {
      get: () => undefined,
      define: (_, constructor) => {
        Terminal = constructor;
      },
    },
  });
  exports.registerTerminal();
  const create = () => {
    const root = new Terminal();
    document.current = root;
    root.connectedCallback();
    return root;
  };
  const timer = async () => {
    const [id, item] = timers.entries().next().value;
    timers.delete(id);
    item.callback();
    await flush();
    return item.delay;
  };
  const currentAnimation = () =>
    animations.findLast((item) => !item.stopped && !item.finished);
  const startOutput = async () => {
    const root = create();
    await flush();
    assert.equal(await timer(), 500);
    assert.equal(currentAnimation().options.duration, 'whoami'.length * 0.035);
    currentAnimation().complete();
    await flush();
    assert.equal(await timer(), 160);
    return root;
  };
  const swap = (root, navigationType = 'push') => {
    document.current = root;
    const event = Object.assign(new Event('astro:before-swap'), {
      navigationType,
      from: { pathname: '/' },
      to: { pathname: '/en/' },
      newDocument: {
        querySelector: () => ({}),
        documentElement: { dataset: {} },
      },
    });
    document.dispatchEvent(event);
    root.isConnected = false;
    root.disconnectedCallback();
  };
  return {
    setRefresh(value) {
      refresh = value;
    },
    create,
    timer,
    currentAnimation,
    startOutput,
    swap,
    media,
    window,
    animations,
    timers,
  };
}

test('output uses one shared clock and waits for the portrait before the next command', async () => {
  const h = harness();
  const root = await h.startOutput();
  const block = root.steps[0].blocks[0];
  assert.ok(block.attrs.has('data-output-visible'));
  assert.equal(block.style.opacity, '0');
  assert.equal(block.style.transform, 'translateY(8px)');
  assert.equal(h.currentAnimation().options.duration, 0.5);
  assert.deepEqual(root.avatar.durations, [0.5]);
  h.currentAnimation().update(0.4);
  assert.equal(root.snapshot().outputProgress, 0.4);
  assert.ok(Number(block.style.opacity) > 0.4);
  h.currentAnimation().complete();
  await flush();
  assert.equal(root.snapshot().completed, 0);
  root.avatar.finish();
  await flush();
  assert.equal(root.snapshot().completed, 1);
  assert.ok(root.steps[0].divider.attrs.has('data-visible'));
  assert.equal(block.style.opacity, undefined);
  assert.equal(block.style.transform, undefined);
  assert.equal(await h.timer(), 350);
  assert.equal(h.currentAnimation().to, 'ls tools/'.length);
  root.disconnectedCallback();
});

test('language swap preserves the partially visible block and portrait progress', async () => {
  const h = harness();
  const first = await h.startOutput();
  h.currentAnimation().update(0.4);
  first.avatar.progress = 0.4;
  const before = {
    opacity: first.steps[0].blocks[0].style.opacity,
    transform: first.steps[0].blocks[0].style.transform,
  };
  h.swap(first);
  assert.ok(first.avatar.destroyed);
  const second = h.create();
  assert.equal(second.snapshot().outputProgress, 0.4);
  assert.equal(second.avatar.progress, 0.4);
  assert.equal(h.currentAnimation().from, 0.4);
  assert.equal(h.currentAnimation().options.duration, 0.3);
  assert.deepEqual(
    {
      opacity: second.steps[0].blocks[0].style.opacity,
      transform: second.steps[0].blocks[0].style.transform,
    },
    before,
  );
  second.disconnectedCallback();
});

test('language swap continues the command instead of restarting typing', async () => {
  const h = harness();
  const first = h.create();
  await flush();
  await h.timer();
  h.currentAnimation().update(3);
  h.swap(first);
  const second = h.create();
  assert.equal(second.typing.textContent, 'who');
  assert.equal(h.currentAnimation().from, 3);
  assert.equal(h.currentAnimation().options.duration, 3 * 0.035);
  second.disconnectedCallback();
});

test('reduced motion during reveal stops work and restores all output styles', async () => {
  const h = harness();
  const root = await h.startOutput();
  h.currentAnimation().update(0.25);
  h.media.matches = true;
  h.media.dispatchEvent(new Event('change'));
  await flush();
  assert.equal(root.dataset.state, 'complete');
  assert.equal(root.snapshot().completed, 2);
  for (const step of root.steps) {
    assert.ok(step.attrs.has('data-visible'));
    assert.ok(step.blocks[0].attrs.has('data-output-visible'));
    assert.equal(step.blocks[0].style.opacity, undefined);
    assert.equal(step.blocks[0].style.transform, undefined);
  }
  assert.equal(h.timers.size, 0);
  assert.equal(root.cursor.style.opacity, '1');
  assert.equal(root.prompt.hidden, false);
  root.disconnectedCallback();
});

for (const mode of [{ refresh: false }, { reduced: true }]) {
  test(`static visit bypasses typing and reveal: ${JSON.stringify(mode)}`, () => {
    const h = harness(mode);
    const root = h.create();
    assert.equal(root.dataset.state, 'complete');
    assert.equal(h.animations.length, 0);
    assert.equal(h.timers.size, 0);
    root.disconnectedCallback();
  });
}

test('pagehide completes output and cancels the active clock', async () => {
  const h = harness();
  const root = await h.startOutput();
  const clock = h.currentAnimation();
  h.window.dispatchEvent(new Event('pagehide'));
  await flush();
  assert.ok(clock.stopped);
  assert.equal(root.dataset.state, 'complete');
  assert.equal(h.timers.size, 0);
  root.disconnectedCallback();
});

test('font timeout allows typing to start before fonts finish loading', async () => {
  let finishFonts;
  const h = harness({
    fontsReady: new Promise((resolve) => {
      finishFonts = resolve;
    }),
  });
  const root = h.create();
  await flush();
  assert.equal(h.animations.length, 0);
  assert.equal(await h.timer(), motionTokens.terminal.fontReadyTimeout * 1000);
  // 字体稍后完成不能清除下一阶段的延时，或重复启动播放。
  finishFonts();
  await flush();
  assert.equal(h.timers.size, 1);
  assert.equal(await h.timer(), 500);
  assert.equal(h.currentAnimation().to, 'whoami'.length);
  root.disconnectedCallback();
});

test('font rejection uses the fallback font without leaving a timeout', async () => {
  const h = harness({ fontsReady: Promise.reject(new Error('font failed')) });
  const root = h.create();
  await flush();
  assert.equal(h.timers.size, 1);
  assert.equal(await h.timer(), 500);
  assert.equal(h.currentAnimation().to, 'whoami'.length);
  root.disconnectedCallback();
});

test('disconnect during font waiting releases the timer and prevents playback', async () => {
  const h = harness({ fontsReady: new Promise(() => {}) });
  const root = h.create();
  await flush();
  assert.equal(h.timers.size, 1);
  root.disconnectedCallback();
  await flush();
  assert.equal(h.timers.size, 0);
  assert.equal(h.animations.length, 0);
});

test('history traversal between languages shows complete output immediately', async () => {
  const h = harness();
  const first = await h.startOutput();
  h.currentAnimation().update(0.4);
  h.swap(first, 'traverse');
  h.setRefresh(false);
  const second = h.create();
  await flush();
  assert.equal(second.dataset.state, 'complete');
  assert.equal(second.snapshot().completed, second.steps.length);
  assert.equal(h.timers.size, 0);
  for (const step of second.steps) {
    assert.ok(step.attrs.has('data-visible'));
    assert.ok(step.blocks[0].attrs.has('data-output-visible'));
    assert.equal(step.blocks[0].style.opacity, undefined);
    assert.equal(step.blocks[0].style.transform, undefined);
  }
  second.disconnectedCallback();
});
