import { animate, cubicBezier, type AnimationPlaybackControls } from 'motion';
import { animate as animateElement } from 'motion/mini';
import { motionTokens } from '@/config/motion';
import { isRefreshVisit } from '@/scripts/page-visit';
import {
  createPixelAvatar,
  type PixelAvatarController,
} from '@/scripts/pixel-avatar';

interface PlaybackSnapshot {
  completed: number;
  typed: number;
  outputStarted: boolean;
  outputProgress: number;
  login: string;
  avatarProgress: number;
}

/** SSR 提供完整内容；浏览器仅负责播放呈现，不执行任何终端命令。 */
export function registerTerminal(): void {
  if (customElements.get('yohoia-terminal')) return;
  let pending: PlaybackSnapshot | undefined;
  const outputEase = cubicBezier(...motionTokens.easing);

  class YohoiaTerminal extends HTMLElement {
    private prompt: HTMLElement | null = null;
    private typing: HTMLElement | null = null;
    private cursor: HTMLElement | null = null;
    private steps: HTMLElement[] = [];
    private completed = 0;
    private typed = 0;
    private outputStarted = false;
    private outputProgress = 0;
    private login = '';
    private controller?: AbortController;
    private typingAnimation?: AnimationPlaybackControls;
    private outputAnimation?: AnimationPlaybackControls;
    private cursorAnimation?: AnimationPlaybackControls;
    private cursorObserver?: IntersectionObserver;
    private cursorInView = false;
    private pageActive = true;
    private avatar?: PixelAvatarController;
    private reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    connectedCallback() {
      this.prompt = this.querySelector('[data-terminal-prompt]');
      this.typing = this.querySelector('[data-terminal-typing]');
      this.cursor = this.querySelector('[data-terminal-cursor]');
      this.steps = [
        ...this.querySelectorAll<HTMLElement>('[data-terminal-step]'),
      ];
      if (!this.prompt || !this.typing || !this.cursor || !this.steps.length)
        return;

      const saved = pending;
      pending = undefined;
      this.completed = saved?.completed ?? 0;
      this.typed = saved?.typed ?? 0;
      this.outputStarted = saved?.outputStarted ?? false;
      this.outputProgress = saved?.outputProgress ?? 0;
      this.prompt.hidden = this.outputStarted;
      this.login = saved?.login ?? new Date().toISOString();
      this.updateLogin();
      this.steps.forEach((step, index) => {
        const complete = index < this.completed;
        const active = index === this.completed && this.outputStarted;
        step.toggleAttribute('data-visible', complete || active);
        this.outputBlocks(step).forEach((block) => {
          block.toggleAttribute('data-output-visible', complete || active);
        });
        if (active) this.renderOutput(step, this.outputProgress);
        step
          .querySelector('[data-terminal-divider]')
          ?.toggleAttribute('data-visible', complete);
      });
      const command = this.steps[this.completed]?.dataset.command ?? '';
      this.typing.textContent = this.outputStarted
        ? ''
        : command.slice(0, this.typed);
      this.avatar = createPixelAvatar(
        this.querySelector('[data-terminal-avatar]'),
        this.reducedMotion,
      );
      this.avatar?.restore(
        this.completed > 0 ? 1 : (saved?.avatarProgress ?? 0),
      );
      this.reducedMotion.addEventListener('change', this.onMotionPreference);
      window.addEventListener('pagehide', this.onPageHide);
      window.addEventListener('pageshow', this.onPageShow);
      document.addEventListener('visibilitychange', this.syncCursor);
      this.cursorObserver = new IntersectionObserver(([entry]) => {
        this.cursorInView = entry?.isIntersecting ?? false;
        this.syncCursor();
      });
      this.cursorObserver.observe(this.cursor);

      if (this.reducedMotion.matches || (!saved && !isRefreshVisit())) {
        this.finish();
        return;
      }

      if (this.completed >= this.steps.length) {
        this.dataset.state = 'complete';
        this.syncCursor();
        return;
      }
      if (!this.outputStarted) this.startCursor();

      this.dataset.state = 'playing';
      this.controller = new AbortController();
      void this.play(this.controller.signal, !saved);
    }

    disconnectedCallback() {
      this.pageActive = false;
      this.controller?.abort();
      this.typingAnimation?.stop();
      this.outputAnimation?.stop();
      this.holdCursor();
      this.cursorObserver?.disconnect();
      this.avatar?.destroy();
      this.reducedMotion.removeEventListener('change', this.onMotionPreference);
      window.removeEventListener('pagehide', this.onPageHide);
      window.removeEventListener('pageshow', this.onPageShow);
      document.removeEventListener('visibilitychange', this.syncCursor);
    }

    snapshot(): PlaybackSnapshot {
      return {
        completed: this.completed,
        typed: this.typed,
        outputStarted: this.outputStarted,
        outputProgress: this.outputProgress,
        login: this.login,
        avatarProgress: this.avatar?.progress ?? 0,
      };
    }

    private updateLogin() {
      const time = this.querySelector<HTMLTimeElement>('[data-terminal-login]');
      if (!time) return;
      const date = new Date(this.login);
      const clock = date.toLocaleTimeString('en-GB', { hourCycle: 'h23' });
      time.dateTime = date.toISOString();
      time.textContent = `${date.toDateString()} ${clock}`;
      time.removeAttribute('title');
    }

    private onMotionPreference = () => {
      if (this.reducedMotion.matches) this.finish();
      else this.syncCursor();
    };

    // 历史缓存恢复时直接保留完整内容，避免后台页面继续播放。
    private onPageHide = () => {
      this.pageActive = false;
      this.finish();
    };

    private onPageShow = () => {
      this.pageActive = true;
      this.syncCursor();
    };

    private canBlink() {
      return (
        this.isConnected &&
        this.pageActive &&
        document.visibilityState === 'visible' &&
        this.cursorInView &&
        !this.prompt?.hidden &&
        !this.reducedMotion.matches
      );
    }

    private syncCursor = () => {
      if (!this.canBlink()) this.holdCursor();
      else if (!this.cursorAnimation) this.startCursor();
    };

    private holdCursor() {
      this.cursorAnimation?.cancel();
      this.cursorAnimation = undefined;
      if (this.cursor) this.cursor.style.opacity = '1';
    }

    private startCursor() {
      this.holdCursor();
      if (!this.cursor || !this.canBlink()) return;
      this.cursorAnimation = animateElement(
        this.cursor,
        { opacity: [1, 1, 0, 0, 1] },
        {
          duration: motionTokens.terminal.cursorDuration,
          times: [0, 0.499, 0.5, 0.999, 1],
          ease: 'linear',
          repeat: Infinity,
        },
      );
    }

    private finish() {
      this.controller?.abort();
      this.typingAnimation?.stop();
      this.outputAnimation?.stop();
      this.holdCursor();
      this.avatar?.finish();
      this.steps.forEach((step) => {
        step.setAttribute('data-visible', '');
        this.outputBlocks(step).forEach((block) => {
          block.setAttribute('data-output-visible', '');
        });
        this.renderOutput(step, 1);
        step
          .querySelector('[data-terminal-divider]')
          ?.setAttribute('data-visible', '');
      });
      this.completed = this.steps.length;
      this.typed = 0;
      this.outputStarted = false;
      this.outputProgress = 0;
      if (this.prompt) this.prompt.hidden = false;
      if (this.typing) this.typing.textContent = '';
      if (this.cursor) this.cursor.style.opacity = '1';
      this.dataset.state = 'complete';
      this.syncCursor();
    }

    private pause(seconds: number, signal: AbortSignal): Promise<void> {
      return new Promise((resolve) => {
        if (signal.aborted) return resolve();
        const done = () => {
          window.clearTimeout(timer);
          signal.removeEventListener('abort', done);
          resolve();
        };
        const timer = window.setTimeout(done, seconds * 1000);
        signal.addEventListener('abort', done, { once: true });
      });
    }

    private typeCommand(command: string, signal: AbortSignal): Promise<void> {
      return new Promise((resolve) => {
        if (signal.aborted || this.typed >= command.length) return resolve();
        const first = this.typed;
        const count = command.length - first;
        const done = () => {
          signal.removeEventListener('abort', cancel);
          this.typingAnimation = undefined;
          resolve();
        };
        const cancel = () => {
          this.typingAnimation?.stop();
          done();
        };
        signal.addEventListener('abort', cancel, { once: true });
        this.typingAnimation = animate(first, command.length, {
          duration: count * motionTokens.terminal.characterDelay,
          ease: 'linear',
          onUpdate: (value) => {
            const length = Math.floor(value);
            if (length === this.typed) return;
            this.typed = length;
            if (this.typing) this.typing.textContent = command.slice(0, length);
          },
          onComplete: () => {
            this.typed = command.length;
            if (this.typing) this.typing.textContent = command;
            done();
          },
        });
      });
    }

    private outputBlocks(step: HTMLElement): HTMLElement[] {
      return [...step.querySelectorAll<HTMLElement>('[data-terminal-output]')];
    }

    private renderOutput(step: HTMLElement, progress: number) {
      const eased = outputEase(progress);
      for (const block of this.outputBlocks(step)) {
        if (progress >= 1) {
          block.style.removeProperty('opacity');
          block.style.removeProperty('transform');
        } else {
          block.style.opacity = String(eased);
          block.style.transform = `translateY(${motionTokens.terminal.blockReveal.distance * (1 - eased)}px)`;
        }
      }
    }

    private revealOutput(
      step: HTMLElement,
      signal: AbortSignal,
    ): Promise<void> {
      return new Promise((resolve) => {
        if (signal.aborted) return resolve();
        if (this.outputProgress >= 1) {
          this.renderOutput(step, 1);
          return resolve();
        }
        // 先写初态再显现，整块输出共享同一个 Motion 时钟。
        this.renderOutput(step, this.outputProgress);
        this.outputBlocks(step).forEach((block) => {
          block.setAttribute('data-output-visible', '');
        });
        const done = () => {
          signal.removeEventListener('abort', cancel);
          this.outputAnimation = undefined;
          resolve();
        };
        const cancel = () => {
          this.outputAnimation?.stop();
          done();
        };
        signal.addEventListener('abort', cancel, { once: true });
        this.outputAnimation = animate(this.outputProgress, 1, {
          duration:
            motionTokens.terminal.blockReveal.duration *
            (1 - this.outputProgress),
          ease: 'linear',
          onUpdate: (progress) => {
            this.outputProgress = progress;
            this.renderOutput(step, progress);
          },
          onComplete: () => {
            this.outputProgress = 1;
            this.renderOutput(step, 1);
            done();
          },
        });
      });
    }

    private waitForFonts(signal: AbortSignal): Promise<void> {
      return new Promise((resolve) => {
        if (signal.aborted) return resolve();
        const done = () => {
          window.clearTimeout(timer);
          signal.removeEventListener('abort', done);
          resolve();
        };
        // 字体未就绪时使用回退字体继续播放；离开页面立即结束等待。
        const timer = window.setTimeout(
          done,
          motionTokens.terminal.fontReadyTimeout * 1000,
        );
        signal.addEventListener('abort', done, { once: true });
        void document.fonts.ready.then(done, done);
      });
    }

    private async play(signal: AbortSignal, initial: boolean) {
      if (initial) {
        await this.waitForFonts(signal);
        await this.pause(motionTokens.terminal.initialDelay, signal);
      }
      while (!signal.aborted && this.completed < this.steps.length) {
        const step = this.steps[this.completed];
        if (!step) break;
        if (!this.outputStarted) {
          // 每条命令独立从可见相位开始，短命令也能先看到光标。
          this.startCursor();
          await this.typeCommand(step.dataset.command ?? '', signal);
          if (signal.aborted) return;
          await this.pause(motionTokens.terminal.enterDelay, signal);
          if (signal.aborted) return;

          step.setAttribute('data-visible', '');
          this.outputStarted = true;
          this.holdCursor();
          if (this.prompt) this.prompt.hidden = true;
          this.typed = 0;
          if (this.typing) this.typing.textContent = '';
        }

        // 头像与整块信息同步聚合；语言切换后接着各自保存的进度播放。
        const avatarPlayback = step.querySelector('[data-terminal-avatar]')
          ? this.avatar?.play(motionTokens.terminal.blockReveal.duration)
          : undefined;
        await Promise.all([this.revealOutput(step, signal), avatarPlayback]);
        if (signal.aborted) return;

        step
          .querySelector('[data-terminal-divider]')
          ?.setAttribute('data-visible', '');
        this.completed += 1;
        this.outputStarted = false;
        this.outputProgress = 0;
        if (this.prompt) this.prompt.hidden = false;
        if (this.completed === this.steps.length) this.startCursor();

        await this.pause(motionTokens.terminal.outputDelay, signal);
      }
      if (!signal.aborted) this.dataset.state = 'complete';
    }
  }

  document.addEventListener('astro:before-swap', (event) => {
    pending = undefined;
    // ClientRouter 会替换 <html> 属性；在 swap 前带上显隐标记，避免完整输出闪现。
    if (event.newDocument.querySelector('yohoia-terminal'))
      event.newDocument.documentElement.dataset.terminalJs = 'true';
    if (
      event.navigationType !== 'traverse' &&
      event.from.pathname !== event.to.pathname &&
      /^(?:\/en)?\/?$/.test(event.from.pathname) &&
      /^(?:\/en)?\/?$/.test(event.to.pathname)
    ) {
      pending = document
        .querySelector<YohoiaTerminal>('yohoia-terminal')
        ?.snapshot();
    }
  });
  customElements.define('yohoia-terminal', YohoiaTerminal);
}
