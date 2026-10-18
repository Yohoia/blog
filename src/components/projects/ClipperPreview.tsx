import { ArrowRight, Check, Mic, Sparkles, Scissors } from "lucide-react";
import type { CSSProperties } from "react";
import type { Locale } from "@/config/locale";
import { iconTokens } from "@/config/icons";
import { clipperContent } from "@/features/projects/clipper-content";
export function ClipperPreview({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const t = clipperContent[locale];
  return (
    <>
      <clipper-preview
        className="project-preview clipper-preview"
        data-locale={locale}
        data-phase="ready"
        aria-label={`${title} · ${t.label}`}
      >
        <div className="clipper-heading" aria-hidden="true">
          <Scissors
            size={iconTokens.size.small}
            strokeWidth={iconTokens.strokeWidth}
          />
          <span>{t.article}</span>
          <ArrowRight
            size={iconTokens.size.small}
            strokeWidth={iconTokens.strokeWidth}
          />
          <span className="font-mono">Markdown</span>
        </div>
        <div className="clipper-stage" aria-hidden="true">
          <div className="clipper-paper clipper-original" data-clipper-source>
            <div className="clipper-article" lang="zh">
              <h3>{t.title}</h3>
              <p>
                <span className="clipper-selection">{t.paragraph}</span>
              </p>
            </div>
            <p className="clipper-noise">{t.noise}</p>
          </div>
          <div className="clipper-paper clipper-markdown" data-clipper-result>
            <div className="clipper-markdown-body font-mono" lang="zh">
              <h3>
                <span># </span>
                {t.title}
              </h3>
              <p>{t.paragraph}</p>
            </div>
            <p className="clipper-destination">
              <Check
                size={iconTokens.size.small}
                strokeWidth={iconTokens.strokeWidth}
              />
              {t.destination}
            </p>
          </div>
        </div>
        <p className="clipper-status" aria-hidden="true" data-clipper-caption>
          {t.ready}
        </p>
        <p className="sr-only">
          {t.label}：{t.title}。
        </p>
        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          data-clipper-status
        ></p>
      </clipper-preview>
    </>
  );
}
