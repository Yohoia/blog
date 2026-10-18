import type { Locale } from "@/config/locale";
import { localeMetadata } from "@/config/locale";
import { localizePath } from "@/lib/locale-path";
import type { BlogEntry } from "@/lib/content";
import { sortByDate } from "@/features/blog/ordering";
import { getBlogExcerpt } from "@/features/blog/reading";
import { ui } from "@/i18n/translations";
import { Media } from "@/components/ui/Media";
export function BlogPage({
  locale,
  published,
}: {
  locale: Locale;
  published: BlogEntry[];
}) {
  const entries = sortByDate(
    published.map((entry) => ({
      title: entry.data.title,
      publishedAt: new Date(entry.data.publishedAt).toISOString(),
      tags: entry.data.tags,
      href: localizePath(
        `/blog/${entry.id.split("/").map(encodeURIComponent).join("/")}`,
        locale,
      ),
      language: entry.data.language,
      excerpt: getBlogExcerpt(entry.body ?? ""),
      anchor: entry.id,
      thumbnail: entry.data.thumbnail ?? entry.data.cover,
      thumbnailAlt: entry.data.thumbnail
        ? (entry.data.thumbnailAlt ?? "")
        : (entry.data.coverAlt ?? ""),
    })),
    (entry) => new Date(entry.publishedAt),
  );
  const years = new Map<number, Map<number, typeof entries>>();
  for (const entry of entries) {
    const date = new Date(entry.publishedAt);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const months = years.get(year) ?? new Map<number, typeof entries>();
    const posts = months.get(month) ?? [];
    posts.push(entry);
    months.set(month, posts);
    years.set(year, months);
  }
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  });
  const yearGroups = [...years].map(([year, months]) => ({
    year,
    count: [...months.values()].reduce(
      (total, posts) => total + posts.length,
      0,
    ),
    months: [...months].map(([month, posts]) => ({
      name: monthFormatter.format(new Date(Date.UTC(year, month, 1))),
      number: String(month + 1).padStart(2, "0"),
      posts,
    })),
  }));

  return (
    <>
      <main
        id="main-content"
        data-width="reading"
        className="site-container blog-page"
      >
        <header
          className="blog-introduction"
          data-language-block="introduction"
        >
          <h1 className="page-title text-page font-semibold" lang="en">
            <span className="title-highlight">
              {ui[locale].navigation.blog}
            </span>
          </h1>
        </header>

        <blog-archive>
          <div className="blog-years">
            {yearGroups.map((group) => (
              <section
                key={group.year}
                className="blog-entries"
                aria-labelledby={`blog-year-${group.year}`}
              >
                <div className="blog-year-background" aria-hidden="true">
                  {group.year}
                </div>
                <h2 id={`blog-year-${group.year}`} className="visually-hidden">
                  {group.year}
                </h2>
                <div className="blog-months">
                  {group.months.map((month) => (
                    <section
                      key={month.number}
                      className="blog-month"
                      aria-label={`${group.year} ${month.name}`}
                    >
                      <div className="blog-month-label">
                        <div className="blog-month-sticky micro-label">
                          <span>{month.name}</span>
                        </div>
                      </div>
                      <ol className="blog-posts">
                        {month.posts.map((entry) => (
                          <li
                            key={entry.anchor}
                            id={entry.anchor}
                            data-language-block={`blog-${entry.anchor}`}
                          >
                            <article
                              className="blog-post"
                              aria-labelledby={`${entry.anchor}-title`}
                              data-blog-post
                            >
                              <a
                                className="blog-post-link"
                                href={entry.href}
                                aria-label={entry.title}
                              >
                                <div className="blog-post-preview">
                                  {entry.thumbnail && (
                                    <Media
                                      className="blog-post-thumbnail"
                                      src={entry.thumbnail}
                                      alt={entry.thumbnailAlt}
                                      width={180}
                                      sizes="(max-width: 40rem) 112px, 180px"
                                      loading="lazy"
                                    />
                                  )}
                                  <div className="blog-post-copy">
                                    <h3
                                      id={`${entry.anchor}-title`}
                                      className="blog-post-title text-section font-medium"
                                      title={entry.title}
                                      lang={
                                        localeMetadata[entry.language].language
                                      }
                                      data-blog-title
                                    >
                                      <span
                                        className="blog-title-highlight"
                                        data-blog-highlight
                                      >
                                        {entry.title}
                                      </span>
                                    </h3>
                                    {entry.excerpt && (
                                      <p
                                        className="blog-post-excerpt"
                                        lang={
                                          localeMetadata[entry.language]
                                            .language
                                        }
                                        title={entry.excerpt}
                                      >
                                        {entry.excerpt}
                                      </p>
                                    )}
                                    <div className="blog-post-meta font-mono text-meta text-muted-text">
                                      <time
                                        dateTime={entry.publishedAt}
                                        className="blog-date"
                                      >
                                        <span className="blog-day">
                                          {new Date(
                                            entry.publishedAt,
                                          ).getUTCDate()}
                                        </span>
                                        <span className="blog-weekday">
                                          {weekdayFormatter.format(
                                            new Date(entry.publishedAt),
                                          )}
                                        </span>
                                      </time>
                                      <div className="blog-post-tags" lang="en">
                                        {entry.tags.slice(0, 3).map((tag) => (
                                          <span
                                            key={tag}
                                            className="blog-tag"
                                            data-blog-tag
                                          >
                                            #{tag}
                                            <span
                                              className="blog-tag-underline"
                                              data-blog-tag-underline
                                              aria-hidden="true"
                                            ></span>
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </article>
                          </li>
                        ))}
                      </ol>
                    </section>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </blog-archive>
      </main>
    </>
  );
}
