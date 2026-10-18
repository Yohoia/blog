import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/locale";
import { iconTokens } from "@/config/icons";
import { projectsContent } from "@/features/projects/project-content";
import type { ProjectEntry } from "@/lib/content";
import { Media } from "@/components/ui/Media";
import { DidaPreview } from "./DidaPreview";
import { ClipperPreview } from "./ClipperPreview";
export function ProjectsPage({
  locale,
  projects,
}: {
  locale: Locale;
  projects: ProjectEntry[];
}) {
  const t = projectsContent[locale];
  return (
    <>
      <main
        id="main-content"
        data-width="feature"
        className="site-container projects-page"
      >
        <header
          className="projects-heading"
          data-language-block="projects-intro"
        >
          <h1 className="page-title text-page font-semibold" lang="en">
            <span className="title-highlight">{t.title}</span>
          </h1>
        </header>

        <ol className="project-chapters">
          {projects.map(({ id, data }, index) => (
            <li key={id} data-language-block={`project-${id}`}>
              <article
                className={`project-chapter ${!data.demo ? "project-chapter-static" : ""}`}
                aria-labelledby={`project-${id}-title`}
              >
                <div className="project-info">
                  <div className="project-identity">
                    <Media
                      src={data.logo}
                      alt=""
                      width={48}
                      className="project-logo"
                    />
                    <h2
                      id={`project-${id}-title`}
                      className="text-section font-semibold"
                    >
                      {data.title}
                    </h2>
                  </div>
                  <p className="project-summary">
                    {locale === "zh" ? data.summary : data.summaryEn}
                  </p>
                  <div className="project-actions">
                    <p className="project-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <project-links className="project-links">
                      <a
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <span className="project-link-label">
                          {(locale === "zh"
                            ? data.linkLabel
                            : data.linkLabelEn) ?? t.visit}
                        </span>
                        <ArrowRight
                          size={iconTokens.size.small}
                          strokeWidth={iconTokens.strokeWidth}
                        />
                      </a>
                      <a
                        href={data.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-source"
                        aria-label={`${data.title} · ${t.source}`}
                      >
                        <span className="project-link-label">GitHub</span>
                        <ArrowUpRight
                          size={iconTokens.size.small}
                          strokeWidth={iconTokens.strokeWidth}
                        />
                      </a>
                    </project-links>
                  </div>
                </div>
                {data.demo === "dida" && (
                  <DidaPreview locale={locale} title={data.title} />
                )}
                {data.demo === "clipper" && (
                  <ClipperPreview locale={locale} title={data.title} />
                )}
              </article>
            </li>
          ))}
        </ol>
        {!projects.length && <p>{t.empty}</p>}
      </main>
    </>
  );
}
