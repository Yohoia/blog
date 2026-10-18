import { ArrowRight, Check, Mic, Sparkles, Scissors } from "lucide-react";
import type { CSSProperties } from "react";
import type { Locale } from "@/config/locale";
import { iconTokens } from "@/config/icons";
import { projectsContent } from "@/features/projects/project-content";
export function DidaPreview({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const t = projectsContent[locale].demo;
  return (
    <>
      <dida-preview
        className="project-preview"
        data-locale={locale}
        data-phase="ready"
        aria-label={`${title} · ${t.label}`}
      >
        <div className="dida-scene">
          <div className="dida-demo-stage">
            <div
              className="dida-voice"
              data-dida-voice-panel
              aria-hidden="true"
            >
              <div className="dida-voice-capsule">
                <span className="dida-mic" aria-hidden="true">
                  <span data-dida-mic-icon>
                    <Mic
                      size={iconTokens.size.normal}
                      strokeWidth={iconTokens.strokeWidth}
                    />
                  </span>
                  <span data-dida-ai-icon hidden>
                    <Sparkles
                      size={iconTokens.size.normal}
                      strokeWidth={iconTokens.strokeWidth}
                    />
                  </span>
                </span>
                <span className="dida-wave" aria-hidden="true">
                  {Array.from({ length: 27 }, (_, index) => (
                    <span
                      style={
                        {
                          "--wave-height": `${8 + Math.sin(index * 1.7) ** 2 * 16}px`,
                        } as CSSProperties
                      }
                      data-dida-wave
                      key={index}
                    ></span>
                  ))}
                </span>
                <span className="dida-recording-dot" aria-hidden="true"></span>
              </div>
              <p className="dida-voice-label" data-dida-voice-label>
                {t.voice}
              </p>
              <div className="dida-transcript" aria-label={t.transcriptLabel}>
                <span className="dida-transcript-spacer" aria-hidden="true">
                  “{t.transcript}”
                </span>
                <span data-dida-transcript>“{t.transcript}”</span>
              </div>
            </div>
            <div className="dida-list" data-dida-result-panel>
              <div className="dida-list-meta">
                <span>
                  <Sparkles
                    size={iconTokens.size.small}
                    strokeWidth={iconTokens.strokeWidth}
                  />
                  <span>{t.listTitle}</span>
                </span>
                <span className="font-mono" data-dida-count>
                  {t.count}
                </span>
              </div>
              <ul className="dida-tasks" data-dida-tasks>
                {t.tasks.map((task, index) => (
                  <li
                    key={task}
                    className="dida-task"
                    data-task-index={index}
                    data-ready
                  >
                    <span className="dida-task-skeleton" aria-hidden="true">
                      <span></span>
                      <span></span>
                    </span>
                    <label>
                      <input
                        type="checkbox"
                        disabled
                        aria-label={`${t.completeLabel} ${task}`}
                      />
                      <span className="dida-checkbox" aria-hidden="true">
                        <Check
                          size={iconTokens.size.small}
                          strokeWidth={iconTokens.strokeWidth}
                        />
                      </span>
                      <span className="dida-task-title">{task}</span>
                      <span className="dida-task-time font-mono">
                        {t.times[index]}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <p className="dida-process-status" data-dida-process-status>
                {t.ready}
              </p>
            </div>
          </div>
        </div>
        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          data-dida-status
        ></p>
        <noscript>
          <p className="dida-noscript">{t.noScript}</p>
        </noscript>
      </dida-preview>
    </>
  );
}
