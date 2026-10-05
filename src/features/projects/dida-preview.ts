import { animate, type AnimationPlaybackControls } from 'motion';
import { motionTokens } from '@/config/motion';
import { projectsContent } from './config';

interface DemoSnapshot {
  progress: number;
  cycle: number;
  checked: boolean[];
}

export function registerDidaPreview(): void {
  if (customElements.get('dida-preview')) return;
  let pending: DemoSnapshot | undefined;

  class DidaPreview extends HTMLElement {
    private cleanup?: () => void;
    private state?: DemoSnapshot;

    snapshot(): DemoSnapshot | undefined {
      if (!this.state) return;
      return {
        progress: this.state.progress,
        cycle: this.state.cycle,
        checked: [...this.state.checked],
      };
    }

    connectedCallback() {
      this.cleanup?.();
      const controller = new AbortController();
      const { signal } = controller;
      const locale = this.dataset.locale === 'en' ? 'en' : 'zh';
      const t = projectsContent[locale].demo;
      const tokens = motionTokens.projects.voice;
      const cycleDuration =
        tokens.duration + tokens.holdDuration + tokens.resetDuration;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const find = <T extends Element>(selector: string) =>
        this.querySelector<T>(selector);
      const voicePanel = find<HTMLElement>('[data-dida-voice-panel]');
      const resultPanel = find<HTMLElement>('[data-dida-result-panel]');
      const micIcon = find<HTMLElement>('[data-dida-mic-icon]');
      const transcript = find<HTMLElement>('[data-dida-transcript]');
      const voiceLabel = find<HTMLElement>('[data-dida-voice-label]');
      const processStatus = find<HTMLElement>('[data-dida-process-status]');
      const status = find<HTMLElement>('[data-dida-status]');
      const count = find<HTMLElement>('[data-dida-count]');
      const list = find<HTMLUListElement>('[data-dida-tasks]');
      const aiIcon = find<HTMLElement>('[data-dida-ai-icon]');
      const rows = [...this.querySelectorAll<HTMLElement>('[data-task-index]')];
      const bars = [...this.querySelectorAll<HTMLElement>('[data-dida-wave]')];
      if (
        !voicePanel ||
        !resultPanel ||
        !micIcon ||
        !transcript ||
        !voiceLabel ||
        !processStatus ||
        !status ||
        !count ||
        !list ||
        rows.length !== t.tasks.length
      )
        return;

      const state = pending ?? {
        progress: reduced.matches ? tokens.duration : 0,
        cycle: 0,
        checked: t.tasks.map(() => false),
      };
      pending = undefined;
      if (reduced.matches) state.progress = tokens.duration;
      this.state = state;
      let visible = false;
      let focused = false;
      let timeline: AnimationPlaybackControls | undefined;
      let lastPhase = '';
      const controls = new Map<Element, AnimationPlaybackControls>();
      const stopFeedback = () => {
        controls.forEach((control) => control.stop());
        controls.clear();
      };
      const move = (
        element: Element,
        values: { scale?: number | number[]; '--dida-strike'?: number },
      ) => {
        controls.get(element)?.stop();
        controls.set(
          element,
          animate(element, values, {
            duration: reduced.matches ? 0 : motionTokens.projects.checkDuration,
            ease: motionTokens.easing,
          }),
        );
      };
      const render = () => {
        const progress = state.progress;
        const entrance = Math.min(1, progress / tokens.resetDuration);
        const exit = Math.min(
          1,
          Math.max(
            0,
            (progress - tokens.duration - tokens.holdDuration) /
              tokens.resetDuration,
          ),
        );
        const ready = progress >= tokens.duration;
        const interactive = ready && exit === 0;
        const phase =
          progress < tokens.transcribeEnd
            ? 'voice'
            : progress < tokens.organizeEnd
              ? 'organizing'
              : ready
                ? 'ready'
                : 'tasks';
        this.dataset.phase = phase;
        const swap = Math.min(
          1,
          Math.max(
            0,
            (progress - tokens.organizeEnd + tokens.stageTransition) /
              tokens.stageTransition,
          ),
        );
        // 两个阶段共享右侧网格，完整文案保留自然占位，切换不改变卡片高度。
        const voiceOpacity = (1 - swap) * entrance;
        const resultOpacity = swap * (1 - exit);
        voicePanel.style.opacity = String(voiceOpacity);
        voicePanel.style.transform = `translateY(${reduced.matches ? 0 : -swap * motionTokens.distance.medium}px)`;
        voicePanel.style.visibility = voiceOpacity === 0 ? 'hidden' : 'visible';
        voicePanel.setAttribute('aria-hidden', String(voiceOpacity === 0));
        resultPanel.style.opacity = String(resultOpacity);
        resultPanel.style.transform = `translateY(${reduced.matches ? 0 : (1 - swap) * motionTokens.distance.medium}px)`;
        resultPanel.style.visibility =
          resultOpacity === 0 ? 'hidden' : 'visible';
        resultPanel.setAttribute('aria-hidden', String(resultOpacity === 0));
        resultPanel.inert = !interactive;
        micIcon.hidden = phase !== 'voice';
        if (aiIcon) aiIcon.hidden = phase === 'voice';
        const textProgress = Math.min(1, progress / tokens.transcribeEnd);
        const text = t.transcript.slice(
          0,
          Math.floor(textProgress * t.transcript.length),
        );
        transcript.textContent = `“${text}”`;
        voiceLabel.textContent =
          phase === 'voice' ? t.transcribing : t.organizing;
        processStatus.textContent =
          phase === 'voice'
            ? t.voice
            : phase === 'organizing' || phase === 'tasks'
              ? t.organizing
              : t.ready;
        list.setAttribute('aria-busy', String(!ready));
        const completed = state.checked.filter(Boolean).length;
        count.textContent = ready
          ? completed
            ? `${completed} / ${t.tasks.length} ${t.completed}`
            : t.count
          : '—';
        bars.forEach((bar, index) => {
          const scale =
            phase === 'voice'
              ? tokens.waveMinScale +
                (1 - tokens.waveMinScale) *
                  Math.abs(
                    Math.sin(
                      progress * tokens.waveFrequency * Math.PI + index * 0.7,
                    ),
                  )
              : tokens.waveMinScale;
          bar.style.transform = `scaleY(${scale})`;
        });
        if (aiIcon) {
          const working = phase === 'organizing';
          const pulse = Math.sin(progress * Math.PI * 2);
          aiIcon.style.transform = working
            ? `rotate(${pulse * 12}deg) scale(${1 + Math.abs(pulse) * 0.12})`
            : 'none';
        }
        rows.forEach((row, index) => {
          const reveal = Math.min(
            1,
            Math.max(
              0,
              (progress - tokens.organizeEnd - index * tokens.taskStagger) /
                tokens.taskRevealDuration,
            ),
          );
          const label = row.querySelector<HTMLElement>('label');
          const skeleton = row.querySelector<HTMLElement>(
            '.dida-task-skeleton',
          );
          const checkbox = row.querySelector<HTMLInputElement>('input');
          row.toggleAttribute('data-ready', reveal === 1);
          if (label) {
            label.style.opacity = String(reveal);
            label.style.transform = `translateY(${reduced.matches ? 0 : (1 - reveal) * motionTokens.distance.medium}px)`;
            label.style.visibility = reveal === 0 ? 'hidden' : 'visible';
          }
          if (skeleton) skeleton.style.opacity = String(1 - reveal);
          if (checkbox) {
            checkbox.disabled = !interactive;
            checkbox.checked = state.checked[index] ?? false;
          }
        });
        // 仅第一轮播报语义阶段，避免循环演示反复打断读屏。
        if (phase !== lastPhase) {
          lastPhase = phase;
          status.textContent =
            state.cycle > 0
              ? ''
              : phase === 'voice'
                ? t.transcribing
                : phase === 'organizing'
                  ? t.organizing
                  : phase === 'ready'
                    ? t.ready
                    : '';
        }
      };
      const startTimeline = () => {
        if (!visible || document.hidden || focused || reduced.matches) return;
        if (!timeline) {
          timeline = animate(state.progress, cycleDuration, {
            duration: cycleDuration - state.progress,
            ease: 'linear',
            onUpdate: (progress) => {
              state.progress = progress;
              render();
            },
            onComplete: () => {
              timeline = undefined;
              state.progress = 0;
              state.cycle += 1;
              state.checked.fill(false);
              settle();
              render();
              startTimeline();
            },
          });
        } else timeline.play();
      };
      const settle = () => {
        stopFeedback();
        rows.forEach((row, index) => {
          row.style.setProperty(
            '--dida-strike',
            state.checked[index] ? '1' : '0',
          );
          const checkbox = row.querySelector<HTMLElement>('.dida-checkbox');
          if (checkbox) checkbox.style.transform = 'none';
        });
      };
      list.addEventListener(
        'change',
        (event) => {
          if (
            !(event.target instanceof HTMLInputElement) ||
            state.progress < tokens.duration
          )
            return;
          const row = event.target.closest<HTMLElement>('[data-task-index]');
          if (!row) return;
          const index = Number(row.dataset.taskIndex);
          if (!Number.isInteger(index) || index < 0 || index >= rows.length)
            return;
          state.checked[index] = event.target.checked;
          move(row, { '--dida-strike': state.checked[index] ? 1 : 0 });
          const checkbox = row.querySelector<HTMLElement>('.dida-checkbox');
          if (checkbox)
            move(checkbox, {
              scale: state.checked[index]
                ? [1, motionTokens.projects.checkScale, 1]
                : 1,
            });
          render();
          status.textContent = state.checked.every(Boolean)
            ? t.finished
            : `${t.tasks[index]} · ${state.checked[index] ? t.completed : t.listTitle}`;
        },
        { signal },
      );
      const resume = () => {
        if (visible && !document.hidden && !focused) startTimeline();
        else {
          timeline?.pause();
          settle();
        }
      };
      this.addEventListener(
        'focusin',
        () => {
          focused = true;
          resume();
        },
        { signal },
      );
      this.addEventListener(
        'focusout',
        (event) => {
          focused =
            event.relatedTarget instanceof Node &&
            this.contains(event.relatedTarget);
          resume();
        },
        { signal },
      );
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry) return;
        visible = entry.isIntersecting;
        resume();
      });
      reduced.addEventListener(
        'change',
        () => {
          if (reduced.matches) {
            timeline?.stop();
            timeline = undefined;
            state.progress = tokens.duration;
            settle();
            render();
          } else resume();
        },
        { signal },
      );
      document.addEventListener('visibilitychange', resume, { signal });
      window.addEventListener(
        'pagehide',
        () => {
          timeline?.pause();
          settle();
        },
        { signal },
      );
      window.addEventListener('pageshow', resume, { signal });
      settle();
      render();
      observer.observe(this);
      this.cleanup = () => {
        controller.abort();
        observer.disconnect();
        timeline?.stop();
        stopFeedback();
      };
    }

    disconnectedCallback() {
      this.cleanup?.();
    }
  }
  document.addEventListener('astro:before-swap', (event) => {
    pending = undefined;
    if (
      event.from.pathname !== event.to.pathname &&
      /^(?:\/en)?\/project\/?$/.test(event.from.pathname) &&
      /^(?:\/en)?\/project\/?$/.test(event.to.pathname)
    ) {
      pending = document.querySelector<DidaPreview>('dida-preview')?.snapshot();
    }
  });
  customElements.define('dida-preview', DidaPreview);
}
