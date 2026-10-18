import {
  ChevronLeft,
  Bell,
  CircleArrowUp,
  Gift,
  MessagesSquare,
  Send,
  ThumbsUp,
} from "lucide-react";
import type { Locale } from "@/config/locale";
import { iconTokens } from "@/config/icons";
import { siteConfig } from "@/config/site";
import type { Heading } from "@/lib/article";
export function ArticleToc({
  headings,
  locale,
}: {
  headings: Heading[];
  locale: Locale;
}) {
  const items = headings.filter((h) => h.depth >= 2 && h.depth <= 4);
  const label = locale === "zh" ? "文章目录" : "Table of contents";
  return (
    <>
      {items.length > 0 && (
        <aside className="article-aside">
          <article-toc>
            <button
              className="toc-edge-trigger"
              type="button"
              aria-label={
                locale === "zh" ? "显示文章目录" : "Show table of contents"
              }
              title={label}
              aria-expanded="false"
              aria-controls="article-toc-panel"
              data-toc-trigger
              data-open-label={
                locale === "zh" ? "收起文章目录" : "Hide table of contents"
              }
              data-closed-label={
                locale === "zh" ? "显示文章目录" : "Show table of contents"
              }
            >
              <ChevronLeft
                strokeWidth={iconTokens.strokeWidth}
                aria-hidden="true"
              />
            </button>
            <h2 className="toc-title">On this page</h2>
            <div className="toc-panel" id="article-toc-panel" data-toc-panel>
              <nav className="toc-nav" aria-label={label} data-toc-nav>
                <div className="toc-scroll" data-toc-scroll>
                  <ol className="toc-list">
                    {items.map((heading) => (
                      <li key={heading.slug}>
                        <a
                          href={`#${heading.slug}`}
                          className="toc-link"
                          data-toc-link
                          data-depth={heading.depth}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            </div>
          </article-toc>
        </aside>
      )}
    </>
  );
}
