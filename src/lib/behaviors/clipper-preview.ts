import { animate, cubicBezier, type AnimationPlaybackControls } from "motion";
import { motionTokens } from "@/config/motion";
import { clipperContent } from "@/features/projects/clipper-content";

interface ClipperSnapshot {
  progress: number;
  cycle: number;
}

export function registerClipperPreview(): void {
  if (customElements.get("clipper-preview")) return;
  let pending: ClipperSnapshot | undefined;

  class ClipperPreview extends HTMLElement {
    private cleanup?: () => void;
    private state?: ClipperSnapshot;

    snapshot(): ClipperSnapshot | undefined {
      return this.state ? { ...this.state } : undefined;
    }

    connectedCallback(): void {
      this.cleanup?.();
      const controller = new AbortController();
      const { signal } = controller;
      const source = this.querySelector<HTMLElement>("[data-clipper-source]");
      const result = this.querySelector<HTMLElement>("[data-clipper-result]");
      const caption = this.querySelector<HTMLElement>("[data-clipper-caption]");
      const status = this.querySelector<HTMLElement>("[data-clipper-status]");
      if (!source || !result || !caption || !status) return;

      const locale = this.dataset.locale === "en" ? "en" : "zh";
      const text = clipperContent[locale];
      const tokens = motionTokens.projects.clipper;
      const total =
        tokens.duration + tokens.holdDuration + tokens.resetDuration;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      const state = pending ?? { progress: 0, cycle: 0 };
      pending = undefined;
      if (reduced.matches) state.progress = tokens.duration;
      this.state = state;
      let timeline: AnimationPlaybackControls | undefined;
      let visible = false;
      let focused = this.contains(document.activeElement);
      let inPage = true;
      let lastPhase = "";
      const ease = cubicBezier(...motionTokens.easing);
      const fraction = (start: number, end: number) =>
        ease(
          Math.max(0, Math.min(1, (state.progress - start) / (end - start))),
        );

      const render = () => {
        const selection = fraction(tokens.selectStart, tokens.selectEnd);
        const swap = fraction(tokens.extractStart, tokens.extractEnd);
        const entrance = fraction(0, tokens.resetDuration);
        const exit = fraction(tokens.duration + tokens.holdDuration, total);
        const phase =
          state.progress < tokens.extractStart
            ? "article"
            : state.progress < tokens.duration
              ? "extracting"
              : "ready";
        this.dataset.phase = phase;
        const sourceOpacity = (1 - swap) * entrance;
        const resultOpacity = swap * (1 - exit);
        source.style.opacity = String(sourceOpacity);
        source.style.visibility = sourceOpacity === 0 ? "hidden" : "visible";
        result.style.opacity = String(resultOpacity);
        result.style.visibility = resultOpacity === 0 ? "hidden" : "visible";
        source.style.transform = reduced.matches
          ? "none"
          : `translateY(${-swap * motionTokens.distance.medium}px) rotateX(${swap * 8}deg)`;
        result.style.transform = reduced.matches
          ? "none"
          : `translateY(${(1 - swap) * motionTokens.distance.medium}px)`;
        this.style.setProperty("--clipper-selection", `${selection * 100}%`);
        caption.textContent = text[phase];
        if (phase !== lastPhase) {
          lastPhase = phase;
          // 自动循环只在首轮完成时播报，避免反复打断读屏。
          status.textContent =
            state.cycle === 0 && phase === "ready" ? text.ready : "";
        }
      };

      const resume = () => {
        if (
          !visible ||
          !inPage ||
          document.hidden ||
          focused ||
          reduced.matches
        ) {
          timeline?.pause();
          return;
        }
        if (timeline) {
          timeline.play();
          return;
        }
        timeline = animate(state.progress, total, {
          duration: total - state.progress,
          ease: "linear",
          onUpdate: (progress) => {
            state.progress = progress;
            render();
          },
          onComplete: () => {
            timeline = undefined;
            state.progress = 0;
            state.cycle += 1;
            render();
            resume();
          },
        });
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        resume();
      });
      this.addEventListener(
        "focusin",
        () => {
          focused = true;
          resume();
        },
        { signal },
      );
      this.addEventListener(
        "focusout",
        (event) => {
          focused =
            event.relatedTarget instanceof Node &&
            this.contains(event.relatedTarget);
          resume();
        },
        { signal },
      );
      reduced.addEventListener(
        "change",
        () => {
          if (reduced.matches) {
            timeline?.stop();
            timeline = undefined;
            state.progress = tokens.duration;
            render();
          } else resume();
        },
        { signal },
      );
      document.addEventListener("visibilitychange", resume, { signal });
      window.addEventListener(
        "pagehide",
        () => {
          inPage = false;
          resume();
        },
        { signal },
      );
      window.addEventListener(
        "pageshow",
        () => {
          inPage = true;
          resume();
        },
        { signal },
      );
      render();
      observer.observe(this);
      this.cleanup = () => {
        controller.abort();
        observer.disconnect();
        timeline?.stop();
      };
    }

    disconnectedCallback(): void {
      this.cleanup?.();
    }
  }

  document.addEventListener("site:before-swap", (event) => {
    pending = undefined;
    if (
      event.navigationType !== "traverse" &&
      event.from.pathname !== event.to.pathname &&
      /^(?:\/en)?\/project\/?$/.test(event.from.pathname) &&
      /^(?:\/en)?\/project\/?$/.test(event.to.pathname)
    ) {
      pending = document
        .querySelector<ClipperPreview>("clipper-preview")
        ?.snapshot();
    }
  });
  customElements.define("clipper-preview", ClipperPreview);
}
