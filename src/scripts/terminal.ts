import { animate, type AnimationPlaybackControls } from 'motion';
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
  revealedLines: number;
  login: string;
  avatarProgress: number;
}

/** SSR 提供完整内容；浏览器仅负责播放呈现，不执行任何终端命令。 */
export function registerTerminal(): void {
  if (customElements.get('yohoia-terminal')) return;
  let pending: PlaybackSnapshot | undefined;

  class YohoiaTerminal extends HTMLElement {
    private prompt: HTMLElement | null = null;
    private typing: HTMLElement | null = null;
    private cursor: HTMLElement | null = null;
    private steps: HTMLElement[] = [];
    private completed = 0;
    private typed = 0;
    private outputStarted = false;
    private revealedLines = 0;
    private login = '';
    private controller?: AbortController;
    private typingAnimation?: AnimationPlaybackControls;
    private lineAnimation?: AnimationPlaybackControls;
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
      this.revealedLines = saved?.revealedLines ?? 0;
      this.prompt.hidden = this.outputStarted;
      this.login = saved?.login ?? new Date().toISOString();
      this.updateLogin();
      this.steps.forEach((step, index) => {
        const complete = index < this.completed;
        const active = index === this.completed && this.outputStarted;
        step.toggleAttribute('data-visible', complete || active);
        this.outputLines(step).forEach((line, lineIndex) => {
          line.toggleAttribute(
            'data-line-visible',
            complete || (active && lineIndex < this.revealedLines),
          );
        });
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
      this.lineAnimation?.cancel();
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
        revealedLines: this.revealedLines,
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
      this.lineAnimation?.cancel();
      this.holdCursor();
      this.avatar?.finish();
      this.steps.forEach((step) => {
        step.setAttribute('data-visible', '');
        this.outputLines(step).forEach((line) => {
          line.setAttribute('data-line-visible', '');
          line.style.removeProperty('opacity');
          line.style.removeProperty('transform');
        });
        step
          .querySelector('[data-terminal-divider]')
          ?.setAttribute('data-visible', '');
      });
      this.completed = this.steps.length;
      this.typed = 0;
      this.outputStarted = false;
      this.revealedLines = 0;
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

    private outputLines(step: HTMLElement): HTMLElement[] {
      return [...step.querySelectorAll<HTMLElement>('[data-terminal-line]')];
    }

    private revealLine(line: HTMLElement, signal: AbortSignal): Promise<void> {
      return new Promise((resolve) => {
        if (signal.aborted) return resolve();
        const done = () => {
          signal.removeEventListener('abort', cancel);
          this.lineAnimation = undefined;
          resolve();
        };
        const cancel = () => {
          this.lineAnimation?.cancel();
          done();
        };
        signal.addEventListener('abort', cancel, { once: true });
        const { duration, distance } = motionTokens.terminal.lineReveal;
        // 原生 DOM 动画可直接取消，避免减少动画时留下逐帧写回的中间样式。
        this.lineAnimation = animateElement(
          line,
          { opacity: [0, 1], transform: [`translateY(${distance}px)`, 'none'] },
          { duration, ease: 'linear', onComplete: done },
        );
      });
    }

    private async play(signal: AbortSignal, initial: boolean) {
      if (initial) {
        await document.fonts.ready;
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

        const lines = this.outputLines(step);
        // 从第一行信息开始聚合，时长覆盖整个 whoami 输出；语言切换接着当前进度播放。
        const avatarPlayback = step.querySelector('[data-terminal-avatar]')
          ? this.avatar?.play(
              lines.length * motionTokens.terminal.lineReveal.duration +
                Math.max(0, lines.length - 1) *
                  motionTokens.terminal.lineReveal.interval,
            )
          : undefined;
        for (let index = this.revealedLines; index < lines.length; index++) {
          if (signal.aborted) return;
          const line = lines[index];
          if (!line) break;
          line.setAttribute('data-line-visible', '');
          this.revealedLines = index + 1;
          await this.revealLine(line, signal);
          if (signal.aborted) return;
          if (index < lines.length - 1)
            await this.pause(motionTokens.terminal.lineReveal.interval, signal);
        }
        await avatarPlayback;
        if (signal.aborted) return;

        step
          .querySelector('[data-terminal-divider]')
          ?.setAttribute('data-visible', '');
        this.completed += 1;
        this.outputStarted = false;
        this.revealedLines = 0;
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
