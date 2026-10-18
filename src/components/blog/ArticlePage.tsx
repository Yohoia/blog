import {
  CalendarDays,
  Clock3,
  CornerUpLeft,
  RefreshCw,
  Tags,
  Type,
} from "lucide-react";
import type { BlogEntry } from "@/lib/content";
import { renderArticle } from "@/lib/article";
import { getReadingStats } from "@/features/blog/reading";
import type { Locale } from "@/config/locale";
import { localeMetadata } from "@/config/locale";
import { siteConfig } from "@/config/site";
import { iconTokens } from "@/config/icons";
import { localizePath } from "@/lib/locale-path";
import { ArticleToc } from "./ArticleToc";
import { ArticleRail } from "./ArticleRail";
import { Media } from "@/components/ui/Media";
import { SimpleEditor } from "@/components/tiptap/SimpleEditor";
export async function ArticlePage({
  entry,
  locale,
}: {
  entry: BlogEntry;
  locale: Locale;
}) {
  const { html, content, headings } = await renderArticle(entry.body);
  const stats = getReadingStats(entry.body);
  const date = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  })
    .format(entry.data.publishedAt)
    .replaceAll("-", "/");
  const updatedDate = entry.data.updatedAt
    ?.toISOString()
    .slice(0, 10)
    .replaceAll("-", "/");
  const updatedLabel = `${locale === "zh" ? "更新于" : "Updated"} ${updatedDate}`;
  const back = locale === "zh" ? "返回 Blog" : "Back to Blog";
  const iconProps = {
    size: iconTokens.size.small,
    strokeWidth: iconTokens.strokeWidth,
    "aria-hidden": true as const,
    className: "article-meta-icon",
  };
  return (
    <main id="main-content" className="article-page">
      <article className="article-main" data-article-content>
        <nav className="article-return" aria-label={back}>
          <a
            href={localizePath("/blog", locale)}
            className="article-back"
            aria-label={back}
            title={back}
          >
            <span className="article-back-icon" aria-hidden="true">
              <CornerUpLeft {...iconProps} />
            </span>
            <code lang="en">cd ../</code>
          </a>
        </nav>
        <header className="article-header" data-language-block="article-header">
          <h1
            className="article-title"
            lang={localeMetadata[entry.data.language].language}
          >
            {entry.data.title}
          </h1>
          <div
            className="article-meta"
            aria-label={locale === "zh" ? "文章信息" : "Article information"}
          >
            <span className="article-meta-item article-author">
              <Media
                src="/media/yohoia-avatar.jpg"
                alt=""
                width={20}
                height={20}
                sizes="20px"
                className="article-author-avatar"
              />
              <span>{siteConfig.name}</span>
            </span>
            <time
              className="article-meta-item"
              dateTime={entry.data.publishedAt.toISOString()}
            >
              <CalendarDays {...iconProps} />
              <span>{date}</span>
            </time>
            {entry.data.tags.length > 0 && (
              <span className="article-meta-item article-tags">
                <Tags {...iconProps} />
                {entry.data.tags.map((tag) => (
                  <span className="article-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </span>
            )}
            <span className="article-meta-item">
              <Type {...iconProps} />
              <span>
                {stats.units.toLocaleString(localeMetadata[locale].dateLocale)}{" "}
                {locale === "zh" ? "字" : "words"}
              </span>
            </span>
            <span className="article-meta-item">
              <Clock3 {...iconProps} />
              <span>
                {stats.minutes}
                {locale === "zh" ? "分钟" : " min"}
              </span>
            </span>
            {entry.data.updatedAt && (
              <time
                className="article-meta-item article-updated"
                dateTime={entry.data.updatedAt.toISOString()}
                aria-label={updatedLabel}
                title={updatedLabel}
              >
                <RefreshCw {...iconProps} />
                <span>{updatedDate}</span>
              </time>
            )}
          </div>
        </header>
        {entry.data.cover && (
          <figure className="article-cover">
            <Media
              src={entry.data.cover}
              alt={entry.data.coverAlt ?? ""}
              sizes="min(920px, calc(100vw - 3.75rem))"
            />
            {entry.data.coverAlt && (
              <figcaption>{entry.data.coverAlt}</figcaption>
            )}
          </figure>
        )}
        <div
          className="prose article-prose"
          data-editorial="serif"
          lang={localeMetadata[entry.data.language].language}
          data-language-block="article-body"
        >
          <SimpleEditor
            content={content}
            html={html}
            ariaLabel={entry.data.title}
          />
        </div>
      </article>
      <div className="article-side">
        <ArticleToc headings={headings} locale={locale} />
        <ArticleRail locale={locale} title={entry.data.title} />
      </div>
    </main>
  );
}
