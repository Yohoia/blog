import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/config/locale";
import { localizePath } from "@/lib/locale-path";
import { iconTokens } from "@/config/icons";
import {
  errorPages,
  errorActions,
  type ErrorCode,
} from "@/features/errors/error-content";
import { Media } from "@/components/ui/Media";
export function ErrorPage({
  code,
  locale = "zh",
}: {
  code: ErrorCode;
  locale?: Locale;
}) {
  const content = errorPages[code].content[locale];
  return (
    <>
      <main
        id="main-content"
        lang={locale === "zh" ? "zh-CN" : "en"}
        data-width="compact"
        className="site-container error-page"
        data-error-code={code}
        aria-labelledby="error-heading"
      >
        <div className="error-content" data-language-block="error">
          <Media
            src={`/images/${code}.png`}
            sizes="(max-width: 40rem) min(calc(100vw - 2.5rem), 66.67svh), min(66.67svh, 40rem)"
            alt={`${code} · ${content.heading}`}
            className="error-illustration"
            loading="eager"
            fetchPriority="high"
            data-error-illustration
          />
          <div className="error-message">
            <h1 id="error-heading" className="text-section font-medium">
              <span className="font-mono">{code}</span> ·{" "}
              <span data-error-heading>{content.heading}</span>
            </h1>
            <p className="text-meta" data-error-description>
              {content.description}
            </p>
          </div>
          <a
            href={localizePath("/", locale)}
            className="ui-button"
            data-variant="outline"

            data-error-home
          >
            <ArrowLeft
              size={iconTokens.size.small}
              strokeWidth={iconTokens.strokeWidth}
              aria-hidden="true"
            />
            <span data-error-home-label>{errorActions[locale].home}</span>
          </a>
        </div>
      </main>
    </>
  );
}
